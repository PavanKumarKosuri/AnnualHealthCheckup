import PropTypes from "prop-types";
import styles from "./PaymentModal.module.css";

const PaymentModal = ({
  isOpen,
  onClose,
  serviceType = "Service",
  dependentsCount = 0,
  pricePerDependent = 0,
  basePrice = 0,
  totalAmount,
  dependentsDetails = [],
  onProceedToPay,
  paymentError,
  onRetry,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            {paymentError ? "Payment Error" : "Booking Details"}
          </h3>
          <button className={styles.modalCloseButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>
          {paymentError ? (
            <p className={styles.errorText}>{paymentError}</p>
          ) : (
            <>
              <p>
                <strong>Service Type:</strong> {serviceType} Booking
              </p>
              <p>
                <strong>Base Price:</strong> ₹{basePrice}
              </p>

              {dependentsDetails.length > 0 && (
                <>
                  <p>
                    <strong>Dependents:</strong>
                  </p>
                  <ul>
                    {dependentsDetails.map((dep, index) => (
                      <li key={index}>
                        {dep.name} ({dep.relation}), Age: {dep.age}, Gender:{" "}
                        {dep.gender}
                      </li>
                    ))}
                  </ul>
                  <p>
                    <strong>Number of Dependents:</strong> {dependentsCount}
                  </p>
                  <p>
                    <strong>Price per Dependent:</strong> ₹{pricePerDependent}
                  </p>
                </>
              )}
              <p>
                <strong>Total Amount:</strong> ₹{totalAmount}
              </p>
            </>
          )}
        </div>
        <div className={styles.modalFooter}>
          {paymentError ? (
            <>
              <button className={styles.modalCloseBtn} onClick={onClose}>
                Cancel
              </button>
              <button className={styles.modalConfirmBtn} onClick={onRetry}>
                Retry Payment
              </button>
            </>
          ) : (
            <>
              <button className={styles.modalCloseBtn} onClick={onClose}>
                Cancel
              </button>
              <button
                className={styles.modalConfirmBtn}
                onClick={onProceedToPay}
              >
                Confirm and Pay
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

PaymentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  serviceType: PropTypes.string,
  dependentsCount: PropTypes.number,
  pricePerDependent: PropTypes.number,
  basePrice: PropTypes.number,
  totalAmount: PropTypes.number.isRequired,
  dependentsDetails: PropTypes.arrayOf(PropTypes.object),
  onProceedToPay: PropTypes.func.isRequired,
  paymentError: PropTypes.string,
  onRetry: PropTypes.func,
};

export default PaymentModal;
