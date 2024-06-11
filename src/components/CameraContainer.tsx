import { useEffect, useRef, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import { Camera, CameraType } from "./Camera";
import { useSurvey } from "../assets/context/SurveyContext";
import "./CameraContainer.css";
import { IonIcon } from "@ionic/react";
import { checkmark, close, sync, flashOff, flash, imageOutline } from "ionicons/icons";
import { Filesystem, Directory } from "@capacitor/filesystem";

const CameraContainer = () => {
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [flashMode, setFlashMode] = useState("off");
  const [focusArea, setFocusArea] = useState(null);
  const camera = useRef<CameraType>(null);
  const { addImage, images, setImages } = useSurvey();
  const { questionIndex } = useParams<{ questionIndex: string }>();
  const questionIndexNumber = parseInt(questionIndex, 10);
  const [image, setImage] = useState<string | null>(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [closeCamera, setCloseCamera] = useState(false);
  const [loading, setLoading] = useState(true);

  const history = useHistory();
  
  useEffect(() => {
    // Lock the screen orientation to portrait
    const lockOrientation = async () => {
      try {
        if (screen.orientation && (screen.orientation as any).lock) {
          await (screen.orientation as any).lock("portrait");
        }
      } catch (error) {
        console.error("Failed to lock screen orientation: ", error);
      }
    };

    lockOrientation();

    // Check if an image already exists for question index
    const existingImage = images[`question_${questionIndexNumber}`];
    if (existingImage) {
      setImage(existingImage[existingImage.length - 1]);
    }

    // Unlock the screen orientation when the component unmounts
    return () => {
      if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
      }
    };
  }, [questionIndexNumber, images]);

  // Loading camera settings
  useEffect(() => {
    const storedCameraSettings = localStorage.getItem("cameraSettings");
    if (storedCameraSettings) {
      setFlashMode(storedCameraSettings);
    }
  }, []);

  // Saving camera settings 
  useEffect(() => {
    localStorage.setItem("cameraSettings", flashMode);
  }, [flashMode]);

  const handleCloseCamera = () => {
    if (camera.current) {
      camera.current.stopCamera();
      setCloseCamera(true);
      setTimeout(() => {
        history.goBack();
      }, 100);
    }
  };

  const handleCaptureClick = async () => {
    if (camera.current) {
      try {
        const imageData = camera.current.takePhoto();
        console.log("Captured image: ", imageData);
        setImage(imageData);
        setReviewMode(true);
        camera.current.pauseCamera();
      } catch (error) {
        console.error("Failed to take photo: ", error);
      }
    }
  };

  const toggleFlash = () => {
    if (camera.current && camera.current.hasFlashSupport()) {
      camera.current.toggleFlash();
      setFlashMode(flashMode === "off" ? "on" : (flashMode === "on" ? "auto" : "off"))
    } else {
      console.error("Flash is not supported on this device");
    }
  };

  const handleSwitchCamera = () => {
    if (camera.current) {
      setLoading(true);
      camera.current.switchCamera();
    } else {
      console.error("Camera not available");
    }
  };

  const handleSaveClick = () => {
    if (image && camera.current) {
      try {
        camera.current.stopCamera();
        addImage(`question_${questionIndexNumber}`, [image]);
        setReviewMode(false);
        setImage(null);
        setCloseCamera(true);
        history.goBack();
      } catch (error) {
        console.error("Failed to add image: ", error);
      } finally {
        if (camera.current) {
          camera.current.stopCamera();
        }
      }
    }
  };

  const handleRetakeClick = () => {
    setImage(null);
    setReviewMode(false);
    if (camera.current) {
      camera.current.restartCamera();
    }
  };

  return (
    <div className="camera__container">
      {loading && (
        <div className="loading__overlay">Initializing camera...</div>
      )}
      <div className="camera__overlay">
        <div className="camera__controls camera__controls__top">
          <button onClick={handleCloseCamera} className="camera__button">
            <IonIcon icon={close} />
          </button>
          <button onClick={toggleFlash} disabled={!camera.current?.hasFlashSupport()} className={flashMode === "off" ? "camera__button" : "camera__flash"}>
            <IonIcon icon={flashMode === "off" ? flashOff : flash} />
          </button>
        </div>
        <Camera
          ref={camera}
          aspectRatio="cover"
          numberOfCamerasCallback={setNumberOfCameras}
        />
        <div className="camera__controls camera__controls__bottom">
          {/* <button className="camera__button">
            <IonIcon icon={imageOutline} />
          </button> */}
          <div className="capture__button" onClick={handleCaptureClick}>
            <div className="capture__button__inner" />
          </div>
          {/* <button
            disabled={numberOfCameras <= 1} 
            onClick={handleSwitchCamera}
            className="camera__button"
          >
            <IonIcon icon={sync} />
          </button> */}
        </div>
      </div>
      {reviewMode && image && (
        <div className="image__review">
          <img src={image} alt="Captured image" />
          <div className="camera__controls camera__controls__bottom">
            <button className="camera__button retake" onClick={handleRetakeClick}>
              <IonIcon icon={close} className="retake__button__icon" />
            </button>
            <button className="camera__button save" onClick={handleSaveClick}>
              <IonIcon icon={checkmark} className="save__button__icon" />
            </button>
          </div>
          <div className="review__buttons">
            <button className="retake__button" onClick={handleRetakeClick}>
              <IonIcon icon={close} className="retake__button__icon" />
            </button>
            <button className="save__button" onClick={handleSaveClick}>
              <IonIcon icon={checkmark} className="save__button__icon" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraContainer;
