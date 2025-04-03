import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { api, getPseudo } from "../api";

import style from "../style/Connexion.module.css";

export default function Sinscrire() {
  const [utilisateurs, setUtilisateurs] = useState([]); // Initialisation avec un tableau vide
  const [pseudo, setPseudo] = useState("");

  const [formData, setFormData] = useState({
    pseudo: "",
    mot_de_passe: "",
    nom: "",
    prenom: "",
    courriel: "",
    est_admin: false,
    cptDefi: 0,
    numCours: 0,
    tempsTotal: 0,
  });

  const navigate = useNavigate();

  // Fonction pour récupérer les utilisateurs via l'API
  const fetchUtilisateurs = async () => {
    try {
      const reponse = await api.get("/utilisateurs/");
      console.log("Données reçues de l&apos;API :", reponse.data);
      const data = Array.isArray(reponse.data) ? reponse.data : reponse.data.utilisateurs || [];
      setUtilisateurs(data); // S'assurer que la donnée est un tableau
    } catch (erreur) {
      console.error("Erreur lors de la récupération des utilisateurs :", erreur);
      setUtilisateurs([]); // En cas d'erreur, garder utilisateurs comme un tableau vide
    }
  };

  // Chargement initial des utilisateurs
  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  useEffect(() => {
    setPseudo(getPseudo());
  }, [utilisateurs]);

  // Gestion des changements dans le formulaire
  const handleInputChange = (evenement) => {
    const valeur = evenement.target.value;
    setFormData({
      ...formData,
      [evenement.target.name]: valeur,
    });
  };

  // Gestion de la soumission du formulaire
  const handleFormSubmit = async (evenement) => {
    evenement.preventDefault();

    // Vérification que "utilisateurs" est bien un tableau
    if (!Array.isArray(utilisateurs)) {
      console.error("Les utilisateurs ne sont pas un tableau :", utilisateurs);
      alert("Une erreur est survenue. Veuillez réessayer plus tard.");
      return;
    }

    // Vérification si le pseudo existe déjà
    const pseudoExiste = utilisateurs.some(
      (utilisateur) => utilisateur.pseudo === formData.pseudo
    );
    if (pseudoExiste) {
      alert("Ce pseudo est déjà pris. Veuillez en choisir un autre.");
      return;
    }

    // Vérification si le courriel existe déjà
    const courrielExiste = utilisateurs.some(
      (utilisateur) => utilisateur.courriel === formData.courriel
    );
    if (courrielExiste) {
      alert("Ce courriel est déjà utilisé. Veuillez en choisir un autre.");
      return;
    }

    try {
      // Ajout de l'utilisateur via l'API
      await api.post("/utilisateurs/", formData);

      // Recharger la liste des utilisateurs
      fetchUtilisateurs();

      // Réinitialiser le formulaire
      setFormData({
        pseudo: "",
        mot_de_passe: "",
        nom: "",
        prenom: "",
        courriel: "",
        est_admin: false,
        cptDefi: 0,
        numCours: 0,
        tempsTotal: 0,
      });

      // Redirection vers la page de connexion
      navigate("/");
    } catch (erreur) {
      console.error("Erreur lors de l&apos;inscription :", erreur);
      alert("Une erreur est survenue lors de l&apos;inscription. Veuillez réessayer.");
    }
  };

  return (
    <div className={style.connexion}>
      <form onSubmit={handleFormSubmit}>
        <h1>S&apos;inscrire</h1>

        <label htmlFor="pseudo">Pseudo</label>
        <input
          type="text"
          id="pseudo"
          name="pseudo"
          value={formData.pseudo}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="mot_de_passe">Mot de passe</label>
        <input
          type="password"
          id="mot_de_passe"
          name="mot_de_passe"
          value={formData.mot_de_passe}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="nom">Nom</label>
        <input
          type="text"
          id="nom"
          name="nom"
          value={formData.nom}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="prenom">Prénom</label>
        <input
          type="text"
          id="prenom"
          name="prenom"
          value={formData.prenom}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="courriel">Courriel</label>
        <input
          type="email"
          id="courriel"
          name="courriel"
          value={formData.courriel}
          onChange={handleInputChange}
          required
        />

        <button type="submit">Inscription</button>
        <p>
          Déjà inscrit ? <Link to={`/profil/${pseudo}`}>Se connecter</Link>
        </p>
      </form>
    </div>
  );
}
