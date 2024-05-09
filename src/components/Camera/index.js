/* eslint-disable */
import React, { useRef, useState, useEffect, useLayoutEffect, useImperativeHandle } from "react";
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
  var _e = useState("off"),
    currentFlashMode = _e[0],
    setFlashMode = _e[1];
  var _f = useState(null),
    focusArea = _f[0],
    setFocusArea = _f[1];

  const acquireStream = () => {
    const constraints = {
      video: {
        facingMode: currentFacingMode,
        width: { ideal: 1920 }, // Change this as needed
        height: { ideal: 1080 } // Change this as needed
      }
    };

    if (currentFlashMode === "on") {
      constraints.video.torch = true;
    } else if (currentFlashMode === "auto") {
      // TODO: Auto Mode
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
  };

  const supportsFocusArea = () => {
    if (stream) {
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      return capabilities.focusDistance || capabilities.focusMode.includes("zone");
    }
    return false;
  };

  const triggerAutofocus = () => {
    if (stream) {
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();

      if (capabilities.focusMode && "single-shot" in capabilities.focusMode) {
        track.applyConstraints({ advanced: [{ focusMode: "single-shot" }] })
      }
    }
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
      track.applyConstraints({ 
        advanced: [{ torch: newFlashMode === "on" }]
      })
    }
  }

  // Auto focus
  useLayoutEffect(() => {
    let focusInterval;

    const attemptFocus = () => {
      if (stream) {
        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();
        const settings = track.getSettings();

        if (capabilities.focusMode && "continuous" in capabilities.focusMode) {
          track.applyConstraints({ advanced: [{ focusMode: "continuous" }] })
            .catch(error => console.error("Error setting focus mode:", error));
        }
      }
    };

    if (stream) {
      focusInterval = setInterval(attemptFocus, 5000);
    }

    return () => clearInterval(focusInterval);
  }, [stream]);

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
      hasFlashSupport,
      toggleFlash,
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
      console.log("Checking camera permissions...");
      navigator.permissions.query({ name: "camera" }).then((permissionStatus) => {
        if (permissionStatus.state === "granted") {
          acquireStream();
          console.log("Camera permissions granted.");
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
  }, [currentFacingMode, currentFlashMode]);

  return React.createElement(
    Wrapper,
    { },
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
