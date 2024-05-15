/* eslint-disable */
import React, { useRef, useState, useEffect, useLayoutEffect, useImperativeHandle } from "react";
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

const FocusPoint = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  border: 2px solid ${(props) => (props.isLocked ? "red" : "white")};
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s ease-in-out;
  opacity: ${(props) => (props.visible ? 1 : 0)};
`;

const Camera = React.forwardRef(function ({ facingMode = "environment" }, ref) {
  const player = useRef(null);
  const canvas = useRef(null);
  const [stream, setStream] = useState(null);
  const [currentFacingMode, setFacingMode] = useState(facingMode);
  const [currentFlashMode, setFlashMode] = useState("off");
  const [isFocusLocked, setFocusLocked] = useState(false);
  const [focusPoint, setFocusPoint] = useState({ x: 0, y: 0, visible: false });
  const focusTimeout = useRef(null);

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

  const handleTapToFocus = (event) => {
    if (stream && !isFocusLocked) {
      const rect = player.current.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      setFocusPoint({ x: event.clientX, y: event.clientY, visible: true });

      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();

      if (capabilities.focusMode && capabilities.focusMode.includes("single-shot")) {
        const focusArea = { x, y, width: 0.1, height: 0.1 }; // Adjust the size of the focus area as needed
        track.applyConstraints({ advanced: [{ focusMode: "single-shot", pointsOfInterest: [focusArea] }] })
          .catch((error) => console.error("Error setting focus area:", error));
      }
    }
  };

  const handleHoldToLockFocus = (event) => {
    focusTimeout.current = setTimeout(() => {
      setFocusLocked(true);
      handleTapToFocus(event);
    }, 1000); // 1 second hold duration
  };

  const clearFocusTimeout = () => {
    if (focusTimeout.current) {
      clearTimeout(focusTimeout.current);
      focusTimeout.current = null;
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
        onClick={handleTapToFocus}
        onMouseDown={handleHoldToLockFocus}
        onMouseUp={clearFocusTimeout}
        onMouseLeave={clearFocusTimeout}
        onTouchStart={handleHoldToLockFocus}
        onTouchEnd={clearFocusTimeout}
      />
      <Canvas ref={canvas} />
      <FocusPoint
        style={{ left: `${focusPoint.x}px`, top: `${focusPoint.y}px` }}
        visible={focusPoint.visible}
        isLocked={isFocusLocked}
      />
    </Wrapper>
  );
});

Camera.displayName = "Camera";

export { Camera };
