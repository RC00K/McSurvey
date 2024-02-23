import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions, CameraPreviewFlashMode } from '@capacitor-community/camera-preview';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonIcon, IonButton, isPlatform } from '@ionic/react';
import { close, checkmark, images, sync, camera, } from 'ionicons/icons';
import './CameraContainer.css';
import shuttersound from '../../assets/sounds/shuttersound.mp3';

interface CameraContainerProps {
  isCameraActive: boolean;
  handleCloseCamera: () => void;
  onImageSave: (savedImage: string) => void;
  onImageCaptured: (image: string) => void;
}

const CameraContainer: React.FC<CameraContainerProps> = ({ isCameraActive, handleCloseCamera, onImageSave, onImageCaptured }) => {
  const [image, setImage] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [isCameraOpening, setIsCameraOpening] = useState<boolean>(false);
  const [reviewMode, setReviewMode] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isCameraActive) {
      openCamera();
    } else if (cameraActive) {
        stopCamera();
    }

    return () => {
        if (cameraActive) {
            stopCamera();
        }
    }
  }, []);

  useEffect(() => {
    if (image) {
      console.log('Image captured: ', image);
    }
  }, [image]);

  const openCamera = async () => {
    if (!cameraActive && !isCameraOpening) {
        setIsCameraOpening(true);
        const cameraPreviewOptions: CameraPreviewOptions = {
            position: 'rear',
            toBack: true,
            rotateWhenOrientationChanged: true,
            enableZoom: true,
            parent: 'cameraPreview',
            className: 'camera__container',
        }
        try {
            await CameraPreview.stop();
            await CameraPreview.start(cameraPreviewOptions);
            setCameraActive(true);
            setIsCameraOpening(false);
        } catch (error: any) {
            console.error('Error opening camera: ' + error.message || JSON.stringify(error));
            setIsCameraOpening(false);
        } finally {
            setCameraActive(true);
            setIsCameraOpening(false);
        }
    } else {
      console.log('Camera already open');
    }
  };

  const stopCamera = async () => {
    try {
      await CameraPreview.stop();
      setCameraActive(false);
      setTimeout(() => handleCloseCamera(), 300);
    } catch (error: any) {
      console.error('Error stopping camera:'+ error.message || JSON.stringify(error));
    }
  };

  const captureImage = async () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        const cameraPreviewPictureOptions: CameraPreviewPictureOptions = {
          quality: 100
        };
        return CameraPreview.capture(cameraPreviewPictureOptions);
      }).then(result => {
        setImage(`data:image/jpeg;base64,${result.value}`);
        setReviewMode(true);
        if (onImageCaptured) {
          onImageCaptured(`data:image/jpeg;base64,${result.value}`);
        }
      }).catch(error => {
        console.error('Error capturing image: ', error);
      });
    }
  };

  const flipCamera = async () => {
    await CameraPreview.flip();
  };

  const handleSaveImage = async () => {
    console.log('Save Image button clicked');
    if (onImageSave && typeof onImageSave === 'function') {
      onImageSave(image || '');
    }
    await stopCamera()
        .then(() => {
            handleCloseCamera();
        })
        .catch(error => {
            console.error('Error stopping camera:'+ error.message || JSON.stringify(error));
        });
  };

  const handleRetakeImage = () => {
    // Clear the current image and go back to camera
    setImage(null);
    setReviewMode(false);
  }
   
  return (
    <div className="camera__content">
      <div id="cameraPreview" className={'camera__container' ? '' : 'camera__container--inactive'}>
        <div className="camera__overlay">
          {cameraActive && (
            <>
              <div onClick={stopCamera}>
                <IonIcon icon={close} className="camera__close" />
              </div>
              <div className="capture__button" onClick={captureImage}>
                <div className="capture__button__inner" />
              </div>
              <div onClick={flipCamera}>
                <IonIcon icon={sync} className="camera__flip" />
              </div>  
              <audio ref={audioRef} src={shuttersound} />
            </>
          )}
          {reviewMode && image && (
            <div className="image__review">
              <img src={image} alt="Captured" />
              <div className="review__buttons">
                <button className="retake__button" onClick={handleRetakeImage}>
                  <IonIcon icon={close} className="retake__button__icon" />
                </button>
                <button className="save__button" onClick={handleSaveImage}>
                  <IonIcon icon={checkmark} className="save__button__icon" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraContainer;