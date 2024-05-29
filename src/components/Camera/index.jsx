/* eslint-disable */
import React, { useRef, useState, useEffect, useLayoutEffect, useImperativeHandle } from "react";
import { set } from "react-hook-form";
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
  const [currentFlashMode, setFlashMode] = useState("off");
  const [zoom, setZoom] = useState(1);
  const [isZooming, setIsZooming] = useState(false);
  const [targetZoom, setTargetZoom] = useState(1);
  const [initialDistance, setInitialDistance] = useState(null);
  const debounceTimeoutRef = useRef(null);

  const acquireStream = () => {
    const constraints = {
      video: {
        facingMode: currentFacingMode,
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
    };

    if (currentFlashMode === "on") {
      constraints.video.torch = true;
    }

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

    if (stream) {
      const track = stream.getVideoTracks()[0];
      track.applyConstraints({ advanced: [{ torch: newFlashMode === "on" }] });
    }
  };

  const debounceZoom = (value) => {
    clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => setZoomValue(value), 200);
  };

  const updateZoom = async () => {
    if (isZooming) return;
    setIsZooming(true);

    setZoom(oldZoom => {
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

  const setZoomValue = async (value) => {
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

        context.drawImage(player.current, 0, 0, videoWidth, videoHeight);
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
      />
      <Canvas ref={canvas} />
    </Wrapper>
  );
});

Camera.displayName = "Camera";

export { Camera };
