import { IonContent, IonPage, IonButton } from '@ionic/react';
import { QuestionContainer } from '../components/QuestionContainer';
import { useParams, useHistory } from 'react-router';

const Survey: React.FC = () => {
    const { selected } = useParams<{ selected: string }>();
    const driveThruSelection = selected === '0' ? '1' : '2';
    const history = useHistory();

    return (
        <IonPage>
            <IonContent className="ion-padding">
                <QuestionContainer driveThruSelection={driveThruSelection} />
            </IonContent>
        </IonPage>
    );
}

export default Survey;