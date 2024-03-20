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
    const { reset } = useReview();
    const { setDriveThruSelection } = useReview();

    const [isSurveyComplete, setIsSurveyComplete] = useState(false);

    useEffect(() => {
        setDriveThruSelection(driveThruSelection);
    }, [selected, setDriveThruSelection]);

    const handleExitSurvey = () => {
        setShowExitAlert(true);
    };

    useEffect(() => {
        // Set flag when the survey is started
        sessionStorage.setItem('inSurvey', 'true');
    }, []);

    useEffect(() => {
        reset();
    }, [reset]);

    const confirmExit = () => {
        // Set flag when the survey is ended
        sessionStorage.setItem('inSurvey', 'false');
        // Reset the review context
        reset();
        // Navigate back to home
        history.push('/');
    };

    // Popstate
    const handlePopstate = (event: PopStateEvent) => {
        console.log('Popstate event', event);
        // If the survey is in progress, show the alert
        if (sessionStorage.getItem('inSurvey') === 'true') {
            event.preventDefault();
            setShowExitAlert(true);
        };
    };

    useEffect(() => {
        window.addEventListener('popstate', handlePopstate);
        return () => {
            window.removeEventListener('popstate', handlePopstate);
        };
    }, [handlePopstate]);

    const handleGoToReview = () => {
        history.push('/review');
    };

    return (
        <IonPage>
            {showExitAlert && (
                <IonAlert
                    isOpen={showExitAlert}
                    onDidDismiss={() => setShowExitAlert(false)}
                    header={'Confirm Exit'}
                    message={'Are you sure you want to exit the survey? All progress will be lost.'}
                    buttons={[
                        {
                            text: 'Cancel',
                            role: 'cancel',
                            handler: () => {
                                setShowExitAlert(false);
                            }
                        },
                        {
                            text: 'Exit',
                            cssClass: 'secondary',
                            handler: () => {
                                confirmExit();
                            }
                        }
                    ]}
                />
            )}
            <IonContent fullscreen className="ion-padding-start ion-padding-end extra-padding ion-padding-bottom ion-margin-bottom">
                <QuestionContainer 
                    driveThruSelection={driveThruSelection}
                    isSurveyComplete={isSurveyComplete}
                    setIsSurveyComplete={setIsSurveyComplete}
                />
            </IonContent>
            <button className="floating__button" onClick={handleGoToReview} disabled={isSurveyComplete}>
                Continue to Review
            </button>
        </IonPage>
    );
}

export default Survey;