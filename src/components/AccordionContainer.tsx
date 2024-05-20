import {
    IonAccordion,
    IonAccordionGroup,
    IonItem,
    IonLabel,
    IonImg,
    IonIcon,
  } from "@ionic/react";
  import { addCircleOutline, removeCircleOutline } from "ionicons/icons";
  import "./AccordionContainer.css";
  
  interface Question {
    questionTitle: string;
    question: string;
    questionHints?: {
      hint: string;
    }[];
    questionImages: {
      image: string;
      imageAlt: string;
    }[];
  }
  
  export const AccordionContainer = ({ question }: { question: Question }) => {
    return (
      <div className="accordion__container">
        <details>
          <summary>
            <span className="accordion__title">
              Example Pictures
            </span>
            <IonIcon icon={addCircleOutline} className="accordion__expand" />
          </summary>
          <div className="accordion__content">
            <div className="accordion__gallery__grid">
              {question.questionImages.map((image, imgIndex) => (
                <div key={`image_${imgIndex}`} className="accordion__gallery__content">
                  <div className="accordion__card">
                    <img src={image.image} alt={image.imageAlt} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </details>
      </div>
      // <IonAccordionGroup className="accordion__container">
      //   <IonAccordion value={question.question}>
      //     <IonItem slot="header">
      //       <IonLabel>Examples</IonLabel>
      //     </IonItem>
      //     <div className="accordion__image__grid" slot="content">
      //       {question.questionImages.map((image, imgIndex) => (
      //         <IonItem key={`image_${imgIndex}`}>
      //           <IonImg src={image.image} alt={image.imageAlt} />
      //         </IonItem>
      //       ))}
      //     </div>
      //   </IonAccordion>
      // </IonAccordionGroup>
    );
  };
  