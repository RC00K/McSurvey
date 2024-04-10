import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import './SurveyModal.css';

const WarningModal = ({ showModal, setShowModal }: { showModal: boolean, setShowModal: (value: boolean) => void }) => {
    const [isClosing, setIsClosing] = useState(false);
    const history = useHistory();

    const handleEndSurvey = () => {
        setShowModal(false);
        history.push('/');
    };

    const closeModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShowModal(false);
            setIsClosing(false);
        }, 300);
    };

    useEffect(() => {
        if (showModal && isClosing) {
            setIsClosing(false);
        }
    }, [showModal]);

    return (
        <>
            <div className={`modal ${showModal ? (isClosing ? 'modal__closing' : '') : 'hidden'}`}>
                <div>
                    <h3>
                        
                    </h3>
                </div>
                <div className="block">
                    <div className="modal__body">
                        <p className="modal__body__text">
                            Are you sure you want to end the survey? 
                            <span>
                                This will clear all progress and cannot be undone.
                            </span>
                            You will be redirected to the home page.
                        </p>
                    </div>
                </div>
                <button className="btn" onClick={handleEndSurvey}>End</button>
                <button className="btn" onClick={closeModal}>Continue</button>
            </div>
            <div className={`overlay ${showModal ? '' : 'hidden'}`} onClick={closeModal} />
        </>
    );
}

export default WarningModal;