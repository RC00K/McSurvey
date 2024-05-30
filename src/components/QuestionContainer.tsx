import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { IonIcon, IonLabel } from "@ionic/react";
import { AccordionContainer } from "./AccordionContainer";
import { oneDrive, twoDrive } from "../assets/data/aotsfees";
import { add } from "ionicons/icons";
import "./QuestionContainer.css";
import { useReview } from "./Review/ReviewContext";
import "../theme/floating-button.css";

interface QuestionContainerProps {
  driveThruSelection: string;
  readyToSubmit: (isReady: boolean) => void;
}

export const QuestionContainer = ({
  driveThruSelection,
  readyToSubmit,
}: QuestionContainerProps) => {
  const { images, storeNumber, setStoreNumber } = useReview();
  const selectedDriveThru = driveThruSelection === "1" ? oneDrive : twoDrive;
  const history = useHistory();
  const location = useLocation();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    
  });

  const openCameraPage = (questionIndex: number) => {
    setCurrentQuestionIndex(questionIndex);
    localStorage.setItem("lastQuestionIndex", questionIndex.toString());
    const questionId = `question_${questionIndex}`;
    history.push(`/camera/${questionIndex}#${questionId}`);
  };

  useEffect(() => {
    const lastQuestionIndex = localStorage.getItem("lastQuestionIndex");
    if (lastQuestionIndex) {
      setCurrentQuestionIndex(parseInt(lastQuestionIndex, 10));
    }

    if (location.hash) {
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView();
        }
      }, 0);
    } else if (lastQuestionIndex) {
      setTimeout(() => {
        const element = document.querySelector(`#question_${lastQuestionIndex}`);
        if (element) {
          element.scrollIntoView();
        }
      }, 0);
    }
  }, [location.hash]);

  const isReadyForSubmitting = () => {
    const isStoreNumberFilled = storeNumber.trim() !== "";
    const areAllImagesUploaded = selectedDriveThru.every((item) =>
      item.questions.every((question, qIndex) => images[`question_${qIndex}`])
    );
    return isStoreNumberFilled && areAllImagesUploaded;
  };

  useEffect(() => {
    readyToSubmit(isReadyForSubmitting());
  }, [storeNumber, images, readyToSubmit]);

  return (
    <div className="question__container">
      <label className="text__input__label">
        <h2>Store Number</h2>
      </label>
      <input
        id="storeNumber"
        className="text__input"
        value={storeNumber}
        placeholder="Store Number"
        onChange={(e) => setStoreNumber(e.target.value!)}
      />
      {selectedDriveThru.map((item, index) => {
        return item.questions.map((question, qIndex) => {
          const questionId = `question_${qIndex}`;
          const imageSrc = images[questionId];
          return (
            <div key={`question_${index}_${qIndex}`}>
              <div className="question__header">
                <h2>{question.questionTitle}</h2>
                <p>{question.questionDesc}</p>
              </div>
              <div>
                <div key={`question_${index}`} className="question__body" id={questionId}>
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
                <div 
                  key={`question_${index}_${qIndex}`} 
                  className="file__upload"
                  onClick={(e) => {
                    e.preventDefault();
                    openCameraPage(qIndex);
                  }}
                >
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt="Uploaded"
                      className="image__preview"
                    />
                  ) : (
                    <>
                      <div className="file__upload__icon">
                        <IonIcon icon={add} size="large" />
                      </div>
                      <p>
                        Click to upload
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        });
      })}
    </div>
  );
};
