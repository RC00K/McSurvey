import {
    IonAccordion,
    IonAccordionGroup,
    IonItem,
    IonLabel,
    IonImg,
    IonIcon,
} from "@ionic/react";
import { checkmarkCircle, closeCircle} from "ionicons/icons";
import "./ToastNotification.css";
import { useState } from "react";

export const ToastSuccess = ({ message }: { message: string }) => {
    const [toastMessage, setToastMessage] = useState("");

    return (
        <figure className="notification">
            <div className="notification__body">
                <div className="notification__description">
                    <div className="icon__wrapper__success">
                        <IonIcon icon={checkmarkCircle} />
                    </div>
                    {message}
                </div>
            </div>
            <div className="notification__progress__success"></div>
        </figure>
    );
};

export const ToastError = ({ message }: { message: string }) => {
    const [toastMessage, setToastMessage] = useState("");

    return (
        <figure className="notification">
            <div className="notification__body">
                <div className="notification__description">
                    <div className="icon__wrapper__error">
                        <IonIcon icon={closeCircle} />
                    </div>
                    {message}
                </div>
            </div>
            <div className="notification__progress__error"></div>
        </figure>
    );
};