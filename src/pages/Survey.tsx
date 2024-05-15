import { IonContent, IonPage, IonButton, IonIcon } from "@ionic/react";
import { chevronBack } from "ionicons/icons";
import { QuestionContainer } from "../components/QuestionContainer";
import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useReview } from "../components/Review/ReviewContext";
import WarningModal from "../components/modals/WarningModal";
import "./Survey.css";
import "../theme/styles.css";

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
        <main className="main">
          <section className="section" id="survey-header">
            <div className="container">
              <div className="survey__header__content">
                <button className="back__btn" onClick={() => history.goBack()}>
                  <IonIcon icon={chevronBack} />
                </button>
                <div className="survey__header__upper">
                  <div>
                    <h1 className="survey__header__title">
                      AOT green fees <span>survey</span>
                    </h1>
                    <p className="survey__header__description">
                      Help us improve the drive-thru by answering a few questions!
                    </p>
                  </div>
                </div>
                <svg className="survey__header__svg" viewBox="0 0 1160 400" preserveAspectRatio="none">
                  <defs>
                      <linearGradient id="gradient1" x1="0%" y1="100%" x2="0%" y2="0%">
                          <stop offset="15%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
                          <stop offset="65%" style={{ stopColor: '#807CB6', stopOpacity: 0.4 }} />
                          <stop offset="95%" style={{ stopColor: '#2C2686', stopOpacity: 1 }} />
                      </linearGradient>
                      <mask id="mask1">
                          <path x="0" y="0" width="1160" height="400" d="M1160 400H0V0H1160V400Z" />
                          <path
                              d="M0 400C116 342.876 255.29 378.22 450.512 331.607C513.907 316.522 575.489 292.54 857.86 363.527C1000.84 400 1160 351.042 1160 376.995C1160 468.678 1160 -198.621 1160 0H0V400Z"
                              fill="white"
                          />
                      </mask>
                      <clipPath id="clip">
                          <path d="M0 395C136 337.876 275.29 373.22 470.512 326.607C533.907 311.522 595.489 287.54 877.86 358.527C1020.84 395 1180 346.042 1180 371.995C1180 463.678 1180 -183.621 1180 15H20V395Z"/>
                      </clipPath>
                  </defs>
                  <rect width="1160" height="400" mask="url(#mask1)" fill="url(#gradient1)" />
                  <g style={{ mixBlendMode: 'color-dodge' }} clip-path="url(#clip)" >
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
              </div>
            </div>
          </section>
          <section className="survey section" id="survey">
            <div className="survey__container container">
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
          </section>
        </main>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Survey;
