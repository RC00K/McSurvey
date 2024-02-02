import React, { useRef } from 'react';
import { IonButton, IonModal, IonHeader, IonContent, IonToolbar, IonTitle, IonPage } from '@ionic/react';
import './BottomSheet.css';

const BottomSheet: React.FC = () => {
    const modal = useRef<HTMLIonModalElement>(null);

    const onClose = () => {
        modal.current?.dismiss();
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>App</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonButton id="open-modal" expand="block">
                    Open Sheet Modal
                </IonButton>
                <IonModal ref={modal} trigger="open-modal" initialBreakpoint={1} breakpoints={[0, 1]}>
                    <div className="block">
                        <IonButton color="dark" onClick={onClose} expand="block">Start Survey</IonButton>
                    </div>
                </IonModal> 
            </IonContent>
        </IonPage>
    );
}

export default BottomSheet;