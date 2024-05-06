import React, { useEffect, useRef, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import { Camera, CameraType } from "./Camera";
import { useReview } from "../components/Review/ReviewContext";
import "./CameraContainer.css";
import { IonIcon } from "@ionic/react";
import { add, checkmark, close, sync } from "ionicons/icons";
import { Filesystem, Directory } from "@capacitor/filesystem";

const CameraContainer = () => {
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const camera = useRef<CameraType>(null);
  const { addImage, images, setImages } = useReview();
  const { questionIndex } = useParams<{ questionIndex: string }>();
  const questionIndexNumber = parseInt(questionIndex, 10);
  const [image, setImage] = useState<string | null>(null);
  const [reviewMode, setReviewMode] = useState(false);

  const history = useHistory();
  
  useEffect(() => {
    // Check if an image already exists for question index
    const existingImage = images[`question_${questionIndexNumber}`];
    if (existingImage) {
      setImage(existingImage);
    }
  }, [questionIndexNumber, images]);

  const ensureDirectoryExists = async () => {
    try {
      await Filesystem.mkdir({
        path: "surveyData/images",
        directory: Directory.Data,
        recursive: true,
      });
    } catch (error: any) {
      if (error.code !== "EEXIST") {
        console.error("Failed to create directory", error);
      }
    }
  };

  const updateImageInState = async (questionIndex: number, imageSrc: string) => {
    try {
      await ensureDirectoryExists();
      const path = `surveyData/images/question_${questionIndex}.jpg`;
      await Filesystem.writeFile({
        path,
        data: imageSrc,
        directory: Directory.Data,
      });
      console.log("File written successfully");

      const updatedImages = { ...images, [`question_${questionIndex}`]: imageSrc };
      setImages(updatedImages);
    } catch (error) {
      console.error("Failed to write file or update state", error);
    }
  };

  const handleCaptureClick = async () => {
    if (camera.current) {
      try {
        const imageData = camera.current.takePhoto();
        setImage(imageData);
        setReviewMode(true);
        camera.current.pauseCamera();
      } catch (error) {
        console.error("Failed to takes photo: ", error);
      }
    }
  };

  const handleSaveClick = () => {
    if (image && camera.current) {
      try {
        camera.current.stopCamera();
        addImage(`question_${questionIndexNumber}`, image);
        updateImageInState(questionIndexNumber, image);
        setReviewMode(false);
        setImage(null);
        camera.current.stopCamera();
        history.goBack();
      } catch (error) {
        console.error("Failed to add image: ", error);
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
        <div className="camera__overlay">
          <div className="camera__top-bar">
          <div>
            <IonIcon icon={close} className="camera__close" />
          </div>
          </div>
          <Camera
              ref={camera}
              aspectRatio="cover"
              numberOfCamerasCallback={setNumberOfCameras}
          />
          <div className="camera__bottom-bar">
          <div className="capture__button" onClick={handleCaptureClick}>
            <div className="capture__button__inner" />
          </div>
          <button
            disabled={numberOfCameras <= 1} 
            onClick={() => {
              if (camera.current) {
                const result = camera.current.switchCamera();
                console.log(result);
              }
            }}
          >
            <IonIcon icon={sync} className="camera__flip" />
          </button>
          </div>
        </div>
        {reviewMode && image && (
          <div className="image__review">
            <img src={image} alt="Captured image" />
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
