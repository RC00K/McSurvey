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
    <>
      {loading && (
        <div className="loader">
          <div className="loader__text">
            Camera loading
          </div>
          <div className="loader__bar"></div>
        </div>
      )}
      <div className="camera__container">
        <div className="camera__overlay">
          <div className="camera__controls camera__controls__top">
            <button onClick={handleCloseCamera} className="camera__button">
              <IonIcon icon={close} />
            </button>
          </div>
          <Camera
            ref={camera}
            aspectRatio="cover"
            numberOfCamerasCallback={setNumberOfCameras}
            onInitialized={() => setLoading(false)}
          />
          {!loading && !reviewMode && (
            <div className="camera__controls camera__controls__bottom">
              <div className="capture__button" onClick={handleCaptureClick}>
                <div className="capture__button__inner" />
              </div>
            </div>
          )}
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
    </>
  );
};

export default CameraContainer;
