import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle, IonBackButton } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { ReviewContainer } from "../components/ReviewContainer";
import './Review.css';
import { useEffect } from "react";

const Review: React.FC = () => {
    const history = useHistory();

    useEffect(() => {
      const unblock = history.block((location, action) => {
            if (action === "POP") {
                return false;
            }
        });

        return () => {
            unblock();
        };
    }, [history]);

    return (
        <IonPage>
            <IonContent className="ion-padding">
                <ReviewContainer />
            </IonContent>
            <button className="floating__button">
                Submit
            </button>
        </IonPage>
    );
}

export default Review;