import * as React from 'react';
import { useRef, useState, useCallback, useMemo } from 'react';
import { GestureResponderEvent, StyleSheet, Text, View } from 'react-native';
import { PinchGestureHandler, PinchGestureHandlerGestureEvent, TapGestureHandler } from 'react-native-gesture-handler';
import {
    CameraProps,
    CameraRuntimeError,
    PhotoFile,
    useCameraDevice,
    useCameraFormat,
    useFrameProcessor,
    VideoFile
} from 'react-native-vision-camera';
import { Camera } from 'react-native-vision-camera';
import { CONTENT_SPACING, CONTROL_BUTTON_SIZE, MAX_ZOOM_FACTOR, SAFE_AREA_PADDING, SCREEN_HEIGHT, SCREEN_WIDTH } from './Constants';
import Reanimated, { Extrapolate, interpolate, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useEffect } from 'react';
import { useIsForeground } from './hooks/useIsForeground';
import { StatusBarBlurBackground } from './StatusBarBlurBackground';
import { CaptureButton } from './CaptureButton';
import { PressableOpacity } from 'react-native-pressable-opacity';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';
import { usePreferredCameraDevice } from './hooks/usePreferredCameraDevice';
import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions, CameraPreviewFlashMode } from '@capacitor-community/camera-preview';

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({
    zoom: true,
});

const SCALE_FULL_ZOOM = 3;

type Props = NativeStackScreenProps<Routes, 'CameNative'>;

interface CamNavProps {
    isCameraActive: boolean;
    handleCloseCamera: () => void;
    onImageSave: (savedImage: string) => void;
    onImageCaptured: (image: string) => void;
}

export function CamNative({ navigation }: Props): React.ReactElement {
    const camera = useRef<Camera>(null);
    const [isCameraInitialized, setIsCameraInitialized] = useState(false);
    const hasMicrophonePermission = useMemo(() => Camera.getMicrophonePermissionStatus() === 'granted', []);
    const zoom = useSharedValue(1);
    const isPressingButton = useSharedValue(false);

    // Camera is active
    const isFocused = useIsFocused();
    const isForeground = useIsForeground();
    const isActive = isFocused && isForeground;

    const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>('back');
    const [enableHdr, setEnableHdr] = useState(false);
    const [flash, setFlash] = useState<'off' | 'on'>('off');
    const [enableNightMode, setEnableNightMode] = useState(false);

    // Device Settings
    const [preferredDevice] = usePreferredCameraDevice();
    let device = useCameraDevice(cameraPosition);


}