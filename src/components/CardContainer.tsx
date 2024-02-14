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
                <IonCard key={index} onClick={onCardClick}>
                    <IonImg src={img} />
                    <IonCardHeader>
                        <IonCardTitle>{surveyTitle}</IonCardTitle>
                        <IonCardSubtitle>{surveyCompletionTime}</IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonIcon icon={fastFood} />
                        <IonText>{surveyCategory}</IonText>
                        <IonIcon icon={listOutline} />
                        <IonText>{surveyQuestions}</IonText>
                    </IonCardContent>
                </IonCard>
            ))}
        </>
    );
}

export default CardContainer;