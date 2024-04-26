import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { Camera, CameraType } from "./Camera";
import { Photo } from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { useReview } from "../components/Review/ReviewContext";
import { base64FromPath } from "../utils/base64FromPath";
import { UserPhoto } from "../interfaces";
import "./CameraContainer.css";
import { IonIcon } from "@ionic/react";
import { checkmark, close, sync } from "ionicons/icons";

const CameraContainer = () => {
  const camera = useRef<CameraType>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState<string | undefined>(
    undefined
  );
  const { addImage, images, setImages } = useReview();

  useEffect(() => {
    (async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((i) => i.kind == "videoinput");
      setDevices(videoDevices);
    })();
  });

  const updateImageInState = (questionIndex: number, imageSrc: string) => {
    const updatedImages = { ...images, [`question_${questionIndex}`]: imageSrc };
    setImages(updatedImages);
    localStorage.setItem("surveyData", JSON.stringify({ images: updatedImages }));
  }

  const takePhotoAndSave = async (questionIndex: number) => {
    if (camera.current) {
        const photo = camera.current.takePhoto();
        const fileName = `photo_${new Date().getTime()}.jpeg`;
        const savedFileImage = await savePicture(photo, fileName);
        if (savedFileImage.filepath) {
            const imageSrc = await loadSavedImage(savedFileImage.filepath);
            updateImageInState(questionIndex, imageSrc);
        }
    }
  };

  const savePicture = async (base64Data: string, fileName: string): Promise<UserPhoto> => {
    await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Data,
    });

    return {
        filepath: fileName,
        webviewPath: `data:image/jpeg;base64,${base64Data}`,
    };
  };

  const loadSavedImage = async (filePath: string): Promise<string> => {
    try {
        const fileContents = await Filesystem.readFile({
            path: filePath,
            directory: Directory.Data,
        });
        return `data:image/jpeg;base64,${fileContents.data}`;
    } catch (error) {
        console.error("Failed to load image: ", error);
        return "";
    }
  };

  return (
    <div className="camera__container">
      {photo ? (
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
      ) : (
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
          <div className="capture__button" onClick={() => takePhotoAndSave(1)}>
            <div className="capture__button__inner" />
          </div>
          <div>
            <IonIcon icon={sync} className="camera__flip" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraContainer;
