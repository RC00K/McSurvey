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
      <section>
        <div className="home__header">
          <h1>McSurvey</h1>
        </div>
        <div className="home__body">
          <div className="home__content">
            <div className="container">
              <div className="container__title">
                <h3>Available Surveys</h3>
              </div>
              <div className="grid">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <CardContainer onCardClick={handleCardClick} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <SurveyModal showModal={showModal} setShowModal={setShowModal} setDriveThruSelection={setDriveThruSelection} />
      </section>
    </>
    // <IonPage>
    //   <IonHeader>
    //     <IonToolbar>
    //       <IonTitle>McSurvey</IonTitle>
    //     </IonToolbar>
    //   </IonHeader>
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
