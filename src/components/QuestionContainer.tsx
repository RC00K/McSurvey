import { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { IonIcon, IonLabel } from "@ionic/react";
import { AccordionContainer } from "./AccordionContainer";
import { oneDrive, twoDrive } from "../assets/data/aotsfees";
import { add } from "ionicons/icons";
import "./QuestionContainer.css";
import { useSurvey } from "../assets/context/SurveyContext";
import "../theme/floating-button.css";

interface QuestionContainerProps {
  surveyData: any;
  readyToSubmit: (isReady: boolean) => void;
}

export const QuestionContainer = ({
  surveyData,
  readyToSubmit,
}: QuestionContainerProps) => {
  const { images, storeNumber, setStoreNumber, accountManager, setAccountManager } = useSurvey();
  const history = useHistory();
  const location = useLocation();
  const [error, setError] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const { storeNumber: storeNumberFromUrl } = useParams<{ storeNumber: string | undefined }>();

  const handleStoreNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (/^\d*$/.test(value)) {
      setStoreNumber(value);
      setError(false);
    } else {
      e.preventDefault();
      setError(true);
    }
  };

  const handleStoreNumberFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value !== '' && !error) {
      value = value.padStart(5, '0');
      setStoreNumber(value);
      assignAccountManager(value);
    } else if (value === '' && error) {
      setError(false);
    }
  };

  const getAccManager = async (storeNumber: string) => {
    const response = await fetch(`https://mcsurveyfetcherapi.gomaps.com/api/accmgr`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ storeNumber }),
    });

    if (!response.ok) {
      console.log("Error occurred while fetching account managers", response);
      return;
    }    
    const accountMgr = await response.json();
    return accountMgr;
  };

  // Assign account manager
  const assignAccountManager = async (storeNumber: string) => {
    setStoreNumber(storeNumber || storeNumberFromUrl || '')
    const accManager = await getAccManager(storeNumber || storeNumberFromUrl || '');
    setAccountManager(accManager);
  };

  useEffect(() => {
    const loadAccountManager = async () => {
      const fetchedAccManager = await getAccManager(storeNumber || storeNumberFromUrl || '');
      setAccountManager(fetchedAccManager);
    };

    loadAccountManager();
  }, [storeNumber]);

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
    const isStoreNumberFilled = storeNumber.trim() !== '';
    const areAllImagesUploaded = Object.keys(images).every((key) => images[key] !== undefined);
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
      {storeNumberFromUrl 
        ? <input
            type="text"
            className="text__input"
            defaultValue={storeNumberFromUrl}
            readOnly
          />
        : <input
            type="text"
            pattern="[0-9]*"
            inputMode="numeric"
            className="text__input"
            defaultValue={storeNumber}
            maxLength={5}
            onChange={handleStoreNumberChange}
            onBlur={handleStoreNumberFocus}
            placeholder="Store Number"
          />
      }
      {surveyData.surveyTypes && surveyData.surveyTypes.length > 0 && surveyData.surveyTypes[0].questions.map((question: any, qIndex: number) => {
        const questionId = `question_${qIndex}`;
        const imageSrc = images[questionId] || [];
        return (
          <div key={`question_${qIndex}`}>
            <div className="question__header">
              <h2>{question.questionTitle}</h2>
              <p>{question.questionDesc}</p>
            </div>
            <div>
              <div className="question__body" id={questionId}>
                <p>{question.question}</p>
              </div>
              {question.questionHints &&
                question.questionHints.length > 0 && (
                  <ol>
                    {question.questionHints.map((hint: any, hintIndex: number) => (
                      <li key={`hint_${hintIndex}`}>{hint.hint}</li>
                    ))}
                  </ol>
                )}
              {/* <AccordionContainer question={question} /> */}
              <div className="file__upload">
                <div className="file__upload__content">
                  <div className="file__upload-top">
                    {imageSrc.length > 0 && (
                      imageSrc.map((src, index) => (
                        <img 
                          key={`${questionId}_image_${index}`}
                          src={src}
                          alt="Uploaded"
                          className="image__preview"
                        />
                      ))
                    )}
                  </div>
                  <div className="file__upload-bottom">
                    <button
                      className="file__upload-button"
                      onClick={(e) => {
                        e.preventDefault();
                        openCameraPage(qIndex);
                      }}
                    >
                      Click to upload
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
