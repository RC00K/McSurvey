import React, { useEffect, useRef, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import { Camera, CameraType } from "./Camera";
import { useReview } from "../components/Review/ReviewContext";
import "./CameraContainer.css";
import { IonIcon } from "@ionic/react";
import { add, checkmark, close, sync, flashOff, flash, imageOutline } from "ionicons/icons";
import { Filesystem, Directory } from "@capacitor/filesystem";

const CameraContainer = () => {
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [flashMode, setFlashMode] = useState("off");
  const [focusArea, setFocusArea] = useState(null);
  const camera = useRef<CameraType>(null);
  const { addImage, images, setImages } = useReview();
  const { questionIndex } = useParams<{ questionIndex: string }>();
  const questionIndexNumber = parseInt(questionIndex, 10);
  const [image, setImage] = useState<string | null>(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [closeCamera, setCloseCamera] = useState(false);

  const cameraContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const enterFullscreen = async () => {
      if (cameraContainerRef.current) {
        try {
          if (cameraContainerRef.current.requestFullscreen) {
            await cameraContainerRef.current.requestFullscreen();
          } else if ((cameraContainerRef.current as any).webkitEnterFullscreen) {
            await (cameraContainerRef.current as any).webkitEnterFullscreen();
          }
        } catch (error) {
          console.error("Failed to enter fullscreen: ", error);
        }
      }
    };

    const delay = 50;
    setTimeout(enterFullscreen, delay);

    return () => {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    };
  }, []);

  const history = useHistory();
  
  useEffect(() => {
    // Check if an image already exists for question index
    const existingImage = images[`question_${questionIndexNumber}`];
    if (existingImage) {
      setImage(existingImage);
    }
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

  const toggleFlash = () => {
    if (camera.current && camera.current.hasFlashSupport()) {
      camera.current.toggleFlash();
      setFlashMode(flashMode === "off" ? "on" : (flashMode === "on" ? "auto" : "off"))
    } else {
      console.error("Flash is not supported on this device");
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
        setCloseCamera(true);
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
    <div className="camera__container" ref={cameraContainerRef}>
        <div className="camera__overlay">
          <div className="camera__controls camera__controls__top">
            <button onClick={handleCloseCamera} className="camera__button">
              <IonIcon icon={close} />
            </button>
            <button onClick={toggleFlash} disabled={!camera.current?.hasFlashSupport()} className={flashMode === "off" ? "camera__button" : "camera__flash" }>
              <IonIcon 
                icon={flashMode === "off" ? flashOff : flash} 
              />
            </button>
          </div>
          <Camera
              ref={camera}
              aspectRatio="cover"
              numberOfCamerasCallback={setNumberOfCameras}
          />
          <div className="camera__controls camera__controls__bottom">
            <button className="camera__button">
              <IonIcon icon={imageOutline} />
            </button>
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
              className="camera__button"
            >
              <IonIcon icon={sync} />
            </button>
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
