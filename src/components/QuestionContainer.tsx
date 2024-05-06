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
  onReadyForReviewChange: (isReady: boolean) => void;
}

export const QuestionContainer = ({
  driveThruSelection,
  onReadyForReviewChange,
}: QuestionContainerProps) => {
  const { images, storeNumber, setStoreNumber } = useReview();
  const selectedDriveThru = driveThruSelection === "1" ? oneDrive : twoDrive;
  const history = useHistory();
  const location = useLocation();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const openCameraPage = (questionIndex: number) => {
    const questionId = `question_${questionIndex}`;
    history.push(`/camera/${questionIndex}#${questionId}`);
  };

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView();
        }
      }, 0);
    }
  }, [location.hash]);

  // Check if the survey is complete
  const isReadyForReview = () => {
    const isStoreNumberFilled = storeNumber.trim() !== "";
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
                    {/* imageSrc from imageUrl = capacitor://${savedFileImage.uri} */}
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt="Uploaded"
                        className="image__preview"
                      />
                    ) : (
                      <button type="button" className="add__photo">
                        <IonIcon icon={add} size="large" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          });
        })}
      </div>
    </>
  );
};
