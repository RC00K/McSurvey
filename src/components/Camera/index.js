/* eslint-disable */
import React, { useRef, useState, useEffect, useImperativeHandle } from "react";
import styled from "styled-components";

function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", { value: raw });
  } else {
    cooked.raw = raw;
  }
  return cooked;
}

var Wrapper = styled.div(
  templateObject_1 ||
    (templateObject_1 = __makeTemplateObject(
      [
        "\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n",
      ],
      [
        "\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n",
      ]
    ))
);

var Cam = styled.video(
  templateObject_4 ||
    (templateObject_4 = __makeTemplateObject(
      [
        "\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  z-index: 0;\n  transform: rotateY(",
        ");\n",
      ],
      [
        "\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  z-index: 0;\n  transform: rotateY(",
        ");\n",
      ]
    )),
  function (_a) {
    var mirrored = _a.mirrored;
    return mirrored ? "180deg" : "0deg";
  }
);

var Canvas = styled.canvas(
  templateObject_5 ||
    (templateObject_5 = __makeTemplateObject(
      ["\n  display: none;\n"],
      ["\n  display: none;\n"]
    ))
);

var templateObject_1, templateObject_4, templateObject_5;

var Camera = React.forwardRef(function (_a, ref) {
  var _b = _a.facingMode,
    facingMode = _b === void 0 ? "environment" : _b;
  var player = useRef(null);
  var canvas = useRef(null);
  var _c = useState(null),
    stream = _c[0],
    setStream = _c[1];
  var _d = useState(facingMode),
    currentFacingMode = _d[0],
    setFacingMode = _d[1];
  var _e = useState(null),
    initialPinchDistance = _e[0],
    setInitialPinchDistance = _e[1];
  var _f = useState(1),
    currentZoom = _f[0],
    setCurrentZoom = _f[1];
  var _g = useState(1),
    lastZoom = _g[0],
    setLastZoom = _g[1];

  const acquireStream = () => {
    const constraints = {
      video: {
        facingMode: currentFacingMode,
        width: { ideal: 1920 }, // Change this as needed
        height: { ideal: 1080 } // Change this as needed
      }
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then(function (newStream) {
        setStream(newStream);
        if (player.current) {
          player.current.srcObject = newStream;
        }
      })
      .catch(function (error) {
        console.error("Failed to initialize camera stream:", error);
      });
  };

  const getPinchDistance = (touches) => {
    const touch1 = touches[0];
    const touch2 = touches[1];
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (event) => {
    if (event.touches.length === 2) {
      setInitialPinchDistance(getPinchDistance(event.touches));
      setLastZoom(currentZoom);
    }
  };

  const zoomSmoothing = 0.1;
  let zoomAnimationFrame;

  const handleSmoothZoom = (newZoom) => {
    if (zoomAnimationFrame) {
      cancelAnimationFrame(zoomAnimationFrame);
    }

    const step = () => {
      if (Math.abs(currentZoom - newZoom) < 0.01) {
        setCurrentZoom(newZoom);
        updateCameraZoom(newZoom);
      } else {
        const zoomStep = currentZoom + (newZoom - currentZoom) * zoomSmoothing;
        setCurrentZoom(zoomStep);
        updateCameraZoom(zoomStep);
        zoomAnimationFrame = requestAnimationFrame(step);
      }
    };

    step();
  };

  const updateCameraZoom = (zoomLevel) => {
    if (stream) {
      const track = stream.getVideoTracks()[0];
      track.applyConstraints({ advanced: [{ zoom: zoomLevel }] });
    }
  };

  const handleTouchMove = (event) => {
    if (event.touches.length === 2 && initialPinchDistance != null) {
      event.preventDefault();
      const currentDistance = getPinchDistance(event.touches);
      const scale = currentDistance / initialPinchDistance;
      const newZoom = Math.max(1, lastZoom * scale);
      handleSmoothZoom(newZoom);
    }
  };

  const handleTouchEnd = (event) => {
    if (event.touches.length < 2) {
      setInitialPinchDistance(null);
      if (stream) {
        const track = stream.getVideoTracks()[0];
        track.applyConstraints({ advanced: [{ zoom: currentZoom }] });
      }
    }
  };

  useImperativeHandle(ref, function () {
    return {
      takePhoto: function () {
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
      switchCamera: function () {
        var newFacingMode =
          currentFacingMode === "environment" ? "user" : "environment";
        setFacingMode(newFacingMode);
      },
      stopCamera: function () {
        if (stream) {
          stream.getTracks().forEach(function (track) {
            track.stop();
          });
          setStream(null);
        }
      },
      pauseCamera: function () {
        if (player.current && player.current.srcObject) {
          player.current.pause();
        }
      },
      restartCamera: function () {
        if (player.current && player.current.srcObject) {
          player.current.play();
        }
      },
    };
  });

  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: "camera" }).then((permissionStatus) => {
        if (permissionStatus.state === "granted") {
          acquireStream();
        }
      });
    }

    if (!stream) {
      console.log("Attempting to acquire camera stream...");
      acquireStream();
    }

    return () => {
      if (stream) {
        console.log("Stopping camera stream...");
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [currentFacingMode]);

  return React.createElement(
    Wrapper,
    {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    },
    React.createElement(Cam, {
      ref: player,
      muted: true,
      autoPlay: true,
      playsInline: true,
      mirrored: currentFacingMode === "user"
    }),
    React.createElement(Canvas, { ref: canvas }),
  );
});

Camera.displayName = "Camera";

export { Camera };
