import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { Camera, CameraType } from "./Camera";
import { Photo } from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { useReview } from "../components/Review/ReviewContext";
import { base64FromPath } from "../utils/base64FromPath";
import { UserPhoto } from "../interfaces";

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const ModalWrapper = styled.div`
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
`;

const Control = styled.div`
  position: fixed;
  display: flex;
  right: 0;
  min-width: 130px;
  min-height: 130px;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 50px;
  box-sizing: border-box;

  @media (max-aspect-ratio: 1/1) {
    flex-direction: column;
    bottom: 0;
    width: 100%;
    height: 20%;
  }
`;

const Button = styled.button`
  outline: none;
  color: white;
  opacity: 1;
  background: transparent;
  background-color: transparent;
  background-position-x: 0%;
  background-position-y: 0%;
  background-repeat: repeat;
  background-image: none;
  padding: 0;
  text-shadow: 0px 0px 4px black;
  background-position: center center;
  background-repeat: no-repeat;
  pointer-events: auto;
  cursor: pointer;
  z-index: 2;
  filter: invert(100%);
  border: none;

  &:hover {
    opacity: 0.7;
  }
`;

const TakePhotoButton = styled(Button)`
  background: url("https://img.icons8.com/ios/50/000000/compact-camera.png");
  background-position: center;
  background-size: 50px;
  background-repeat: no-repeat;
  width: 80px;
  height: 80px;
  border: solid 4px black;
  border-radius: 50%;

  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

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
    <ModalWrapper>
      <Wrapper>
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
        <Control>
          <TakePhotoButton
            onClick={() => takePhotoAndSave(1)}
            disabled={devices.length === 0}
          />
        </Control>
      </Wrapper>
    </ModalWrapper>
  );
};

export default CameraContainer;
