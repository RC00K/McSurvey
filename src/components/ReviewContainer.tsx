import React from 'react';
import { useReview } from '../components/Review/ReviewContext';
import { ReviewProvider } from '../components/Review/ReviewContext';
import { useParams, useHistory } from'react-router';
import { oneDrive, twoDrive } from '../assets/data/aotsfees';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonThumbnail, IonItem, IonLabel } from '@ionic/react';

export const ReviewContainer = ({}) => {
    const { driveThruSelection } = useReview();
    const selectedDriveThru = driveThruSelection === '1' ? oneDrive : twoDrive;
    const { images } = useReview();

    const storedImages = images || JSON.parse(localStorage.getItem('reviewImages') || '{}');
    
    return (
        <>
            {selectedDriveThru.map((item, index) => (
                item.questions.map((question, qIndex) => {
                    const questionId = `question_${qIndex}`;
                    const imageSrc = storedImages[questionId] || images[questionId];

                    if (imageSrc) {
                        return (
                            <IonCard key={questionId}>
                                <IonCardContent>
                                    <IonItem lines="none">
                                        <IonThumbnail slot="start">
                                            <img src={imageSrc} alt={`Captured image for ${question.questionTitle}`} />
                                        </IonThumbnail>
                                        <IonLabel>
                                            <h2>{question.questionTitle}</h2>
                                            <p>{question.questionDesc}</p>
                                        </IonLabel>
                                    </IonItem>
                                </IonCardContent>
                            </IonCard>
                        );
                    }
                    return null;
                })
            ))}
        </>
    );
};