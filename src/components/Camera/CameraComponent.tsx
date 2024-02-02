import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions, CameraPreviewFlashMode } from '@capacitor-community/camera-preview';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonIcon, IonButton, isPlatform } from '@ionic/react';
import { close, closeCircle, checkmarkCircle, images, sync,  } from 'ionicons/icons';
import './CameraComponent.css';

const CameraComponent: React.FC<{ isCameraActive: boolean, handleCloseCamera: () => void }> = ({ isCameraActive, handleCloseCamera }) => {
    const [image, setImage] = useState<string | null>(null);
    const [cameraActive, setCameraActive] = useState<boolean>(false);
    const [flashActive, setFlashActive] = useState<boolean>(false);
    const [reviewMode, setReviewMode] = useState<boolean>(false);

    useEffect(() => {
        if (isCameraActive) {
            openCamera();
        } else {
            stopCamera();
        }
    }, [isCameraActive]);

    const openCamera = async () => {
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
    };

    const stopCamera = async () => {
        await CameraPreview.stop();
        setCameraActive(false);
        handleCloseCamera();
    };

    const captureImage = async () => {
        const cameraPreviewPictureOptions: CameraPreviewPictureOptions = {
            quality: 100
        };
        const result = await CameraPreview.capture(cameraPreviewPictureOptions);
        setImage(`data:image/jpeg;base64,${result.value}`);
        setReviewMode(true);
        await stopCamera();
    };

    const retakeImage = async () => {
        await stopCamera();
        await openCamera();
        setImage(null);
        setReviewMode(false);
    }

    const keepImage = () => {
        setReviewMode(false);
    }

    const flipCamera = async () => {
        await CameraPreview.flip();
    };
    
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
                    </>
                )}
            </div>
            {reviewMode && (
                <div className="image__review">
                    <img src={image || ''} alt="Captured" />
                    <div className="review__buttons">
                        <IonButton className="retake__button" onClick={retakeImage}>
                            <IonIcon icon={closeCircle} className="retake__button__icon" />
                        </IonButton>
                        <IonButton className="save__button" onClick={keepImage}>
                            <IonIcon icon={checkmarkCircle} className="save__button__icon" />
                        </IonButton>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CameraComponent;
