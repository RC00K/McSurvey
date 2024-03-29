import {
  IonHeader,
  IonItem,
  IonChip,
  IonCard,
  IonImg,
  IonIcon,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonText,
  IonTitle,
  IonToolbar,
  IonBadge,
  IonLabel,
} from "@ionic/react";
import { timeOutline, listOutline, fastFood } from "ionicons/icons";
import mcdrive from "../assets/images/mcdrive.jpg";
// import './CardContainer.css';

const surveys = [
  {
    img: mcdrive,
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
            img,
            surveyCategory,
            surveyTitle,
            surveyCompletionTime,
            surveyQuestions,
          },
          index
        ) => (
          <div className="card" key={index} onClick={onCardClick}>
            <div className="card__header">
              <img src={fastFood} alt="Drive Thru" />
              <span>{surveyCategory}</span>
            </div>
            <div className="card__title">
              <h3>{surveyTitle}</h3>
            </div>
            <div className="card__footer">
              <div className="card__footer__info">
                <IonIcon icon={timeOutline} />
                <span>{surveyCompletionTime}</span>
              </div>
              <div className="card__footer__info">
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
