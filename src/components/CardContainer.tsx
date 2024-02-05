import { IonHeader, IonItem, IonChip, IonCard, IonImg, IonIcon, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonText, IonTitle, IonToolbar, IonBadge, IonLabel } from '@ionic/react';
import { timeOutline, listOutline, fastFood } from 'ionicons/icons';
import mcdrive from '../assets/images/mcdrive.jpg'

const surveys = [
    {
        img: mcdrive,
        surveyTitle: 'Drive Thru Survey',
        surveyCategory: 'Drive Thru',
        surveyCompletionTime: '5 minutes',
        surveyQuestions: '5 questions'
    }
];

const CardContainer = ({ onCardClick }: { onCardClick: any }) => {
    return (
        <>
            {surveys.map(({ img, surveyTitle, surveyCategory, surveyCompletionTime, surveyQuestions }, index) => (
                <IonCard key={index} onClick={onCardClick} className="card__container">
                    <IonImg src={img} className="card__image" />
                    <IonCardHeader>
                        <div className="card__header">
                            <IonCardTitle>{surveyTitle}</IonCardTitle>
                            <div className="card__time">
                                <IonText>{surveyCompletionTime}</IonText>
                            </div>
                        </div>
                    </IonCardHeader>
                    <IonCardContent>
                        <div className="card__content">
                            <IonIcon icon={fastFood} />
                            <IonText>{surveyCategory}</IonText>
                            <IonIcon icon={listOutline} />
                            <IonText>{surveyQuestions}</IonText>
                        </div>
                    </IonCardContent>
                </IonCard>
            ))}
        </>
    );
}

export default CardContainer;