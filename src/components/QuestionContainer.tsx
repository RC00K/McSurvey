import { useState, useRef } from 'react';
import { useHistory } from 'react-router';
import { useForm, SubmitHandler, set } from 'react-hook-form';
import { IonHeader, IonToolbar, IonTitle, IonText, IonItem, IonIcon, IonRadioGroup, IonRadio, IonLabel, IonButton, IonModal, IonContent } from '@ionic/react';
import { AccordionContainer } from './AccordionContainer';
import { oneDrive, twoDrive } from '../assets/data/aotsfees';
import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from '@capacitor-community/camera-preview';
import CameraComponent from './Camera/CameraComponent';
import { add } from 'ionicons/icons';
import './QuestionContainer.css';

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

    const history = useHistory();

    const handleOpenCamera = () => {
        history.push('/camera');
        setIsCameraActive(true);
        // increment the camera key
        setCameraKey(prevKey => prevKey + 1);
    };

    const handleCloseCamera = () => {
        setIsCameraActive(false);
        history.goBack();
    };

    const onSubmit: SubmitHandler<FormData> = (data) => {
        console.log(data);
        // Handle form submission
    };

    return (
        <>
            {isCameraActive ? (
                <CameraComponent 
                    isCameraActive={isCameraActive}
                    key={cameraKey}
                    handleCloseCamera={handleCloseCamera}
                />
            ) : (
                selectedDriveThru.map((item, index) => {
                    return item.questions.map((question, qIndex) => (
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
                                    <div className="file__upload">
                                        {selectedImages['image_' + index + '_' + qIndex] ? (
                                            <img
                                                src={selectedImages['image_' + index + '_' + qIndex]}
                                                alt="Uploaded"
                                                className="image__preview"
                                            />
                                        ) : (
                                            <button className="add__photo" onClick={handleOpenCamera}>
                                                <IonIcon icon={add} size="large" />
                                            </button> 
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>
                    ))
                })
            )}
        </>
    );
}
