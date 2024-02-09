import React from 'react';
import { IonPage, IonContent, IonButton, IonIcon, IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import { pencil, close } from 'ionicons/icons';
import './ReviewContainer.css';
import dtep1 from '../assets/images/DTEP1.jpg';

const ReviewContainer: React.FC = () => {
    return (
        <>
            <h1>Review Page</h1>
            <div className="review__card">
                <div className="review__card__content">
                    <img className="review__card__image" src={dtep1} alt="Review Image" />
                    <div className="review__card__info">
                        <div className="review__card__title">Entry Point</div>
                        <div className="review__card__desc">Type: Drive Thru</div>
                        <div className="review__card__image__id">Image: DTEP-1894-0053</div>
                    </div>
                    <button className="review__card__button">
                        <IonIcon icon={pencil} />
                    </button>
                </div>
            </div>
        </>
    );
};

export default ReviewContainer;