import style from "../style/Apprendre.module.css";

export default function Apprendre() {
  return (
    <>
      <main className={style.apprendre}>
        <div className={style.texteapprendre}>
          <p>Bienvenue dans le mode apprentissage, <br/>
            ici vous pourrez vous améliorer sur votre clavier en suivant nos cours <br/>
            et en faisant des exercices pour vous entrainer.</p>
        </div>
        <div className={style.choixboutons}>
          <button>Cours</button>
          <button>Exercices</button>
        </div>
      </main>
    </>
  );
}