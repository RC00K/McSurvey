import { IonContent, IonPage, IonAlert, IonButtons, IonButton, IonIcon, IonHeader, IonToolbar, IonTitle, IonBackButton, IonGrid, IonRow, IonCol } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { QuestionContainer } from '../components/QuestionContainer';
import { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';
import { ReviewProvider } from '../components/Review/ReviewContext';
import { useReview } from '../components/Review/ReviewContext';
import './Survey.css';

const Survey: React.FC = () => {
    const { selected } = useParams<{ selected: string }>();
    const driveThruSelection = selected === '0' ? '1' : '2';
    const [showExitAlert, setShowExitAlert] = useState(false);
    const history = useHistory();

    const { setDriveThruSelection } = useReview();

    useEffect(() => {
        setDriveThruSelection(driveThruSelection);
    }, [selected, setDriveThruSelection]);

    const handleExitSurvey = () => {
        setShowExitAlert(true);
    };

    const confirmExit = () => {
        // Clear local storage
        localStorage.clear();
        // Navigate back to home
        history.push('/');
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton color="dark" onClick={handleExitSurvey}>
                            <IonIcon color="dark" icon={arrowBack} />
                        </IonButton>
                        <IonAlert
                            isOpen={showExitAlert}
                            onDidDismiss={() => setShowExitAlert(false)}
                            header={'Confirm Exit'}
                            message={'Are you sure you want to exit the survey? All progress will be lost.'}
                            buttons={[
                                {
                                    text: 'Cancel',
                                    role: 'cancel',
                                    handler: () => setShowExitAlert(false)
                                },
                                {
                                    text: 'Exit',
                                    handler: confirmExit
                                }
                            ]}
                        />
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonGrid className="ion-padding-start ion-padding-end extra-padding ion-padding-bottom ion-margin-bottom">
                    <IonRow>
                        <IonCol size="12">
                            <QuestionContainer 
                                driveThruSelection={driveThruSelection}
                            />
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
}

export default Survey;