import { IonContent, IonPage, IonAlert, IonButtons, IonButton, IonIcon, IonHeader, IonToolbar, IonTitle, IonBackButton, IonGrid, IonRow, IonCol } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { QuestionContainer } from '../components/QuestionContainer';
import { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { ReviewProvider } from '../components/Review/ReviewContext';
import { useReview } from '../components/Review/ReviewContext';
import WarningModal from '../components/modals/WarningModal';
import './Survey.css';

const Survey: React.FC = () => {
    const { selected } = useParams<{ selected: string }>();
    const driveThruSelection = selected === '0' ? '1' : '2';
    const history = useHistory();
    const { reset, setDriveThruSelection } = useReview();
    const [isSurveyComplete, setIsSurveyComplete] = useState(false);
    const [readyForReview, setReadyForReview] = useState(false);
    const [showExitAlert, setShowExitAlert] = useState(false);

    useEffect(() => {
        // Set flag when the survey is started
        sessionStorage.setItem('inSurvey', 'true');
        // Set the drive thru selection
        setDriveThruSelection(driveThruSelection);
        // Reset the review state
        reset();

        const unblock = history.block((location, action) => {
            if (action === 'POP') {
                setShowExitAlert(true);
                return false;
            }
        });

        return () => {
            unblock();
        };

    }, [selected, setDriveThruSelection, reset, history]);

    const handleExitSurvey = () => {
        setShowExitAlert(true);
    };

    const handleReadyForReviewChange = (isReady: boolean) => {
        setReadyForReview(isReady);
    };

    const handleGoToReview = () => {
        history.push('/review');
    };

    return (
        <IonPage>
            {showExitAlert && (
                <WarningModal 
                    showModal={showExitAlert}
                    setShowModal={setShowExitAlert}
                />
            )}
            <IonContent fullscreen className="ion-padding-start ion-padding-end extra-padding ion-padding-bottom ion-margin-bottom">
                <QuestionContainer 
                    driveThruSelection={driveThruSelection}
                    onReadyForReviewChange={handleReadyForReviewChange}
                />
            </IonContent>
            <button type="button" className="floating__button" onClick={handleGoToReview} disabled={!readyForReview}>
                Continue to Review
            </button>
        </IonPage>
    );
}

export default Survey;