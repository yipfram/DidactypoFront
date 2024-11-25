import style from "../style/MaClasse.module.css";
import ListeEleve from "../elements/ListeEleve";
import icone from "../img/IconCompte.png";

export default function MaClasse() {
  return (
    <>
      <main className={style.pageClasse}>
        <div className={style.classegauche}>
          <div className={style.classe}>
            <h2> Informations de la classe :</h2>
          </div>
          <button className={style.btnajouter}>
            Ajouter un élève
          </button>
        </div>
        <ListeEleve/>
      </main>
    </>
  );
}