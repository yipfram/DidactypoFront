import style from '../style/InfosUtiles.module.css';

import enfantsSurOrdi from '../img/enfantsSurOrdinateur.webp'
import enfantDansNature from '../img/enfantDansNature.webp';

export default function InfosUtiles() {
  return (
    <main className={style.infos}>
      <h1>Didactypo : un bon didacticiel à la dactylographie</h1>
      <p>
      L&apos;objectif de notre site est de faciliter l&apos;apprentissage de la dactylographie aux
      jeunes de niveau scolaire primaire (du CP au CM2) , en leur offrant un site web
      gratuit et open-source leur permettant de suivre des cours, puis d&apos;avoir des exercices
      liés à ces cours afin d&apos;apprendre à écrire rapidement et efficacement sur un clavier.
      Les professeurs pourront créer des classes pour leurs élèves puis leur faire suivre
      des cours proposés directement sur le site.
      </p>
      <img src={enfantsSurOrdi} alt="Quatre enfants souriant sur leur ordinateur"/>
      <p>
        Notre but n&apos;est pas d&apos;inventer le concept de cours de dactylographie,
        mais plutôt de proposer une solution récente et francophone à nos jeunes.
      </p>
      <p>
        L&apos;URL du site sera distribuée gratuitement à des écoles primaires publiques,
        et ils auront ensuite l&apos;accès libre et illimité au site. Aucun bénéfice ne sera tiré du site.
      </p>
      <cite>
        Dans un monde où l&apos;informatique devient omniprésente, savoir taper sur le clavier
        d&apos;un ordinateur devient un outil essentiel pour s&apos;intégrer et réussir plus aisément.
      </cite>
      <img src={enfantDansNature} alt="Jeune garçon à lunette posé dans l&apos;herbe" />

      <h1>Mais que pouvez vous faire ?</h1>
      <p>
        Le site de Didactypo regorge de choses à faire, toutes ses fonctionalités peuvent donner le tourni.
        Voici un rapide appercu de chaque onglet et de son intérêt...
      </p>
      <h2>
        Apprendre
      </h2>
      <p>
        Ici tu retrouveras tout le nécéssaire pour devenir un didactypro. Tu y retrouveras des cours qui t&apos;expliqueront
        de manière ludique et pédagogique comment te servir de ton clavier. Même si tu sais déjà t&apos;en servir, je suis sûr
        que tu découvriras quelque chose de nouveau.
      </p>
      <p>
        Une fois que tu as suivi un cours, un exercice est proposé pour mettre en pratique ce que tu as vu dans ce cours.
        N&apos;hésite pas à les refaire plusieurs fois pour maitriser ton clavier.
      </p>
      <h2>
        Compétition
      </h2>
      <p>
        C&apos;est ici que les vraies choses se passent ! Chaque semaine, l&apos;équipe derrière Didactypo te propose un nouveau défi.
        Le but est d&apos;écrire le plus rapidement possible la phrase proposée. Plus tu es rapide, plus tu monte dans le classement.
        Si tu réalises le défi plusieurs jours d&apos;affilée, tu pourras même gagner des badges à afficher sur ton profil...
      </p>
      <h2>
        Ma classe
      </h2>
      <p>
        Ici tu as le choix de créer ou rejoindre une classe. Rejoindre une classe te permet de voir tes camarades et discuter avec eux.
        Plein de fonctionalités sont en chemin ! (fonctionalités d&apos;administrateur, création d&apos;exercices pour une classe, statistiques
        d&apos;une classe...)
      </p>
      <h2>
        Mon compte
      </h2>
      <p>
        Cet onglet regroupe toute tes informations de compte, tu peux changer ton mot de passe, ton nom d&apos;utilisateur, ton nom et ton prénom.
        Si tu veux pousser tes capacités un peu plus loin en analysant tes performances c&apos;est ici que ça se passe.
        Deux graphiques présentant ton évolution ainsi que tout tes badges te montreront touss le chemin que tu as parcouru...
      </p>
    </main>
  );
}