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
  const { addImage, images, setImages } = useReview();

  const takePhoto = async (questionIndex: number) => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });
    const fileName = `photo_${new Date().getTime()}.jpeg`;
    const savedFileImage = await savePicture(photo, fileName);
    if (savedFileImage.filepath) {
      const imageSrc = await loadSavedImage(savedFileImage.filepath);
      const updatedImages = { ...images, [`question_${questionIndex}`]: imageSrc };
      setImages(updatedImages);
      localStorage.setItem("surveyData", JSON.stringify({ images: updatedImages}))
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

  const loadSavedImage = async (filePath: string): Promise<string> => {
    try {
      const fileContents = await Filesystem.readFile({
        path: filePath,
        directory: Directory.Data,
      });
      return `data:image/jpeg;base64,${fileContents.data}`;
    } catch (error) {
      console.error("Failed to load image: ", error);
      return "";
    }
  }

  return {
    takePhoto,
  };
}
