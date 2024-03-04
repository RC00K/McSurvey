import { useState } from 'react';
import { IonButton, IonButtons, IonContent, IonHeader, IonPage, IonText, IonTitle, IonToolbar, IonIcon, IonSearchbar, IonAvatar, IonSegment, IonSegmentButton, IonLabel, IonItem, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle } from '@ionic/react';
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
    <>
      <div className="header">
        <h1>Dashboard</h1>
        <ul className="breadcrumb">
          <li>
            <a href="/analytics" className="active">
              Analytics
            </a>
          </li>
          /
          <li>
            <a href="/surveys">Surveys</a>
          </li>
        </ul>
      </div>
      <ul className="cards">
        <li>
          <CardContainer onCardClick={handleCardClick} />
        </li>
        <li>
          <CardContainer onCardClick={handleCardClick} />
        </li>
        <li>
          <CardContainer onCardClick={handleCardClick} />
        </li>
      </ul>
    </>
    // <IonPage>
    //   <IonContent fullscreen>
    //     <IonGrid className="ion-padding-start ion-padding-end extra-padding ion-padding-bottom ion-margin-bottom">
    //       <IonRow>
    //         <IonCol size="12">
    //           <IonText color="dark">
    //             <p className="title">Available Surveys</p>
    //           </IonText>
    //         </IonCol>
    //       </IonRow>
    //       <IonRow>
    //         <IonCol size="12">
    //           <CardContainer onCardClick={handleCardClick} />
    //         </IonCol>
    //       </IonRow>
    //     </IonGrid>
    //     <SurveyModal showModal={showModal} setShowModal={setShowModal} setDriveThruSelection={setDriveThruSelection} />
    //   </IonContent>
    // </IonPage>
  );
};

export default Home;
