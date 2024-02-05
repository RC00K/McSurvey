import { IonContent, IonPage } from "@ionic/react";
import { ReviewContainer } from "../components/ReviewContainer";

const Review: React.FC = () => {
    return (
        <IonPage>
            <IonContent className="ion-padding">
                <ReviewContainer 
                    selectedDriveThru={[]} 
                    selectedImages={[]}
                />
            </IonContent>
        </IonPage>
    );
}

export default Review;