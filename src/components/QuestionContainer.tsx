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
import CameraContainer from "./Camera/CameraContainer";
import { add } from "ionicons/icons";
import "./QuestionContainer.css";
import { useReview } from "./Review/ReviewContext";
import { UserPhoto, usePhotoGallery } from "../hooks/usePhotoGallery";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import "../theme/floating-button.css";

interface FormData {
  question: string;
}

interface SelectedImages {
  [key: string]: string;
}

interface QuestionContainerProps {
  driveThruSelection: string;
  isSurveyComplete: boolean;
  setIsSurveyComplete: (isComplete: boolean) => void;
}

export const QuestionContainer = ({ driveThruSelection, isSurveyComplete, setIsSurveyComplete }: QuestionContainerProps) => {
    const selectedDriveThru = driveThruSelection === '1' ? oneDrive : twoDrive;
    const { register, handleSubmit, formState: { isValid } } = useForm<FormData>();
    const [selectedImages, setSelectedImages] = useState<SelectedImages>({});
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [cameraKey, setCameraKey] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
    const [missingImageIndex, setMissingImageIndex] = useState<number | null>(null);
    const { storeNumber, setStoreNumber } = useReview();

    const history = useHistory();

    useEffect(() => {
        // Check local storage for the image
        const storedImage = localStorage.getItem('capturedImage');
        if (storedImage && currentQuestionIndex !== null) {
            setSelectedImages(prevImages => ({
                ...prevImages, 
                [currentQuestionIndex]: storedImage,
            }));
            localStorage.removeItem('capturedImage');
        }
    }, [currentQuestionIndex]);
    const handleOpenCamera = (questionIndex: number) => {
        setCurrentQuestionIndex(questionIndex);
        setIsCameraActive(true);
        // increment the camera key
        setCameraKey(prevKey => prevKey + 1);
    };
    const handleCloseCamera = () => {
        setIsCameraActive(false);
        
    };

  const { images, addImage } = useReview();

  useEffect(() => {
    // Load images from local storage on component mount
    const storedImages = JSON.parse(
      localStorage.getItem("reviewImages") || "{}"
    );
    const storedStoreNumber = sessionStorage.getItem("storeNumber") || "";
    Object.entries(storedImages).forEach(([questionId, image]) => {
      addImage(questionId, image as string);
    });
    setStoreNumber(storedStoreNumber);
  }, [addImage, setStoreNumber]);

  const handleImageSave = (savedImage: string) => {
      if (currentQuestionIndex !== null) {
          const questionId = `question_${currentQuestionIndex}`;
          addImage(questionId, savedImage);
          const updateImages = { ...images, [questionId]: savedImage };
          localStorage.setItem('reviewImages', JSON.stringify(updateImages));
          setSelectedImages(updateImages);
      }
      setIsCameraActive(false);
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    setIsSurveyComplete(true);
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("reviewImages", JSON.stringify(selectedImages));
      sessionStorage.setItem("storeNumber", storeNumber);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [images, storeNumber]);

  return (
    <>
      {isCameraActive ? (
        <CameraContainer
          isCameraActive={isCameraActive}
          handleCloseCamera={handleCloseCamera}
          onImageCaptured={handleImageSave}
          onImageSave={handleImageSave}
        />
      ) : (
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
              const imageSrc = selectedImages[questionId] || images[questionId];
              const isMissingImage = missingImageIndex === index && !imageSrc;
              return (
                <form
                  onSubmit={handleSubmit(onSubmit)}
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
                      <div className={`file__upload ${isMissingImage ? 'missing__image' : ''}`} onClick={() => handleOpenCamera(qIndex)}>
                          {imageSrc && (
                              <img
                                  src={imageSrc}
                                  alt="Uploaded"
                                  className="image__preview"
                              />
                          )}
                          {!imageSrc && (
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
      )}
    </>
  );
};
