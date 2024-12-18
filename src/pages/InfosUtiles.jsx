import style from '../style/InfosUtiles.module.css';

import enfantsSurOrdi from '../img/enfantsSurOrdinateur.webp'
import enfantDansNature from '../img/enfantDansNature.webp';

export default function InfosUtiles() {
  return (
    <main className={style.infos}>
      <h1>Didactypo : un bon didacticiel à la dactylographie</h1>
      <p>
      L'objectif de notre site est de faciliter l'apprentissage de la dactylographie aux
      jeunes de niveau scolaire primaire (du CP au CM2) , en leur offrant un site web
      gratuit et open-source leur permettant de suivre des cours, puis d'avoir des exercices
      liés à ces cours afin d'apprendre à écrire rapidement et efficacement sur un clavier.
      Les professeurs pourront créer des classes pour leurs élèves puis leur faire suivre
      des cours proposés directement sur le site.
      </p>
      <img src={enfantsSurOrdi} alt="Quatre enfants souriant sur leur ordinateur"/>
      <p>
        Notre but n'est pas d'inventer le concept de cours de dactylographie,
        mais plutôt de proposer une solution récente et francophone à nos jeunes.
      </p>
      <p>
        L'URL du site sera distribuée gratuitement à des écoles primaires publiques,
        et ils auront ensuite l'accès libre et illimité au site. Aucun bénéfice ne sera tiré du site.
      </p>
      <cite>
        Dans un monde où l'informatique devient omniprésente, savoir taper sur le clavier
        d'un ordinateur devient un outil essentiel pour s'intégrer et réussir plus aisément.
      </cite>
      <img src={enfantDansNature} alt="Jeune garçon à lunette posé dans l'herbe" />
    </main>
  );
}