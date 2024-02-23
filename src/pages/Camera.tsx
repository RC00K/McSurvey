import { useState } from "react";
import { IonPage, IonContent } from "@ionic/react";
import { useCamera } from "../components/Camera/CameraContext";
import CameraContainer from "../components/Camera/CameraContainer";


const Camera: React.FC = () => {
    const { isCameraOpen, closeCamera } = useCamera();
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    const handleCloseCamera = () => {
        closeCamera();
    };

    const addImage = (image: string) => {
        console.log('Image added: ', image);
        // Save the image to local storage
        localStorage.setItem('capturedImage', image);
    };

    const handleImageSave = (savedImage: string) => {
        addImage(savedImage);
        handleCloseCamera();
    };

    return (
        <IonPage>
            <IonContent>
                <CameraContainer
                    isCameraActive={isCameraOpen}
                    handleCloseCamera={closeCamera}
                    onImageSave={handleImageSave}
                    onImageCaptured={(image) => setCapturedImage(image)}
                />
            </IonContent>
        </IonPage>
    );
}

export default Camera;