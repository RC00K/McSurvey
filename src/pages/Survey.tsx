import { IonContent, IonPage, IonButton, IonIcon } from "@ionic/react";
import { chevronBack } from "ionicons/icons";
import { QuestionContainer } from "../components/QuestionContainer";
import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useReview } from "../components/Review/ReviewContext";
import AgreeModal from "../components/modals/AgreeModal";
import DangerModal from "../components/modals/DangerModal";
import "./Survey.css";
import NavToolbar from "../components/Navigation/NavToolbar";

const Survey: React.FC = () => {
  const { selected } = useParams<{ selected: string }>();
  const driveThruSelection = selected === "0" ? "1" : "2";
  const history = useHistory();
  const { reset, setDriveThruSelection } = useReview();
  const [isSurveyComplete, setIsSurveyComplete] = useState(false);
  const [readyForSubmitting, setReadyForSubmitting] = useState(false);
  const [showAgreeModal, setShowAgreeModal] = useState(false);
  const [showExitAlert, setShowExitAlert] = useState(false);

  useEffect(() => {
    const surveyData = localStorage.getItem("surveyData");
    if (surveyData) {
      const data = JSON.parse(surveyData);
      setIsSurveyComplete(data.isSurveyComplete);
      setReadyForSubmitting(data.readyForSubmitting);
    }

    setDriveThruSelection(driveThruSelection);
  }, [selected, setDriveThruSelection, reset]);

  useEffect(() => {
    localStorage.setItem("surveyData", JSON.stringify({ 
      isComplete: isSurveyComplete, 
      isReadyToSubmit: readyForSubmitting }));
  }, [isSurveyComplete, readyForSubmitting]);

  const handleReadyForSubmitting = (isReady: boolean) => {
    setReadyForSubmitting(isReady);
  };

  const handlePresentAgreement = () => {
    setShowAgreeModal(true);
  };

  useEffect(() => {
    const handleBackButtonEvent = (e: any) => {
      e.preventDefault();
      setShowExitAlert(true);
    };
    window.history.pushState(null, "null", window.location.pathname);
    window.addEventListener("popstate", handleBackButtonEvent);
    
    return () => {
      window.removeEventListener("popstate", handleBackButtonEvent);
    };
  }, []);

  const handleEndSurvey = () => {
    reset();
    localStorage.removeItem("surveyData");
    setShowExitAlert(false);
    window.history.back();
  };

  return (
    <>
      <IonPage>
        {showAgreeModal && (
          <AgreeModal
            showModal={showAgreeModal}
            setShowModal={setShowAgreeModal}
          />
        )}
        {showExitAlert && (
          <DangerModal
            showModal={showExitAlert}
            setShowModal={setShowExitAlert}
            handleEnd={handleEndSurvey}
          />
        )}
        <IonContent>
        <div className="survey" id="survey">
          <div className="survey__container">
            <div className="survey__content">
              <QuestionContainer
                driveThruSelection={driveThruSelection}
                readyToSubmit={handleReadyForSubmitting}
              />
              <div className="survey__footer">
                <button className="primary__btn" onClick={handlePresentAgreement} disabled={!readyForSubmitting}>
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Survey;
