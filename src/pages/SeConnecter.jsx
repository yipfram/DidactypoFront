import { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function SeConnecter() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [formData, setFormData] = useState({
    pseudo: "",
    mot_de_passe: "",
    nom: "",
    prenom: "",
    courriel: "",
    est_admin: false,
    moyMotsParMinute: 0,
    numCours: 0,
    tempsTotal: 0,
  });

  const fetchUtilisateurs = async () => {
    const reponse = await api.get("/utilisateurs/");
    setUtilisateurs(reponse.data);
  };

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  const handleInputChange = (evenement) => {
    const valeur = evenement.target.value;
    setFormData({
      ...formData,
      [evenement.target.name]: valeur,
    });
  };

  const handleFormSubmit = async (evenement) => {
    evenement.preventDefault();
    const reponse = await api.post("/utilisateurs/", formData);
    fetchUtilisateurs();
    setFormData({
      pseudo: "",
      mot_de_passe: "",
      nom: "",
      prenom: "",
      courriel: "",
      est_admin: false,
      moyMotsParMinute: 0,
      numCours: 0,
      tempsTotal: 0,
    });
  };

  return (
    <>
      <h1>Se connecter</h1>
      <form onSubmit={handleFormSubmit}>
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
        
        <p>
          Pas encore inscrit ?
          <Link to="/sinscrire">S'inscrire</Link>
        </p>
        
        <button type="submit">Se connecter</button>
      </form>
    </>
  );
}
