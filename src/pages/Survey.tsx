import { IonContent, IonPage, IonAlert, IonButtons, IonButton, IonIcon, IonHeader, IonToolbar, IonTitle, IonBackButton } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { QuestionContainer } from '../components/QuestionContainer';
import { useEffect } from 'react';
import { useParams, useHistory } from 'react-router';
import { ReviewProvider } from '../components/Review/ReviewContext';
import { useReview } from '../components/Review/ReviewContext';

const Survey: React.FC = () => {
    const { selected } = useParams<{ selected: string }>();
    const driveThruSelection = selected === '0' ? '1' : '2';
    const history = useHistory();

    const { setDriveThruSelection } = useReview();

    useEffect(() => {
        setDriveThruSelection(driveThruSelection);
    }, [selected, setDriveThruSelection]);

    return (
        <IonPage>
            <IonContent className="ion-padding">
                <QuestionContainer driveThruSelection={driveThruSelection} />
            </IonContent>
        </IonPage>
    );
}

export default Survey;