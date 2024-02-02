import { IonHeader, IonCard, IonImg, IonIcon, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { timeOutline, listOutline } from 'ionicons/icons';
import mcdrive from '../assets/images/mcdrive.jpg'

const surveys = [
    {
        img: mcdrive,
        surveyTitle: 'Drive Thru Survey',
        surveyDesc: 'This survey is for the drive thru',
        surveyCompletionTime: '5 minutes',
        surveyQuestions: 5
    }
];

export const CardContainer = () => {
    return (
        <>
            {surveys.map(({ img, surveyTitle, surveyDesc, surveyCompletionTime, surveyQuestions }, index) => (
                <IonCard key={index} onClick={() => console.log('Card clicked')}>
                    <IonImg src={img} />
                    <IonCardHeader>
                        <IonCardTitle>{surveyTitle}</IonCardTitle>
                        <IonCardSubtitle>{surveyDesc}</IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonText>
                            <IonIcon icon={listOutline} /> {surveyQuestions}
                        </IonText>
                        <IonText>
                            <IonIcon icon={timeOutline} /> {surveyCompletionTime}
                        </IonText>
                    </IonCardContent>
                </IonCard>
            ))}
        </>
    );
}