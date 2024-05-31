import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { IonIcon } from "@ionic/react";
import { car } from "ionicons/icons";
import "./custom-modals.css";

const SurveyModal = ({
  showModal,
  setShowModal,
  setDriveThruSelection,
}: {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  setDriveThruSelection: (value: string) => void;
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selected, setSelected] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const history = useHistory();

  useEffect(() => {
    window.addEventListener("resize", () => {
      setIsMobile(window.innerWidth < 768);
    });
  }, []);

  const handleSelection = (value: number) => {
    setSelected(value);
    setDriveThruSelection(value === 0 ? "1" : "2");
  };

  const handleStartSurvey = () => {
    closeModal();
    history.push("mcsurvey.netlify.app/survey/" + selected);
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
      <div
        className={`modal__container ${
          showModal ? (isClosing ? "modal-closing" : "") : "hidden"
        } ${isMobile ? "mobile" : ""}`}
      >
        <div className="modal__header">
          <div className="modal__header-top">
            <h2>Drive Thur Options</h2>
            <button className="close__btn" onClick={closeModal}>
              X
            </button>
          </div>
          <div className="modal__header-bottom">
            <h3>
              How many drive thrus are at your location?
            </h3>
          </div>
        </div>
        <div className="modal__body">
          <div className="modal__options">
            <button
              className={`modal__option ${selected === 0 ? "selected" : ""}`}
              onClick={() => handleSelection(0)}
            >
              <IonIcon icon={car} size="large" />
              <span>1 Drive Thru</span>
            </button>
            <button
              className={`modal__option ${selected === 1 ? "selected" : ""}`}
              onClick={() => handleSelection(1)}
            >
              <IonIcon icon={car} size="large" />
              <span>2 Drive Thrus</span>
            </button>
          </div>
        </div>
        <div className="modal__footer">
          <button className="primary__btn" onClick={handleStartSurvey}>
            Start Survey
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

export default SurveyModal;