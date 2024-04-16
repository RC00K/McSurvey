import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { warning } from "ionicons/icons";
import "./custom-modals.css";
import { IonIcon } from "@ionic/react";
import { useReview } from "../../components/Review/ReviewContext";

const WarningModal = ({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}) => {
  const { reset } = useReview();
  const [isClosing, setIsClosing] = useState(false);
  const history = useHistory();

  const handleContinueSurvey = () => {
    closeModal();
  };

  const handleEndSurvey = () => {
    reset();
    closeModal(true);
  };

  const closeModal = (navigateHome = false) => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
      if (navigateHome) {
        history.push("/home");
      }
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
          <button className="btn" id="modal__btn" onClick={handleContinueSurvey}>
            Continue
          </button>
          <button className="warning__btn" id="modal__btn" onClick={handleEndSurvey}>
            End
          </button>
        </div>
      </div>
      <div
        className={`overlay ${showModal ? "" : "hidden"}`}
        onClick={handleContinueSurvey}
      />
    </>
  );
};

export default WarningModal;
