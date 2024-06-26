export declare type FacingMode = "user" | "environment";
export declare type AspectRatio = "cover" | number;
export declare type Stream = MediaStream | null;
export declare type SetStream = React.Dispatch<React.SetStateAction<Stream>>;
export declare type SetNumberOfCameras = React.Dispatch<React.SetStateAction<number>>;

export interface CameraProps {
  facingMode?: FacingMode;
  aspectRatio?: AspectRatio;
  numberOfCamerasCallback?(numberOfCameras: number): void;
  onInitialized?(): void;
}

export declare type CameraType = React.ForwardRefExoticComponent<CameraProps & React.RefAttributes<unknown>> & {
  takePhoto(): string;
  switchCamera(): FacingMode;
  hasFlashSupport(): boolean;
  toggleFlash(): boolean;
  stopCamera(): void;
  pauseCamera(): void;
  restartCamera(): void;
  getNumberOfCameras(): number;
  getNumberOfRequiredPictures(): number;
};
