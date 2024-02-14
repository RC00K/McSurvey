import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle, IonBackButton } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { ReviewContainer } from "../components/ReviewContainer";
import './Review.css';

const Review: React.FC = () => {
    return (
        <IonPage>
            <IonContent className="ion-padding">
                <ReviewContainer />
            </IonContent>
        </IonPage>
    );
}

export default Review;