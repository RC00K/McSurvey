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
  var _e = useState(1),
    zoom = _e[0],
    setZoom = _e[1];

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
      adjustZoom: function (factor) {
        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();

        if (!capabilities.zoom) {
          return;
        }

        const newZoom = Math.min(capabilities.zoom.max, Math.max(capabilities.zoom.min, factor));
        track.applyConstraints({
          advanced: [{ zoom: newZoom }]
        });
        setZoom(newZoom);
      }
    };
  });

  useEffect(() => {
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

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [currentFacingMode]);

  return React.createElement(
    Wrapper,
    null,
    React.createElement(Cam, {
      ref: player,
      muted: true,
      autoPlay: true,
      playsInline: true,
      mirrored: currentFacingMode === "user"
    }),
    React.createElement(Canvas, { ref: canvas }),
    React.createElement("button", { onClick: () => ref.current.adjustZoom(zoom + 0.1) }, "Zoom In"),
    React.createElement("button", { onClick: () => ref.current.adjustZoom(zoom - 0.1) }, "Zoom Out")
  );
});

Camera.displayName = "Camera";

export { Camera };
