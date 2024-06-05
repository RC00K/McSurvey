import {
    IonIcon,
  } from "@ionic/react";
  import { addCircleOutline, removeCircleOutline } from "ionicons/icons";
  import "./AccordionContainer.css";
  import { useState } from "react";
  
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
    const [expanded, setExpanded] = useState(false);

    const handleExpand = () => {
      setExpanded(!expanded);
    };

    return (
      <div className="accordion__container">
        <details onToggle={handleExpand}>
          <summary>
            <span className="accordion__title">
              Example Pictures
            </span>
            <IonIcon icon={expanded ? removeCircleOutline : addCircleOutline} className="accordion__expand" />
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
    );
  };
  