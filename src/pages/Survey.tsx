import { getSurveys } from "../services/surveyService";
import { IonContent, IonPage } from "@ionic/react";
import { QuestionContainer } from "../components/QuestionContainer";
import { useEffect, useState } from "react";
import { useSurvey } from "../assets/context/SurveyContext";
import AgreeModal from "../components/modals/AgreeModal";
import DangerModal from "../components/modals/DangerModal";
import "./Survey.css";

const Survey: React.FC = () => {
  const { reset } = useSurvey();
  const [surveyData, setSurveyData] = useState<any>();
  const [isSurveyComplete, setIsSurveyComplete] = useState(false);
  const [readyForSubmitting, setReadyForSubmitting] = useState(false);
  const [showAgreeModal, setShowAgreeModal] = useState(false);
  const [showExitAlert, setShowExitAlert] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  useEffect(() => {
    const fetchSurveys = async () => {
      const surveys = await getSurveys();
      const parsedSurveyData = JSON.parse(surveys[0].SurveyJson);
      setSurveyData(parsedSurveyData);
    };
    fetchSurveys();
  }, []);

  useEffect(() => {
    const surveyDataFromStorage = localStorage.getItem("surveyData");
    if (surveyDataFromStorage) {
      const data = JSON.parse(surveyDataFromStorage);
      setIsSurveyComplete(data.isSurveyComplete);
      setReadyForSubmitting(data.readyForSubmitting);
      setSurveyData(data);
    }
  }, [reset]);

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

  const removeAgreeModal = () => {
    setShowAgreeModal(false);
  };

  useEffect(() => {
    if (isEmailSent) {
      setIsEmailSent(false);
      removeAgreeModal();
    }
  }, [isEmailSent]);

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
            surveyData={surveyData}
          />
        )}
        {/* {showExitAlert && (
          <DangerModal
            showModal={showExitAlert}
            setShowModal={setShowExitAlert}
            handleEnd={handleEndSurvey}
          />
        )} */}
        <IonContent>
        <div className="survey" id="survey">
          <div className="survey__container">
            <div className="survey__content">
              {surveyData && <QuestionContainer 
                surveyData={surveyData} 
                readyToSubmit={handleReadyForSubmitting} 
                />
              }
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
