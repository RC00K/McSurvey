import { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { IonIcon, IonLabel } from "@ionic/react";
import { AccordionContainer } from "./AccordionContainer";
import { cameraOutline, trash } from "ionicons/icons";
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
  const { images, storeNumber, setStoreNumber, accountManager, setAccountManager, deleteImage, replaceImage } = useSurvey();
  const history = useHistory();
  const location = useLocation();
  const [error, setError] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [installerName, setInstallerName] = useState(() => localStorage.getItem("installerName") || ""); // Retrieve installer name from localStorage

  const { storeNumber: storeNumberFromUrl } = useParams<{ storeNumber: string | undefined }>();

  useEffect(() => {
    const storedStoreNumber = localStorage.getItem("storeNumber");
    if (storedStoreNumber) {
      setStoreNumber(storedStoreNumber);
    } else if (storeNumberFromUrl) {
      setStoreNumber(storeNumberFromUrl);
      localStorage.setItem("storeNumber", storeNumberFromUrl);
    }
  }, [storeNumberFromUrl, setStoreNumber]);

  const handleStoreNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (/^\d*$/.test(value)) {
      setStoreNumber(value);
      setError(false);
      localStorage.setItem("storeNumber", value);
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
      localStorage.setItem("storeNumber", value);
      assignAccountManager(value);
    } else if (value === '' && error) {
      setError(false);
    }
  };

  const handleInstallerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInstallerName(e.target.value);
    localStorage.setItem("installerName", e.target.value);
  };

  const getAccManager = async (storeNumber: string) => {
    const response = await fetch(`https://mcsurveyfetcherapi.gomaps.com/accmgr`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ storeNumber })
    });

    if (!response.ok) {
      console.log("Error occurred while fetching account managers", response);
      return;
    }    
    const accountMgr = await response.json();

    const accMgr = accountMgr[0].AccMgr;
    setAccountManager(accMgr);
    localStorage.setItem("accountManager", accMgr);

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

  const handleDeleteImage = (questionId: string, index: string) => {
    deleteImage(questionId, index);
  };

  const handleReplaceImage = (questionId: string, index: string) => {
    replaceImage(questionId, index);
  };

  useEffect(() => {
    const lastQuestionIndex = localStorage.getItem("lastQuestionIndex");
    
    if (!lastQuestionIndex) return;
  
    setTimeout(() => {
      const element = document.getElementById(`question_${lastQuestionIndex}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100); // delay in milliseconds
  }, [location.pathname]);

  // Remove number and . from string on the question 
  const removeNumberAndDot = (question: string) => {
    return question.replace(/^\d+\.\s/, '');
  };

  const isReadyForSubmitting = () => {
    const isInstallerNameFilled = installerName.trim() !== '';
    const areAllImagesUploaded = Object.keys(images).every((key) => images[key] !== undefined);
    if (storeNumberFromUrl) {
      return isInstallerNameFilled && areAllImagesUploaded;
    } else {
      const isStoreNumberFilled = storeNumber.trim() !== '';
      return isStoreNumberFilled && isInstallerNameFilled && areAllImagesUploaded;
    }
  };

  useEffect(() => {
    readyToSubmit(isReadyForSubmitting());
  }, [storeNumber, installerName, images, readyToSubmit]);

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
            value={storeNumber} // Use value instead of defaultValue
            maxLength={5}
            onChange={handleStoreNumberChange}
            onBlur={handleStoreNumberFocus}
            placeholder="Store Number"
          />
      }
      <label className="text__input__label">
        <h2>Name</h2>
      </label>
      <input 
        type="text"
        className="text__input"
        pattern="[a-zA-Z ]*"
        inputMode="text"
        value={installerName}
        onChange={handleInstallerNameChange}
        placeholder="First and Last"
        required={true}
      />
      <AccordionContainer />
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
                <p>{removeNumberAndDot(question.question)}</p>
              </div>
              {question.questionHints &&
                question.questionHints.length > 0 && (
                  <ol>
                    {question.questionHints.map((hint: any, hintIndex: number) => (
                      <li key={`hint_${hintIndex}`}>{hint.hint}</li>
                    ))}
                  </ol>
                )}
              <div className="file__upload">
                <div className="file__upload__content">
                  <div className="file__upload-top">
                    {imageSrc.length > 0 ? (
                      imageSrc.map((src, index) => (
                        <div key={`${questionId}_image_${index}`} className="image__preview__container">
                          <img
                            src={src}
                            alt="Uploaded"
                            className="image__preview"
                          />
                          <div key={`${questionId}_image_${index}`} className="image__preview-controls">
                            <button onClick={() => handleDeleteImage(questionId, src)}>
                              <IonIcon icon={trash} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="add__photo-button">
                        <button onClick={() => openCameraPage(qIndex)}>
                          <IonIcon icon={cameraOutline} className="add__photo-icon" />
                          <div className="add__photo__text">Capture photo</div>
                        </button>
                      </div>
                    )}
                  </div>
                  {imageSrc.length > 0 && (
                    <div className="file__upload-bottom file__upload-button">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          openCameraPage(qIndex);
                        }}
                      >
                        Capture Photo
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
