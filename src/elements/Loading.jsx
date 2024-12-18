import style from '../style/Loading.module.css';

const Loading = () => {
  return (
    <div className={style.loadingContainer}>
      <div className={style.loadingCircle}><span>Didactypo</span></div>
      <p className={style.loadingText}>Chargement</p>
    </div>
  );
};

export default Loading;
