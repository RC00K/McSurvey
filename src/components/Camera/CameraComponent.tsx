import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions, CameraPreviewFlashMode } from '@capacitor-community/camera-preview';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonIcon, IonButton, isPlatform } from '@ionic/react';
import { close, checkmark, images, sync,  } from 'ionicons/icons';
import './CameraComponent.css';
import shuttersound from '../../assets/sounds/shuttersound.mp3';

interface CameraComponentProps {
    isCameraActive: boolean;
    handleCloseCamera: () => void;
    onImageSave: (savedImage: string) => void;
}


const CameraComponent: React.FC<CameraComponentProps> = ({ isCameraActive, handleCloseCamera, onImageSave }) => {
    const [image, setImage] = useState<string | null>(null);
    const [cameraActive, setCameraActive] = useState<boolean>(false);
    const [reviewMode, setReviewMode] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (isCameraActive) {
            openCamera();
        } else {
            stopCamera();
        }
    }, [isCameraActive]);

    useEffect(() => {
        if (image) {
            console.log('Image captured: ', image);
        }
    }, [image]);

    const openCamera = async () => {
        try {
            console.log('Opening the camera');
            const cameraPreviewOptions: CameraPreviewOptions = {
                position: 'rear',
                toBack: true,
                rotateWhenOrientationChanged: true,
                enableZoom: true,
                parent: 'cameraPreview',
                className: 'camera__container',
            };
            await CameraPreview.start(cameraPreviewOptions);
            setCameraActive(true);   
        } catch (error) {
            console.error('Error opening camera: ' + error);
        }
    };

    const stopCamera = async () => {
        await CameraPreview.stop();
        setCameraActive(false);
        handleCloseCamera();
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
        handleCloseCamera();
    };

    const handleRetakeImage = () => {
        // Clear the current image and go back to camera
        setImage(null);
        setReviewMode(false);
    }
    
    return (
        <div id="cameraPreview" className={`camera__container ${cameraActive ? '' : 'camera__container--inactive'}`}>
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
    );
};

export default CameraComponent;
