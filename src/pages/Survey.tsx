import { IonContent, IonPage, IonButton } from "@ionic/react";
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
        <div className="survey__header">
          <svg viewBox="0 0 1160 272" preserveAspectRatio="none" style={{ width: '100%', position: 'absolute', top: 0, left: 0, transform: 'scale(1, -1.025)' }}>
            <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="5%" style={{ stopColor: '#807CB6', stopOpacity: 0 }} />
                    <stop offset="85%" style={{ stopColor: '#2C2686', stopOpacity: 1 }} />
                </linearGradient>
                <mask id="mask1">
                    <rect x="0" y="0" width="1160" height="272" fill="black"/>
                    <path d="M0 0C116 57.5624 255.29 21.663 450.512 68.5173C513.907 83.7325 575.489 107.875 857.86 36.2613C1000.84 -1.14441e-05 1160 49.042 1160 22.872C1160 -69.0274 1160 502.044 1160 343H0V0Z" fill="white"/>
                </mask>
            </defs>
            <rect width="1160" height="300" mask="url(#mask1)" fill="url(#gradient1)"/>
            <g mask="url(#mask1)" style={{ mixBlendMode: 'color-dodge' }}>
              <path d="M228.916 938.986C223.636 937.366 220.67 931.772 222.291 926.492L275.622 752.764C277.243 747.484 282.837 744.518 288.117 746.139L462.153 799.565C467.433 801.185 470.399 806.779 468.778 812.059L415.447 985.787C413.826 991.067 408.232 994.033 402.953 992.412L228.916 938.986Z" fill="#6B67AA"/>
              <path d="M953.667 924.13C949.283 927.489 943.006 926.659 939.647 922.275L813.001 756.993C809.642 752.609 810.473 746.332 814.857 742.973L980.428 616.106C984.812 612.747 991.089 613.577 994.448 617.961L1121.09 783.243C1124.45 787.627 1123.62 793.904 1119.24 797.263L953.667 924.13Z" fill="#6B67AA"/>
              <path d="M283 296C283 346.258 242.482 387 192.5 387C142.518 387 102 346.258 102 296C102 245.742 142.518 205 192.5 205C242.482 205 283 245.742 283 296Z" fill="#6B67AA"/>
              <path d="M785 549C785 604.781 739.781 650 684 650C628.219 650 583 604.781 583 549C583 493.219 628.219 448 684 448C739.781 448 785 493.219 785 549Z" fill="#6B67AA"/>
              <path d="M532 610.5C532 653.854 497.078 689 454 689C410.922 689 376 653.854 376 610.5C376 567.146 410.922 532 454 532C497.078 532 532 567.146 532 610.5Z" fill="#6B67AA"/>
              <path d="M328 590C328 680.022 254.575 753 164 753C73.4253 753 0 680.022 0 590C0 499.978 73.4253 427 164 427C254.575 427 328 499.978 328 590Z" fill="#6B67AA"/>
              <path d="M806 843.5C806 931.037 735.037 1002 647.5 1002C559.963 1002 489 931.037 489 843.5C489 755.963 559.963 685 647.5 685C735.037 685 806 755.963 806 843.5Z" fill="#6B67AA"/>
              <path d="M822.682 523.032C817.222 522.206 813.465 517.109 814.292 511.648L859.289 214.493C860.115 209.032 865.212 205.276 870.673 206.103L1168.11 251.142C1173.57 251.969 1177.33 257.066 1176.5 262.527L1131.51 559.682C1130.68 565.142 1125.58 568.899 1120.12 568.072L822.682 523.032Z" fill="#6B67AA"/>
              <path d="M472.419 473.347C467.476 475.811 461.472 473.802 459.008 468.859L308.036 165.988C305.572 161.045 307.582 155.04 312.525 152.577L615.684 1.46114C620.627 -1.00269 626.631 1.00691 629.095 5.94972L780.067 308.821C782.531 313.764 780.521 319.768 775.578 322.232L472.419 473.347Z" fill="#6B67AA"/>
            </g>
          </svg>
          <div className="survey__header__content">
            <h1>
              AOT green fees <span>survey</span>
            </h1>
            <p>Help us improve the drive-thru by answering a few questions!</p>
            <button onClick={() => history.goBack()}>Back</button>
          </div>
        </div>
        <div className="survey__container">
            <QuestionContainer
              driveThruSelection={driveThruSelection}
              onReadyForReviewChange={handleReadyForReviewChange}
            />
            <button className="survey__btn dark continue__btn" onClick={handleGoToReview} disabled={!readyForReview}>
              Continue to Review
            </button>
        </div>
    </IonPage>
  );
};

export default Survey;
