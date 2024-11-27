import InterfaceSaisie from '../elements/InterfaceSaisie.jsx';
import Leaderboard from "../elements/Defis.jsx";
import style from '../style/Competition.module.css';

export default function Competition() {
  return (
    <main className={style.Competition}>
      <h1>Competition</h1>
        <div>
          <div className={style.InterfaceSaisie}>
            <InterfaceSaisie />
          </div>
          <div className={style.leaderboard}>
              <Leaderboard/>
          </div>
        </div>
    </main>
  );
}