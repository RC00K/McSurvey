import { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router";
import { useForm, SubmitHandler, set } from "react-hook-form";
import {
  IonIcon,
  IonLabel,
  IonButton,
  IonAlert,
  IonInput,
  IonContent,
} from "@ionic/react";
import { AccordionContainer } from "./AccordionContainer";
import { oneDrive, twoDrive } from "../assets/data/aotsfees";
import { add } from "ionicons/icons";
import "./QuestionContainer.css";
import { useReview } from "./Review/ReviewContext";
import { usePhotoGallery } from "../hooks/usePhotoGallery";
import { Filesystem, Directory } from "@capacitor/filesystem";
import "../theme/floating-button.css";

interface FormData {
  question: string;
}

interface QuestionContainerProps {
  driveThruSelection: string;
  onReadyForReviewChange: (isReady: boolean) => void;
}

export const QuestionContainer = ({ driveThruSelection, onReadyForReviewChange }: QuestionContainerProps) => {
  const { takePhoto } = usePhotoGallery();
  const { images, storeNumber, setStoreNumber } = useReview();
  const selectedDriveThru = driveThruSelection === '1' ? oneDrive : twoDrive;

  // Check if the survey is complete
  const isReadyForReview = () => {
    const isStoreNumberFilled = storeNumber.trim() !== '';
    const areAllImagesUploaded = selectedDriveThru.every((item) => 
      item.questions.every((question, qIndex) => images[`question_${qIndex}`])
    );
    return isStoreNumberFilled && areAllImagesUploaded;
  };

  useEffect(() => {
    onReadyForReviewChange(isReadyForReview());
  }, [storeNumber, images, onReadyForReviewChange]);

  return (
    <>
      <div className="question__container">
        <IonLabel>
          <h2>Store Number</h2>
        </IonLabel>
        <IonInput
            value={storeNumber}
            placeholder="Enter Store Number"
            onIonChange={(e) => {
                setStoreNumber(e.detail.value!)
            }}
        />
        {selectedDriveThru.map((item, index) => {
          return item.questions.map((question, qIndex) => {
            const questionId = `question_${qIndex}`;
            const imageSrc = images[questionId];
            return (
              <form
                key={`form_${index}_${qIndex}`}
              >
                <div key={`label_${index}_${qIndex}`}>
                  <IonLabel>
                    <h2>{question.questionTitle}</h2>
                    <p>{question.questionDesc}</p>
                  </IonLabel>
                  <div>
                    <div key={`question_${index}`}>
                      <p>{question.question}</p>
                    </div>
                    {question.questionHints &&
                      question.questionHints.length > 0 && (
                        <ol>
                          {question.questionHints.map((hint, hintIndex) => (
                            <li key={`hint_${hintIndex}`}>{hint.hint}</li>
                          ))}
                        </ol>
                      )}
                    <AccordionContainer question={question} />
                    <div className="file__upload" onClick={() => takePhoto(qIndex)}>
                        {imageSrc ? (
                            <img
                                src={imageSrc}
                                alt="Uploaded"
                                className="image__preview"
                            />
                        ) : (
                          <button className="add__photo">
                            <IonIcon icon={add} size="large" />
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              </form>
            );
          });
        })}
      </div>
    </>
  );
};
