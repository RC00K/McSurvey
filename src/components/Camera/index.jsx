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

const FocusIndicator = styled.div`
  position: absolute;
  border: 2px solid yellow;
  width: 50px;
  height: 50px;
  display: ${({ visible }) => (visible ? 'block' : 'none')};
  left: ${({ x }) => x - 25}px;
  top: ${({ y }) => y - 25}px;
  pointer-events: none;
  z-index: 1;
`;

const FocusLockMessage = styled.div`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  display: ${({ visible }) => (visible ? 'block' : 'none')};
  z-index: 1;
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

const Camera = React.forwardRef(function ({ facingMode = "environment", numberOfCamerasCallback }, ref) {
  const player = useRef(null);
  const canvas = useRef(null);
  const [stream, setStream] = useState(null);
  const [currentFacingMode, setFacingMode] = useState(facingMode);
  const [currentFlashMode, setFlashMode] = useState("auto");
  const [zoom, setZoom] = useState(1);
  const [isZooming, setIsZooming] = useState(false);
  const [targetZoom, setTargetZoom] = useState(1);
  const [initialDistance, setInitialDistance] = useState(null);
  const [isFocusLocked, setIsFocusLocked] = useState(false);
  const [focusPoint, setFocusPoint] = useState({ x: 0, y: 0 });
  const [showFocusIndicator, setShowFocusIndicator] = useState(false);
  const debounceTimeoutRef = useRef(null);
  const [loading, setLoading] = useState(true);

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

  const hasFlashSupport = () => {
    if (stream) {
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      return capabilities.torch;
    }
    return false;
  };

  const toggleFlash = () => {
    const newFlashMode = currentFlashMode === "off" ? "on" : (currentFlashMode === "on" ? "auto" : "off");
    setFlashMode(newFlashMode);
  };

  const applyFlash = (enable) => {
    if (stream) {
      const track = stream.getVideoTracks()[0];
      track.applyConstraints({ advanced: [{ torch: enable }] });
    }
  };

  const debounceZoom = (value) => {
    clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => setZoomValue(value), 200);
  };

  const updateZoom = () => {
    if (isZooming) return;
    setIsZooming(true);

    setZoom((oldZoom) => {
      const difference = targetZoom - oldZoom;
      const newZoom = oldZoom + difference * 0.1;
      return newZoom;
    });
    setIsZooming(false);
  };

  useEffect(() => {
    const interval = setInterval(updateZoom, 100);
    return () => clearInterval(interval);
  }, []);

  const setZoomValue = (value) => {
    setTargetZoom(value);
  };

  useEffect(() => {
    if (stream && 'zoom' in stream.getTracks()[0].getCapabilities()) {
      const [videoTrack] = stream.getVideoTracks();
      videoTrack.applyConstraints({ advanced: [{ zoom }] })
        .then(() => {
          console.log('Zoom set');
        })
        .catch((error) => {
          console.error('Zoom set error', error);
        });
    }
  }, [stream, zoom]);

  const handlePinchStart = (event) => {
    if (event.touches.length === 2) {
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      setInitialDistance(distance);
    }
  };

  const handleTouchMove = (event) => {
    if (event.touches.length === 2 && initialDistance) {
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const zoomValue = distance / initialDistance;
      debounceZoom(zoomValue);
    }
  };

  const handleTapFocus = (event) => {
    if (stream) {
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();

      if (isFocusLocked) {
        setIsFocusLocked(false);
        track.applyConstraints({
          advanced: [{ focusMode: "continuous" }],
        });
        setShowFocusIndicator(false);
        return;
      }

      if (capabilities.focusMode && capabilities.focusMode.includes("manual")) {
        const settings = track.getSettings();
        const { width, height } = settings;
        const focusX = event.clientX / width;
        const focusY = event.clientY / height;

        setFocusPoint({ x: event.clientX, y: event.clientY });
        setShowFocusIndicator(true);

        track.applyConstraints({
          advanced: [
            { focusMode: "manual", focusDistance: capabilities.focusDistance.min + (capabilities.focusDistance.max - capabilities.focusDistance.min) * 0.5 },
            { pointsOfInterest: [{ x: focusX, y: focusY }] },
          ],
        });

        setTimeout(() => {
          if (!isFocusLocked) {
            setShowFocusIndicator(false);
          }
        }, 2000);
      }
    }
  };

  const lockFocus = () => {
    if (stream) {
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();

      if (capabilities.focusMode && capabilities.focusMode.includes("manual")) {
        setIsFocusLocked((prev) => !prev);
        track.applyConstraints({
          advanced: [{ focusMode: isFocusLocked ? "continuous" : "manual" }],
        });
      }
    }
  };

  const detectBrightness = () => {
    const context = canvas.current.getContext("2d");
    canvas.current.width = player.current.videoWidth;
    canvas.current.height = player.current.videoHeight;
    context.drawImage(player.current, 0, 0, canvas.current.width, canvas.current.height);
    const imageData = context.getImageData(0, 0, canvas.current.width, canvas.current.height);
    const data = imageData.data;

    let r, g, b, avg;
    let colorSum = 0;

    for (let x = 0, len = data.length; x < len; x += 4) {
      r = data[x];
      g = data[x + 1];
      b = data[x + 2];

      avg = Math.floor((r + g + b) / 3);
      colorSum += avg;
    }

    return Math.floor(colorSum / (canvas.current.width * canvas.current.height));
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

        if (currentFacingMode === "user") {
          context.translate(videoWidth, 0);
          context.scale(-1, 1);
        }

        if (currentFlashMode === "on") {
          applyFlash(true);
        } else if (currentFlashMode === "auto") {
          const brightness = detectBrightness();
          if (brightness < 50) {
            applyFlash(true);
          }
        }

        context.drawImage(player.current, 0, 0, videoWidth, videoHeight);

        if (currentFlashMode !== "off") {
          applyFlash(false);
        }

        if (isFocusLocked) {
          lockFocus();
        }

        return canvas.current.toDataURL("image/jpeg");
      }
      throw new Error("No video or canvas available");
    },
    switchCamera: () => {
      setLoading(true);
      const newFacingMode = currentFacingMode === "environment" ? "user" : "environment";
      setFacingMode(newFacingMode);
      acquireStream();
    },
    hasFlashSupport,
    toggleFlash,
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
    lockFocus,
  }));

  useEffect(() => {
    const storedCameraPermission = Cookies.get("cameraPermission");
    if (storedCameraPermission === "granted") {
      acquireStream();
    }

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
  }, [currentFacingMode, currentFlashMode]);

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
        onTouchStart={handlePinchStart}
        onTouchMove={handleTouchMove}
        onClick={handleTapFocus}
      />
      <FocusIndicator visible={showFocusIndicator || isFocusLocked} x={focusPoint.x} y={focusPoint.y} />
      <FocusLockMessage visible={isFocusLocked}>Focus Locked</FocusLockMessage>
      <Canvas ref={canvas} />
    </Wrapper>
  );
});

Camera.displayName = "Camera";

export { Camera };
