import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle, IonBackButton } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { ReviewContainer } from "../components/ReviewContainer";
import './Review.css';
import { useEffect, useState } from "react";

const Review: React.FC = () => {
    const history = useHistory();
    const [reviewData, setReviewData] = useState({});

    useEffect(() => {
        // Load the survey data from local storage
        const savedData = localStorage.getItem("surveyData");
        if (savedData) {
            setReviewData(JSON.parse(savedData));
        }

        // Prevent going back using browser buttons
        const unblock = history.block((location, action) => {
            if (action === "PUSH") {
                return false;
            }
        });

        return () => {
            unblock();
        };
    }, [history]);

    const handleSubmit = () => {
        // Clear the survey data from local storage
        localStorage.removeItem("surveyData");
        // Redirect to the home page
        history.push("/");
    };

    // Allow user to return to the survey page
    const handleBackToSurvey = () => {
        history.goBack();
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/" />
                    </IonButtons>
                    <IonTitle>Review</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <ReviewContainer />
                <IonButton onClick={handleBackToSurvey} fill="outline" slot="start">
                    <IonIcon icon={arrowBack} />
                    Edit Responses
                </IonButton>
            </IonContent>
        </IonPage>
    );
}

export default Review;