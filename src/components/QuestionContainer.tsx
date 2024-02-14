import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useForm, SubmitHandler } from 'react-hook-form';
import { IonIcon, IonLabel, IonButton } from '@ionic/react';
import { AccordionContainer } from './AccordionContainer';
import { oneDrive, twoDrive } from '../assets/data/aotsfees';
import CameraComponent from './Camera/CameraComponent';
import { add } from 'ionicons/icons';
import './QuestionContainer.css';
import { useReview } from './Review/ReviewContext';

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
        const storedImages = JSON.parse(localStorage.getItem('reviewImages') || '{}');
        Object.entries(storedImages).forEach(([questionId, image]) => {
            addImage(questionId, image as string);
        });
    }, [addImage]);

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

    };

    const handleGoToReview = () => {
        history.push('/review');
    };
    
    return (
        <>
            {isCameraActive ? (
                <CameraComponent 
                    isCameraActive={isCameraActive}
                    key={cameraKey}
                    handleCloseCamera={handleCloseCamera}
                    onImageSave={handleImageSave}
                />
            ) : (
                selectedDriveThru.map((item, index) => {
                    return item.questions.map((question, qIndex) => {
                        const questionId = `question_${qIndex}`;
                        const imageSrc = selectedImages[questionId] || images[questionId];
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
                                        <div className="file__upload" onClick={() => handleOpenCamera(qIndex)}>
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
                }
            ))}
            <IonButton expand="block" color="dark" onClick={handleGoToReview}>
                Continue to Review
            </IonButton>
        </>
    );
}
