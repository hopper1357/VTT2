import React from 'react';
import ReactDOM from 'react-dom';

// Get the modal root element from the DOM
const modalRoot = document.getElementById('modal-root');

const Modal = ({ isOpen, onClose, children }) => {
  // Don't render anything if the modal is not open
  if (!isOpen) {
    return null;
  }

  // Close the modal if the overlay (the background) is clicked, but not the content inside.
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Use ReactDOM.createPortal to render the modal into the 'modal-root' div
  return ReactDOM.createPortal(
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.content}>
        <button style={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>,
    modalRoot
  );
};

// Basic styling for the modal
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    position: 'relative',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px',
    minWidth: '500px',
    maxWidth: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '15px',
    background: 'transparent',
    border: 'none',
    fontSize: '1.8rem',
    lineHeight: '1',
    cursor: 'pointer',
    padding: 0,
  },
};

export default Modal;
