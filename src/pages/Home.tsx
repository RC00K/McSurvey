import { IonButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon, IonSearchbar, IonAvatar, IonSegment, IonSegmentButton, IonLabel, IonItem, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle } from '@ionic/react';
import { personCircle, notifications } from 'ionicons/icons';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import BottomSheet from '../components/modals/BottomSheet';
import { QuestionContainer } from '../components/QuestionContainer';
import { CardContainer } from '../components/CardContainer';

const Home: React.FC = () => {
  return (
    // <IonPage>
    //   <IonHeader translucent={false}>
    //     <IonToolbar>
    //       <IonTitle>McSurvey</IonTitle>
    //       <IonButtons slot="start">
    //         <IonButton href="/explore">
    //           <IonAvatar>
    //             <img alt="Silhouette of person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
    //           </IonAvatar>
    //         </IonButton>
    //       </IonButtons>
    //       <IonButtons slot="end">
    //         <IonButton>
    //           <IonIcon icon={notifications} />
    //         </IonButton>
    //       </IonButtons>
    //     </IonToolbar>
    //   </IonHeader>
    //   <IonContent className="ion-padding">
    //     <IonHeader>
    //       <IonSegment slot="fixed" value="all">
    //         <IonSegmentButton value="all">
    //           <IonLabel>All</IonLabel>
    //         </IonSegmentButton>
    //         <IonSegmentButton value="incomplete">
    //           <IonLabel>Incomplete</IonLabel>
    //         </IonSegmentButton>
    //         <IonSegmentButton value="submitted">
    //           <IonLabel>Submitted</IonLabel>
    //         </IonSegmentButton>
    //       </IonSegment>
    //     </IonHeader>

    //     <IonItem>
    //       <IonLabel>
    //         <h2>Surveys</h2>
    //       </IonLabel>
    //     </IonItem>
    //     <IonGrid fixed={true}>
    //         <IonRow>
    //           <IonCol>
    //             <IonCard>
    //               <IonCardHeader>
    //                 <IonCardTitle>Card Title</IonCardTitle>
    //                 <IonCardSubtitle>Card Subtitle</IonCardSubtitle>
    //               </IonCardHeader>
    //               <IonCardContent>Here's a small text description for the card. Nothing more, nothing less.</IonCardContent>
    //               <IonButton fill="outline">Take Survey</IonButton>
    //             </IonCard>
    //           </IonCol>
    //         </IonRow>
    //       </IonGrid>
    //   </IonContent>
    // </IonPage>
    <IonPage>
      <IonContent className="ion-padding">
          <IonToolbar>
              <IonTitle>Available Surveys</IonTitle>
          </IonToolbar>
        <CardContainer />
      </IonContent>
    </IonPage>
  );
};

export default Home;
