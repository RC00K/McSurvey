import React from 'react';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { alertOutline } from 'ionicons/icons';
import './NotFound.css';

const NotFound: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonContent>
        <div className="notfound">
          <div className="error__title">
            Page not found
          </div>
          <div className="notfound__content">
            {/* 4 on left side of icon */}
            <div className="error__background error__icon">
              <IonIcon icon={alertOutline} />
            </div>
            {/* 4 in right side of icon  */}
          </div>
          <button className="error__button" onClick={() => history.push('/')}>
            Return to home
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default NotFound;
