import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import { Camera, CameraType } from "./Camera";
import { Photo } from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { useReview } from "../components/Review/ReviewContext";
import { base64FromPath } from "../utils/base64FromPath";
import { UserPhoto } from "../interfaces";
import "./CameraContainer.css";
import { IonIcon } from "@ionic/react";
import { add, checkmark, close, sync } from "ionicons/icons";

const CameraContainer = () => {
  const camera = useRef<CameraType>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState<string | undefined>(
    undefined
  );
  const { addImage, images, setImages } = useReview();
  const { questionIndex } = useParams<{ questionIndex: string }>();
  const questionIndexNumber = parseInt(questionIndex, 10);
  const [image, setImage] = useState<string | null>(null);
  const [reviewMode, setReviewMode] = useState(false);

  useEffect(() => {
    const initCamera = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((i) => i.kind == "videoinput");
      if (videoDevices.length > 0) {
        setActiveDeviceId(videoDevices[0].deviceId);
      }
      setDevices(videoDevices);
    };
    
    initCamera();
  });

  useEffect(() => {
    // Check if an image already exists for question index
    const existingImage = images[`question_${questionIndexNumber}`];
    if (existingImage) {
      setImage(existingImage);
    }
  }, [questionIndexNumber, images]);

  const updateImageInState = (questionIndex: number, imageSrc: string) => {
    const updatedImages = { ...images, [`question_${questionIndex}`]: imageSrc };
    setImages(updatedImages);
    // Store images persistently using localStorage
    localStorage.setItem("surveyData", JSON.stringify({ images: updatedImages }));
  };

  const handleCaptureClick = async () => {
    if (camera.current) {
      try {
        const imageData = await camera.current.takePhoto();
        setImage(imageData);
        setReviewMode(true);
      } catch (error) {
        console.error("Failed to take photo: ", error);
      }
    }
  };

  const handleSaveClick = async () => {
    if (image) {
      const fileName = `photo_${new Date().getTime()}.jpeg`;
      try {
        const savedFileImage = await Filesystem.writeFile({
          path: fileName,
          data: image,
          directory: Directory.Data,
        });

        const imageUrl = `capacitor://${savedFileImage.uri}`;
        addImage(`question_${questionIndexNumber}`, imageUrl);
        updateImageInState(questionIndexNumber, imageUrl);
        setReviewMode(false);
        setImage(null);
      } catch (error) {
        console.error("Failed to save photo: ", error);
      }
    }
  };

  const handleRetakeClick = () => {
    setImage(null);
    setReviewMode(false);
  };

  return (
    <div className="camera__container">
        <div className="camera__overlay">
          <div>
            <IonIcon icon={close} className="camera__close" />
          </div>
          <Camera
              ref={camera}
              aspectRatio="cover"
              videoSourceDeviceId={activeDeviceId}
              errorMessages={{
                  noCameraAccessible:
                  "No camera device accessible. Please connect your camera or try a different browser.",
                  permissionDenied:
                  "Permission denied. Please refresh and give camera permission.",
                  switchCamera:
                  "It is not possible to switch camera to different one because there is only one video device accessible.",
                  canvas: "Canvas is not supported.",
              }}
              videoReadyCallback={() => {
                  console.log("Video feed ready.");
              }}
          />
          <div className="capture__button" onClick={handleCaptureClick}>
            <div className="capture__button__inner" />
          </div>
          <div>
            <IonIcon icon={sync} className="camera__flip" />
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
