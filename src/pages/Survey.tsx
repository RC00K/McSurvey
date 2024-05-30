import { IonContent, IonPage, IonButton, IonIcon } from "@ionic/react";
import { chevronBack } from "ionicons/icons";
import { QuestionContainer } from "../components/QuestionContainer";
import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useReview } from "../components/Review/ReviewContext";
import WarningModal from "../components/modals/WarningModal";
import "./Survey.css";
import NavToolbar from "../components/Navigation/NavToolbar";

const Survey: React.FC = () => {
  const { selected } = useParams<{ selected: string }>();
  const driveThruSelection = selected === "0" ? "1" : "2";
  const history = useHistory();
  const { reset, setDriveThruSelection } = useReview();
  const [isSurveyComplete, setIsSurveyComplete] = useState(false);
  const [readyForReview, setReadyForReview] = useState(false);
  const [showExitAlert, setShowExitAlert] = useState(false);

  useEffect(() => {
    const surveyData = localStorage.getItem("surveyData");
    if (surveyData) {
      const data = JSON.parse(surveyData);
      setIsSurveyComplete(data.isSurveyComplete);
      setReadyForReview(data.readyForReview);
    }

    setDriveThruSelection(driveThruSelection);
  }, [selected, setDriveThruSelection, reset]);

  useEffect(() => {
    localStorage.setItem("surveyData", JSON.stringify({ 
      isComplete: isSurveyComplete, 
      isReadForReview: readyForReview }));
  }, [isSurveyComplete, readyForReview]);

  const handleExitSurvey = () => {
    setShowExitAlert(true);
  };

  const handleEndSurvey = () => {
    reset();
    localStorage.removeItem("surveyData");
    setShowExitAlert(false);
    history.push("/");
  }

  const handleReadyForReviewChange = (isReady: boolean) => {
    setReadyForReview(isReady);
  };

  const handleGoToReview = () => {
    history.push("/review");
  };

  return (
    <>
      <IonPage>
        <IonContent>
        {showExitAlert && (
          <WarningModal
            showModal={showExitAlert}
            setShowModal={setShowExitAlert}
            onConfirmEnd={handleEndSurvey}
          />
        )}
        <div className="survey" id="survey">
          <div className="survey__container">
            <div className="survey__content">
              <QuestionContainer
                driveThruSelection={driveThruSelection}
                onReadyForReviewChange={handleReadyForReviewChange}
              />
              <div className="survey__footer">
                <button className="continue__btn" onClick={handleGoToReview} disabled={!readyForReview}>
                  Continue to Review
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
