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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <IonCardTitle>{surveyTitle}</IonCardTitle>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <IonText style={{ fontSize: '18px', fontWeight: '600' }}>{surveyCompletionTime}</IonText>
                            </div>
                        </div>
                    </IonCardHeader>
                    <IonCardContent>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <IonIcon icon={fastFood} aria-hidden="true" style={{ fontSize: '20px', marginRight: '5px' }} />
                            <IonText style={{ fontSize: '14px', marginRight: '10px' }}>{surveyCategory}</IonText>
                            <IonIcon icon={listOutline} aria-hidden="true" style={{ fontSize: '20px', marginRight: '5px' }} />
                            <IonText style={{ fontSize: '14px', marginRight: '10px' }}>{surveyQuestions}</IonText>
                        </div>
                    </IonCardContent>
                </IonCard>
            ))}
        </>
    );
}

export default CardContainer;