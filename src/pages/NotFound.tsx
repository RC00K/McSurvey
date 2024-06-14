import React from 'react';
import { IonPage, IonContent, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const NotFound: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h2>404 - Page Not Found</h2>
        <IonButton onClick={() => history.push('/')}>Go to Home</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default NotFound;
