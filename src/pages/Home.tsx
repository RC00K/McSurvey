import { useState } from 'react';
import { IonButton, IonButtons, IonContent, IonHeader, IonPage, IonText, IonTitle, IonToolbar, IonIcon, IonSearchbar, IonAvatar, IonSegment, IonSegmentButton, IonLabel, IonItem, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle } from '@ionic/react';
import './Home.css';
import CardContainer from '../components/CardContainer';
import SurveyModal from '../components/modals/SurveyModal';
import mcsurveylogo from '../assets/images/logos/mcsurvey-logo.png';
import mcsurveylogo2 from '../assets/images/logos/mcsurvey-logo@2x.png';
import mcsurveylogo3 from '../assets/images/logos/mcsurvey-logo@3x.png';

const Home: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [driveThruSelection, setDriveThruSelection] = useState('1');

  const handleCardClick = () => {
    setShowModal(true);
  };

  return (
    <IonPage>
      <IonContent>
        <div className="home">
          <div className="home__content">
            <div className="home__body">
              <div className="home__body__title">
                <h3>Available Surveys</h3>
              </div>
              <div className="surveys">
                <CardContainer onCardClick={handleCardClick} />
                <CardContainer onCardClick={handleCardClick} />
                <CardContainer onCardClick={handleCardClick} />
                <CardContainer onCardClick={handleCardClick} />
                <CardContainer onCardClick={handleCardClick} />
                <CardContainer onCardClick={handleCardClick} />
                <CardContainer onCardClick={handleCardClick} />
                <CardContainer onCardClick={handleCardClick} />
              </div>
            </div>
          </div>
        </div>
        <SurveyModal showModal={showModal} setShowModal={setShowModal} setDriveThruSelection={setDriveThruSelection} />
      </IonContent>
    </IonPage>
  );
};

export default Home;
