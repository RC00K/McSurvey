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
  var _h = useState("continuous"),
    focusMode = _h[0],
    setFocusMode = _h[1];
  var _j = useState({ x: 0.5, y: 0.5 }),
    focusPoint = _j[0],
    setFocusPoint = _j[1];

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

  const handleTouchMove = (event) => {
    if (event.touches.length === 2 && initialPinchDistance != null) {
      event.preventDefault();
      const currentDistance = getPinchDistance(event.touches);
      const scale = currentDistance / initialPinchDistance;
      const newZoom = Math.max(1, lastZoom * scale);
      setCurrentZoom(newZoom);
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
    };
  });

  useEffect(() => {
    const constraints = {
      video: {
        facingMode: currentFacingMode,
        width: { ideal: 1920 }, 
        height: { ideal: 1080 },
        focusMode: { exact: focusMode },
      }
    };

    if (focusMode === "manual") {
      constraints.video.advanced = [{ focusPointOfInterest: focusPoint }];
    }

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

    // Revert to auto-focus after 3 seconds
    if (focusMode === "manual") {
      const timer = setTimeout(() => {
        setFocusMode("continuous");
        setFocusPoint({ x: 0.5, y: 0.5 });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentFacingMode, focusMode, focusPoint]);

  const handleVideoTap = (event) => {
    const bounds = player.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;

    setFocusPoint({ x, y });
    setFocusMode("manual");
  };

  return React.createElement(
    Wrapper,
    {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onClick: handleVideoTap,
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
