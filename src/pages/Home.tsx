import { useState } from 'react';
import { IonButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon, IonSearchbar, IonAvatar, IonSegment, IonSegmentButton, IonLabel, IonItem, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle } from '@ionic/react';
import './Home.css';
import CardContainer from '../components/CardContainer';
import SurveyModal from '../components/modals/SurveyModal';

const Home: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [driveThruSelection, setDriveThruSelection] = useState('1');

  const handleCardClick = () => {
    setShowModal(true);
  };

  return (
    <IonPage>
      <IonContent fullscreen={true} className="ion-padding">
        <h1>Available Surveys</h1>
        <CardContainer onCardClick={handleCardClick} />
        <SurveyModal showModal={showModal} setShowModal={setShowModal} setDriveThruSelection={setDriveThruSelection} />
      </IonContent>
    </IonPage>
  );
};

export default Home;
