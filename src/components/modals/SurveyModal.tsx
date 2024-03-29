import { useState } from 'react';
import { useHistory } from 'react-router';
import { IonModal, IonToolbar, IonTitle, IonButton, IonIcon } from '@ionic/react';
import { car } from 'ionicons/icons';
import './SurveyModal.css';

const SurveyModal = ({ showModal, setShowModal, setDriveThruSelection }: { showModal: boolean, setShowModal: (value: boolean) => void, setDriveThruSelection: (value: string) => void }) => {
    const [selected, setSelected] = useState(0);
    const history = useHistory();

    const handleSelection = (value: number) => {
        setSelected(value);
        setDriveThruSelection(value === 0 ? '1' : '2');
    };

    const handleStartSurvey = () => {
        setShowModal(false);
        history.push('/survey/' + selected);
    };
    
    return (
        <>
            <div className={`modal__container ${showModal ? '' : 'hidden'}`}>
                <div className="modal">
                    <div className="flex">
                        <button className="btn-close" onClick={() => setShowModal(false)}>X</button>
                    </div>
                    <div>
                        <h3>
                            Drive Thur Options
                        </h3>
                        <p>
                            Select the number of drive thrus you would like to use in your survey.
                        </p>
                    </div>
                    <div className="block">
                        <div className="modal__body">
                            <div className="modal__body__options">
                                <button className={`modal__body__option ${selected === 0 ? 'selected' : ''}`} onClick={() => handleSelection(0)}>
                                    <div className={`modal__body__option__text ${selected === 0 ? 'selected' : ''}`} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                        <IonIcon icon={car} size="large" />
                                        <span>1 Drive Thru</span>
                                    </div>
                                </button>
                                <button className={`modal__body__option ${selected === 1 ? 'selected' : ''}`} onClick={() => handleSelection(1)}>
                                    <div className={`modal__body__option__text ${selected === 1 ? 'selected' : ''}`} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                        <IonIcon icon={car} size="large" />
                                        <span>2 Drive Thrus</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                    <button className="btn" onClick={handleStartSurvey}>Start Survey</button>
                </div>
                <div className={`overlay ${showModal ? '' : 'hidden'}`} onClick={() => setShowModal(false)} />
            </div>
        </>
    );
}

export default SurveyModal;