import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSurvey } from "../assets/context/SurveyContext";
import "./Completed.css";
import { IonContent, IonPage, IonIcon } from "@ionic/react";
import { checkmark } from "ionicons/icons";

const Completed: React.FC = () => {
  const { reset } = useSurvey();
  const [isSurveyComplete, setIsSurveyComplete] = useState(false);
  const history = useHistory()

  useEffect(() => {
    const surveyDataFromStorage = localStorage.getItem("surveyData");
    if (surveyDataFromStorage) {
      const data = JSON.parse(surveyDataFromStorage);
      setIsSurveyComplete(data.isComplete);
    }
  });

  const handleGoHome = () => {
    reset();
    history.push("/"); // Redirect to home page
  };

  // If handleGoHome is not called after 30 seconds, redirect to home page
  setTimeout(() => {
    handleGoHome();
  }, 30000);

  return (
    <>
      <IonPage>
        <IonContent>
          <div className="completed">
            <div className="checkmark__container">
              <div className="checkmark__content">
                  <div className="checkmark__background checkmark__icon">
                    <IonIcon icon={checkmark} />
                  </div>
              </div>
              <div className="checkmark__message">
                <h1>Survey Completed</h1>
                <p>Thank you for completing the survey!</p>
              </div>
              <button onClick={handleGoHome}>
                Return to Home
              </button>
            </div>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Completed;
