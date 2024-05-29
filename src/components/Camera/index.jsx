/* eslint-disable */
import React, { useRef, useState, useEffect, useImperativeHandle } from "react";
import styled from "styled-components";

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

const Camera = React.forwardRef(function ({ facingMode = "environment" }, ref) {
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
  const debounceTimeoutRef = useRef(null);

  const acquireStream = () => {
    const constraints = {
      video: {
        facingMode: currentFacingMode,
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        focusMode: "continuous",
      },
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then((newStream) => {
        setStream(newStream);
        if (player.current) {
          player.current.srcObject = newStream;
        }
      })
      .catch((error) => {
        console.error("Failed to initialize camera stream:", error);
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
          console.log('zoom set');
        })
        .catch((error) => {
          console.error('zoom set error', error);
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

      if (capabilities.focusMode && capabilities.focusMode.includes("manual")) {
        const settings = track.getSettings();
        const { width, height } = settings;
        const focusX = event.clientX / width;
        const focusY = event.clientY / height;

        track.applyConstraints({
          advanced: [
            { focusMode: "manual", focusDistance: capabilities.focusDistance.min + (capabilities.focusDistance.max - capabilities.focusDistance.min) * 0.5 },
            { pointsOfInterest: [{ x: focusX, y: focusY }] },
          ],
        });
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

  const detectBrightnessAndToggleFlash = (track) => {
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

    const brightness = Math.floor(colorSum / (canvas.current.width * canvas.current.height));

    if (brightness < 50) {
      track.applyConstraints({ advanced: [{ torch: true }] });
    } else {
      track.applyConstraints({ advanced: [{ torch: false }] });
    }
  };

  useImperativeHandle(ref, () => ({
    takePhoto: () => {
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
        }

        context.drawImage(player.current, 0, 0, videoWidth, videoHeight);

        if (currentFlashMode === "on") {
          applyFlash(false);
        }

        return canvas.current.toDataURL("image/jpeg");
      }
      throw new Error("No video or canvas available");
    },
    switchCamera: () => {
      const newFacingMode = currentFacingMode === "environment" ? "user" : "environment";
      setFacingMode(newFacingMode);
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
    if (navigator.permissions) {
      navigator.permissions.query({ name: "camera" }).then((permissionStatus) => {
        if (permissionStatus.state === "granted") {
          acquireStream();
        }
      });
    }

    if (!stream) {
      acquireStream();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [currentFacingMode, currentFlashMode]);

  useEffect(() => {
    if (currentFlashMode === "auto" && stream) {
      const track = stream.getVideoTracks()[0];
      const interval = setInterval(() => detectBrightnessAndToggleFlash(track), 1000);
      return () => clearInterval(interval);
    }
  }, [currentFlashMode, stream]);

  return (
    <Wrapper>
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
      <Canvas ref={canvas} />
    </Wrapper>
  );
});

Camera.displayName = "Camera";

export { Camera };
