import React, { useEffect, useRef, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
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
import { Capacitor } from "@capacitor/core";

const CameraContainer = () => {
  const [numberOfCameras, setNumberOfCameras] = useState(0);
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

  const history = useHistory();

  useEffect(() => {
    const initCamera = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === "videoinput");
      if (videoDevices.length > 0) {
        setActiveDeviceId(videoDevices[0].deviceId);
      }
      setDevices(videoDevices);
    };
    
    initCamera();
  }, []);

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
        const imageData = camera.current.takePhoto();
        setImage(imageData);
        setReviewMode(true);
      } catch (error) {
        console.error("Failed to takes photo: ", error);
      }
    }
  };
  
  const handleCameraFlip = () => {
    const currentIndex = devices.findIndex(device => device.deviceId === activeDeviceId);
    const nextIndex = (currentIndex + 1) % devices.length;
    setActiveDeviceId(devices[nextIndex].deviceId);
  };

  const handleSaveClick = async () => {
    if (image) {
      try {
        addImage(`question_${questionIndexNumber}`, image);
        updateImageInState(questionIndexNumber, image);
        setReviewMode(false);
        setImage(null);
        history.goBack();
      } catch (error) {
        console.error("Failed to add image: ", error);
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
              numberOfCamerasCallback={setNumberOfCameras}
          />
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
