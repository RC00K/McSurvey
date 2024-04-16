import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { warning } from "ionicons/icons";
import "./custom-modals.css";
import { IonIcon } from "@ionic/react";

const WarningModal = ({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const history = useHistory();

  const handleEndSurvey = () => {
    setShowModal(false);
    history.push("/");
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
      <div
        className={`modal ${
          showModal ? (isClosing ? "modal__closing" : "") : "hidden"
        }`}
      >
        <div className="modal__header">
          <IonIcon className="modal__warning__icon" icon={warning} />
          <h3>End survey</h3>
        </div>
        <div className="block">
          <div className="modal__body">
            <p>
              You haven't finished the survey. Do you want to to leave without
              finishing? This will clear all progress and cannot be undone.
            </p>
          </div>
        </div>
        <div className="modal__footer">
          <button className="btn" id="modal__btn" onClick={closeModal}>
            Continue
          </button>
          <button className="warning__btn" id="modal__btn" onClick={handleEndSurvey}>
            End
          </button>
        </div>
      </div>
      <div
        className={`overlay ${showModal ? "" : "hidden"}`}
        onClick={closeModal}
      />
    </>
  );
};

export default WarningModal;
