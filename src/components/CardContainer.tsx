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
          <>
            <div className="survey__cards">
              <article className="survey__card" key={index} onClick={onCardClick}>
                <div className="survey__card__content">
                  <h2 className="survey__card__title">{surveyTitle}</h2>
                  <p className="survey__card__category">{surveyCategory}</p>
                </div>
                <div className="survey__card__bottom">
                  <div className="survey__card__props">
                    <div className="survey__card__prop">
                      <p>
                        {surveyCompletionTime}
                      </p>
                      <p>
                        {surveyQuestions}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </>
        )
      )}
    </>
  );
};

export default CardContainer;
