/* eslint-disable */
import React, { useRef, useState, useEffect, useImperativeHandle } from "react";
import styled from "styled-components";

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0
THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.
See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

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

var Container = styled.div(
  templateObject_2 ||
    (templateObject_2 = __makeTemplateObject(
      ["\n  width: 100%;\n  ", "\n"],
      ["\n  width: 100%;\n  ", "\n"]
    )),
  function (_a) {
    var aspectRatio = _a.aspectRatio;

    return aspectRatio === "cover"
      ? "\n    position: absolute;\n    bottom: 0;\n    top: 0;\n    left: 0;\n    right: 0;"
      : "\n    position: relative;\n    padding-bottom: " +
          100 / aspectRatio +
          "%;";
  }
);

var ErrorMsg = styled.div(
  templateObject_3 ||
    (templateObject_3 = __makeTemplateObject(
      ["\n  padding: 40px;\n"],
      ["\n  padding: 40px;\n"]
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

var templateObject_1,
  templateObject_2,
  templateObject_3,
  templateObject_4,
  templateObject_5;

var Camera = React.forwardRef(function (_a, ref) {
  var _b = _a.facingMode,
    facingMode = _b === void 0 ? "environment" : _b,
    _c = _a.aspectRatio,
    aspectRatio = _c === void 0 ? "cover" : _c,
    _d = _a.numberOfCamerasCallback,
    numberOfCamerasCallback =
      _d === void 0
        ? function () {
            return null;
          }
        : _d;
  var player = useRef(null);
  var canvas = useRef(null);
  var streams = useRef(new Map());
  var container = useRef(null);
  var _e = useState(0),
    numberOfCameras = _e[0],
    setNumberOfCameras = _e[1];
  var _f = useState(null),
    stream = _f[0],
    setStream = _f[1];
  var _g = useState(facingMode),
    currentFacingMode = _g[0],
    setFacingMode = _g[1];
  var _h = useState(null),
    activeStream = _h[0],
    setActiveStream = _h[1];
  var _j = useState(true),
    loading = _j[0],
    setLoading = _j[1];

  useEffect(() => {
    async function initStreams() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === "videoinput");
        const initialDevice = videoDevices[0];
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: initialDevice.deviceId },
        });
        streams.current.set(initialDevice.deviceId, stream);
        setActiveStream(stream);
      } catch (error) {
        console.error("Failed to initialize camera", error);
      } finally {
        setLoading(false);
      }
    }

    initStreams();

    return () => {
      streams.current.forEach(stream => {
        stream.getTracks().forEach(track => track.stop());
      });
    };
  }, []);
    
  useEffect(
    function () {
      numberOfCamerasCallback(numberOfCameras);
    },
    [numberOfCameras]
  );
  useImperativeHandle(ref, function () {
    return {
      takePhoto: function () {      
        if (numberOfCameras < 1) {
          throw new Error("There isn't any video device accessible.");
        }
      
        if (canvas && canvas.current && player && player.current) {
          const videoElement = player.current;

          // The intrinsic video resolution for the canvas
          const canvasWidth = videoElement.videoWidth;
          const canvasHeight = videoElement.videoHeight;

          canvas.current.width = canvasWidth;
          canvas.current.height = canvasHeight;

          const context = canvas.current.getContext("2d");

          if (context) {
            // Flip the image if the camera mode is user (front-facing camera)
            if (currentFacingMode === "user") {
              context.translate(canvasWidth, 0);
              context.scale(-1, 1);
            }

            context.drawImage(videoElement, 0, 0, canvasWidth, canvasHeight);
            const imgData = canvas.current.toDataURL("image/jpeg");
            return imgData;
          } else {
            throw new Error(errorMessages.canvas);
          }
        } else {
          throw new Error(errorMessages.canvas);
        }
      },
      switchCamera: async () => {
        if (loading) return;
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === "videoinput");
        const currentIndex = videoDevices.findIndex(device => streams.current.has(device.deviceId));
        const nextIndex = (currentIndex + 1) % videoDevices.length;
        const nextDevice = videoDevices[nextIndex];

        if (!streams.current.has(nextDevice.deviceId)) {
          const newStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: nextDevice.deviceId },
          });
          streams.current.set(nextDevice.deviceId, newStream);
          setActiveStream(newStream);
        } else {
          setActiveStream(streams.current.get(nextDevice.deviceId));
        }
        setFacingMode(nextDevice.label.includes("user") ? "environment" : "user");
      },
      stopCamera: () => {
        if (activeStream) {
          activeStream.getTracks().forEach(track => track.stop());
        }
      },
      restartCamera: async () => {
        if (loading) return;
        if (activeStream) {
          const deviceId = activeStream.getTracks()[0].getSettings().deviceId;
          const newStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId },
          });
          streams.current.set(deviceId, newStream);
          setActiveStream(newStream);
        }
      },
    };
  });

  useEffect(() => {
    if (player.current && activeStream) {
      player.current.srcObject = activeStream;
    }
  }, [activeStream]);

  useEffect(() => {
    if (stream) { 
      player.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    return function cleanup() {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [stream]);

  useEffect(
    function () {
      return initCameraStream(
        stream,
        setStream,
        currentFacingMode,
        setNumberOfCameras
      );
    },
    [currentFacingMode]
  );
  useEffect(
    function () {
      if (stream && player && player.current) {
        player.current.srcObject = stream;
      }
    },
    [stream]
  );
  return React.createElement(
    Container,
    { ref: container, aspectRatio: aspectRatio },
    React.createElement(
      Wrapper,
      null,
      React.createElement(Cam, {
        ref: player,
        id: "video",
        muted: true,
        autoPlay: true,
        playsInline: true,
        mirrored: currentFacingMode === "user" ? true : false,
      }),
      React.createElement(Canvas, { ref: canvas })
    )
  );
});
Camera.displayName = "Camera";
var initCameraStream = function (
  stream,
  setStream,
  currentFacingMode,
  setNumberOfCameras
) {
  // stop any active streams in the window
  if (stream) {
    stream.getTracks().forEach(function (track) {
      track.stop();
    });
  }
  var constraints = {
    audio: false,
    video: {
      facingMode: currentFacingMode,
      width: { ideal: 1920 },
      height: { ideal: 1920 },
    },
  };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      setStream(handleSuccess(stream, setNumberOfCameras));
    })
    .catch(handleError);
};
var handleSuccess = function (stream, setNumberOfCameras) {
  var track = stream.getVideoTracks()[0];
  var settings = track.getSettings();
  var str = JSON.stringify(settings, null, 4);
  console.log("Camera settings " + str);
  navigator.mediaDevices.enumerateDevices().then(function (r) {
    return setNumberOfCameras(
      r.filter(function (i) {
        return i.kind === "videoinput";
      }).length
    );
  });
  return stream;
};
var handleError = function (error) {
  console.error(error);
  //https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  if (error.name === "PermissionDeniedError") {
    throw new Error(
      "Permission denied. Please refresh and give camera permission."
    );
  }
};

export { Camera };
