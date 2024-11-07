import PropTypes from "prop-types";
import FocusTrap from "focus-trap-react";
import "./Modal.css";

const Modal = ({ title, message, onClose, onConfirm }) => {
  const handleOverlayClick = (e) => {
    if (e.target.className === "modal-overlay") {
      onClose();
    }
  };

  return (
    <FocusTrap>
      <div
        className="modal-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={handleOverlayClick}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title" id="modal-title">
              {title}
            </h2>
            <button
              className="modal-close-button"
              onClick={onClose}
              aria-label="Close Modal"
            >
              &times;
            </button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            {onConfirm ? (
              <>
                <button
                  className="modal-close-btn confirmButton"
                  onClick={onConfirm}
                >
                  Confirm
                </button>
                <button
                  className="modal-close-btn cancelButton"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button className="modal-close-btn okButton" onClick={onClose}>
                OK
              </button>
            )}
          </div>
        </div>
      </div>
    </FocusTrap>
  );
};

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
};

export default Modal;
