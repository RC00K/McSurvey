import {
    Camera,
    CameraResultType,
    CameraSource,
    Photo,
  } from "@capacitor/camera";
  import { Filesystem, Directory } from "@capacitor/filesystem";
  import { useReview } from "../components/Review/ReviewContext";
  import { base64FromPath } from "../utils/base64FromPath";
  import { UserPhoto } from "../interfaces";
  
  export function usePhotoGallery() {
    const { addImage } = useReview();
  
    const takePhoto = async (questionIndex: number) => {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100,
      });
      const fileName = `photo_${new Date().getTime()}.jpeg`;
      const savedFileImage = await savePicture(photo, fileName);
      if (savedFileImage.webviewPath) {
        addImage(`question_${questionIndex}`, savedFileImage.webviewPath);
      }
    };
  
    const savePicture = async (
      photo: Photo,
      fileName: string
    ): Promise<UserPhoto> => {
      const base64Data = await base64FromPath(photo.webPath!);
      await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Data,
      });
  
      return {
        filepath: fileName,
        webviewPath: photo.webPath,
      };
    };
  
    return {
      takePhoto,
    };
  }
  