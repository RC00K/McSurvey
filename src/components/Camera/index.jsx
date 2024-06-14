import React, { useRef, useState, useEffect, useImperativeHandle } from "react";
import styled from "styled-components";
import "../loaders/SendingLoader.css";
import Cookies from "js-cookie";

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Cam = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  transform: rotateY(${(props) => (props.mirrored ? "180deg" : "0deg")});
`;

const Canvas = styled.canvas`
  display: none;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #222428;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f4f5f8;
  z-index: 2;
`;

const Camera = React.forwardRef(function (
  { facingMode = "environment", numberOfCamerasCallback, onInitialized }, ref) {
  const player = useRef(null);
  const canvas = useRef(null);
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentFacingMode, setFacingMode] = useState(facingMode);

  const acquireStream = () => {
    const constraints = {
      video: {
        facingMode: currentFacingMode,
        width: { ideal: 1024 },
        height: { ideal: 768 },
        focusMode: "continuous",
      },
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then((newStream) => {
        setStream(newStream);
        if (player.current) {
          player.current.srcObject = newStream;
          player.current.onloadedmetadata = () => {
            setLoading(false);
            if (onInitialized) {
              onInitialized();
            }
          };
        }

        // Count the number of video input devices
        navigator.mediaDevices.enumerateDevices().then(devices => {
          const videoDevices = devices.filter(device => device.kind === "videoinput");
          console.log('Number of video devices:', videoDevices.length);
          numberOfCamerasCallback(videoDevices.length);
        });
      })
      .catch((error) => {
        console.error("Failed to initialize camera stream:", error);
        setLoading(false);
      });
  };

  useImperativeHandle(ref, () => ({
    takePhoto: () => {
      if (loading) {
        throw new Error("Camera is still initializing");
      }
      if (canvas.current && player.current) {
        const context = canvas.current.getContext("2d");
        const { videoWidth, videoHeight } = player.current;
      
        canvas.current.width = videoWidth;
        canvas.current.height = videoHeight;
      
        if (currentFacingMode === "user" && context) {
          context.translate(videoWidth, 0);
          context.scale(-1, 1);
        }
      
        if (context) {
          context.drawImage(player.current, 0, 0, videoWidth, videoHeight);
          return canvas.current.toDataURL("image/jpeg");
        }
      }
      throw new Error("No video or canvas available");
    },
    switchCamera: () => {
      setLoading(true);
      const newFacingMode = currentFacingMode === "environment" ? "user" : "environment";
      setFacingMode(newFacingMode);
      acquireStream();
    },
    stopCamera: () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    },
    pauseCamera: () => {
      if (player.current && player.current.srcObject) {
        player.current.pause();
      }
    },
    restartCamera: () => {
      if (player.current && player.current.srcObject) {
        player.current.play();
      }
    },
  }));

  useEffect(() => {
    const storedCameraPermission = Cookies.get("cameraPermission");
    
    // Check the stored camera permission
    if (storedCameraPermission === "denied") {
      promptCameraPermission();
      setLoading(false);
      return;
    }

    if (storedCameraPermission === "granted") {
      acquireStream();
    } else {
      navigator.mediaDevices.getUserMedia({ video: true}).then((stream) => {
        Cookies.set("cameraPermission", "granted", { expires: 365 });
        acquireStream();
      }).catch((error) => {
        Cookies.set("cameraPermission", "denied", { expires: 365 });
        setLoading(false);
      });
    };

    const storedDeviceInfo = localStorage.getItem("deviceInfo");
    if (!storedDeviceInfo) {
      const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        languages: navigator.languages,
      };
      localStorage.setItem("deviceInfo", JSON.stringify(deviceInfo));
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [currentFacingMode]);

  const promptCameraPermission = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        // User has granted camera permission
        Cookies.set("cameraPermission", "granted", { expires: 365 });
        acquireStream();
      })
      .catch(error => {
        // User has denied camera permission
        Cookies.set("cameraPermission", "denied", { expires: 365 });
        setLoading(false);
        alert("Please enable camera access to use this feature.");
      });
  };

  return (
    <Wrapper>
      {loading && (
        <div className="loader">
          <div className="loader__text">
            Camera loading
          </div>
          <div className="loader__bar"></div>
        </div>
      )}
      <Cam
        ref={player}
        muted
        autoPlay
        playsInline
        mirrored={currentFacingMode === "user"}
      />
      <Canvas ref={canvas} />
    </Wrapper>
  );
});

Camera.displayName = "Camera";

export { Camera };
