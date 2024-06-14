import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import "./custom-modals.css";

const DangerModal = ({
  showModal,
  setShowModal,
  handleEnd,
}: {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  handleEnd: () => void;
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isClosing, setIsClosing] = useState(false);
  const history = useHistory();

  useEffect(() => {
    window.addEventListener("resize", () => {
      setIsMobile(window.innerWidth < 768);
    });
  }, []);

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
            <h2>End Survey</h2>
          </div>
        </div>
        <div className="modal__article">
          <article>
            <p>
              You haven't finished the survey. Do you want to to leave
              without finishing? This will clear all progress and cannot be
              undone.
            </p>
          </article>
        </div>
        <div className="modal__footer">
          <div className="modal__footer-btns">
            <button className="primary__btn" onClick={closeModal}>
              Continue
            </button>
            <button className="danger__btn" onClick={handleEnd}>
              End
            </button>
          </div>
        </div>
      </div>
      <div
        className={`overlay ${showModal ? "" : "hidden"}`}
        onClick={closeModal}
      />
    </>
  );
};

export default DangerModal;
