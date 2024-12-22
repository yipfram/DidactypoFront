import style from './Modal.module.css';

const Modal = ({ show, onClose, children }) => {
  if (!show) return null; // N'affiche rien si `show` est false

  return (
    <div className={style.modalOverlay}>
      <div className={style.modalContent}>
        <button className={style.modalCloseBtn} onClick={onClose}>
            &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
