import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { IonModal, IonToolbar, IonTitle, IonButton, IonIcon } from '@ionic/react';
import { car } from 'ionicons/icons';
import './SurveyModal.css';

const SurveyModal = ({ showModal, setShowModal, setDriveThruSelection }: { showModal: boolean, setShowModal: (value: boolean) => void, setDriveThruSelection: (value: string) => void }) => {
    const [selected, setSelected] = useState(0);
    const [isClosing, setIsClosing] = useState(false);
    const history = useHistory();

    const handleSelection = (value: number) => {
        setSelected(value);
        setDriveThruSelection(value === 0 ? '1' : '2');
    };

    const handleStartSurvey = () => {
        closeModal();
        history.push('/survey/' + selected);
    };

    const closeModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShowModal(false);
            setIsClosing(false); // Reset state for next opening
        }, 500); // Match this timeout to your CSS animation duration
    };

    // Effect to listen for showModal changes and reset isClosing state if needed
    useEffect(() => {
        if (showModal && isClosing) {
            setIsClosing(false);
        }
    }, [showModal]);

    return (
        <>
            <div className={`modal__container ${showModal ? (isClosing ? 'modal-closing' : '') : 'hidden'}`}>
                <div className="modal">
                    <div className="flex">
                        <button className="btn-close" onClick={closeModal}>X</button>
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
                <div className={`overlay ${showModal ? '' : 'hidden'}`} onClick={closeModal} />
            </div>
        </>
    );
}

export default SurveyModal;

