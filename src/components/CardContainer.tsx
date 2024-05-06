import { IonIcon, IonCardSubtitle } from "@ionic/react";
import { timeOutline, listOutline, fastFood } from "ionicons/icons";
import "./CardContainer.css";

const surveys = [
  {
    surveyCategory: "Drive Thru",
    surveyTitle: "Drive Thru Survey",
    surveyCompletionTime: "5 minutes",
    surveyQuestions: "5 questions",
  },
];

const CardContainer = ({ onCardClick }: { onCardClick: any }) => {
  return (
    <>
      {surveys.map(
        (
          {
            surveyCategory,
            surveyTitle,
            surveyCompletionTime,
            surveyQuestions,
          },
          index
        ) => (
          <div className="survey__card" key={index} onClick={onCardClick}>
            <div className="survey__card__title">
              <IonIcon icon={fastFood} />
              <IonCardSubtitle>{surveyCategory}</IonCardSubtitle>
            </div>
            <div className="survey__title">
              <h3>{surveyTitle}</h3>
            </div>

            <div className="survey__completion">
              <div className="survey__details">
                <IonIcon icon={timeOutline} />
                <span>{surveyCompletionTime}</span>
              </div>

              <div className="survey__details">
                <IonIcon icon={listOutline} />
                <span>{surveyQuestions}</span>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default CardContainer;
