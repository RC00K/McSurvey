import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useForm, SubmitHandler, set } from 'react-hook-form';
import { IonIcon, IonLabel, IonButton, IonAlert, IonInput, IonContent } from '@ionic/react';
import { AccordionContainer } from './AccordionContainer';
import { oneDrive, twoDrive } from '../assets/data/aotsfees';
import CameraContainer from './Camera/CameraContainer';
import { add } from 'ionicons/icons';
import './QuestionContainer.css';
import { useReview } from './Review/ReviewContext';
import { UserPhoto, usePhotoGallery } from '../hooks/usePhotoGallery';

interface FormData {
    question: string;
}

interface SelectedImages {
    [key: string]: string;
}

export const QuestionContainer = ({ driveThruSelection }: { driveThruSelection: string }) => {
    const selectedDriveThru = driveThruSelection === '1' ? oneDrive : twoDrive;
    const { register, handleSubmit } = useForm<FormData>();
    const [selectedImages, setSelectedImages] = useState<SelectedImages>({});
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [cameraKey, setCameraKey] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
    const [missingImageIndex, setMissingImageIndex] = useState<number | null>(null);
    const { storeNumber, setStoreNumber } = useReview();

    const history = useHistory();

    const { photos, takePhoto } = usePhotoGallery();
    const [activePhoto, setActivePhoto] = useState<UserPhoto | null>(null);

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
        takePhoto();
    };

    const handleImageSelect = (photo: UserPhoto) => {
        setActivePhoto(photo);
    };

    const handleCloseCamera = () => {
        setIsCameraActive(false);
        
    };

    const { images, addImage } = useReview();

    useEffect(() => {
        // Load images from local storage on component mount
        const storedImages = JSON.parse(localStorage.getItem('reviewImages') || '{}');
        const storedStoreNumber = sessionStorage.getItem('storeNumber') || '';
        Object.entries(storedImages).forEach(([questionId, image]) => {
            addImage(questionId, image as string);
        });
        setStoreNumber(storedStoreNumber);
    }, [addImage, setStoreNumber]);

    const handleImageSave = () => {
        if (currentQuestionIndex !== null && activePhoto) {
            const questionId = `question_${currentQuestionIndex}`;
            addImage(questionId, activePhoto.webviewPath || '');
            const updateImages = { ...images, [questionId]: activePhoto.webviewPath || '' };
            localStorage.setItem('reviewImages', JSON.stringify(updateImages));
            setSelectedImages(updateImages);
        }
        setIsCameraActive(false);
    };

    const onSubmit: SubmitHandler<FormData> = (data) => {

    };

    const handleGoToReview = () => {
        // Check for missing images
        const missingIndex = selectedDriveThru.findIndex(item => 
            item.questions.some((question, qIndex) => 
                !selectedImages[`question_${qIndex}`] && !images[`question_${qIndex}`]
            )   
        );

        if (missingIndex !== -1 ) {
            setMissingImageIndex(missingIndex);
        } else {
            history.push('/review');
        }
    };

    useEffect(() => {
        const handleBeforeUnload = () => {
            localStorage.setItem('reviewImages', JSON.stringify(selectedImages));
            sessionStorage.setItem('storeNumber', storeNumber);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [images, storeNumber]);
    
    return (
        <IonContent>
            <div className="question__container">
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
                        <form onSubmit={handleSubmit(onSubmit)} key={`form_${index}_${qIndex}`}>
                            <div key={`label_${index}_${qIndex}`}>
                                <IonLabel>
                                    <h2>{question.questionTitle}</h2>
                                    <p>{question.questionDesc}</p>
                                </IonLabel>
                                <div>
                                    <div key={`question_${index}`}>
                                        <p>{question.question}</p>
                                    </div>
                                    {question.questionHints && question.questionHints.length > 0 && (
                                        <ol>
                                            {question.questionHints.map((hint, hintIndex) => (
                                                <li key={`hint_${hintIndex}`}>
                                                    {hint.hint}
                                                </li>
                                            ))}
                                        </ol>
                                    )}
                                    <AccordionContainer question={question} />
                                    <div className={`file__upload ${isMissingImage ? 'missing__image' : ''}`} onClick={() => (activePhoto ? handleImageSave() : handleOpenCamera(qIndex))}>
                                        {activePhoto && (
                                            <img
                                                src={activePhoto.webviewPath || ''}
                                                alt="Uploaded"
                                                className="image__preview"
                                            />
                                        )}
                                        {!activePhoto && (
                                            <button className="add__photo">
                                                <IonIcon icon={add} size="large" />
                                            </button> 
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>
                    );
                })}
            )}
            <IonButton expand="block" color="dark" onClick={handleGoToReview}>
                Continue to Review
            </IonButton>
            </div>
        </IonContent>
    );
}