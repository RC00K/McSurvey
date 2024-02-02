import { IonContent, IonHeader, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { car } from 'ionicons/icons';

const data = [
    {
        id: 1,
        optionIcon: car,
        optionTitle: "1 Drive Thur"
    }
];

export const ModalBody = ({ dismiss } : { dismiss: () => void }) => {
    <IonContent>
        <IonHeader>
            <IonHeader translucent={true}>
                AOT Greens Fees
            </IonHeader>
        </IonHeader>

        {data.map(option => (
            <IonItem>
                <IonIcon icon={option.optionIcon} slot="icon-only" />
                <IonLabel>
                    {option.optionTitle}
                </IonLabel>
            </IonItem>
        ))}
    </IonContent>
};