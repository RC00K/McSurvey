import { IonContent, IonPage } from "@ionic/react";
import { QuestionContainer } from "../components/QuestionContainer";
import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useReview } from "../components/Review/ReviewContext";
import WarningModal from "../components/modals/WarningModal";
import "./Survey.css";

const Survey: React.FC = () => {
  const { selected } = useParams<{ selected: string }>();
  const driveThruSelection = selected === "0" ? "1" : "2";
  const history = useHistory();
  const { reset, setDriveThruSelection } = useReview();
  const [isSurveyComplete, setIsSurveyComplete] = useState(false);
  const [readyForReview, setReadyForReview] = useState(false);
  const [showExitAlert, setShowExitAlert] = useState(false);

  // Load data from the API or local storage
  useEffect(() => {
    const surveyData = localStorage.getItem("surveyData");
    if (surveyData) {
      const data = JSON.parse(surveyData);
      setIsSurveyComplete(data.isSurveyComplete);
      setReadyForReview(data.readyForReview);
    }

    // Set the drive-thru selection and reset the review state
    setDriveThruSelection(driveThruSelection);
  }, [selected, setDriveThruSelection, reset]);

  // Save to local storage whenever answers or state changes
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
    <IonPage>
      {showExitAlert && (
        <WarningModal
          showModal={showExitAlert}
          setShowModal={setShowExitAlert}
          onConfirmEnd={handleEndSurvey}
        />
      )}
      <IonContent>
        <div className="survey__main">
          <QuestionContainer
            driveThruSelection={driveThruSelection}
            onReadyForReviewChange={handleReadyForReviewChange}
          />
        </div>
        <button
          type="button"
          className="floating__button"
          onClick={handleGoToReview}
          disabled={!readyForReview}
        >
          Continue to Review
        </button>
      </IonContent>
    </IonPage>
  );
};

export default Survey;
