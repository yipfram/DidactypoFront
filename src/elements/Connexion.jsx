import { useState, useEffect } from 'react';
import api from '../api.jsx';
import logo from '../img/logoDidactypo.png';
import { Link, useNavigate } from 'react-router-dom';

export default function Connexion() {
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [formData, setFormData] = useState({
        pseudo: '',
        mot_de_passe: '',
    });

    const navigate = useNavigate();  // Utilisé pour la redirection après la connexion

    const fetchUtilisateurs = async () => {
        try {
            const reponse = await api.get("/utilisateurs/");
            setUtilisateurs(reponse.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs :", error);
        }
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

        // Vérifier si le pseudo ou l'email existe et si le mot de passe correspond
        const utilisateur = utilisateurs.find(
            (utilisateur) => 
                (utilisateur.pseudo === formData.pseudo || utilisateur.courriel === formData.pseudo) &&
                utilisateur.mot_de_passe === formData.mot_de_passe
        );

        if (!utilisateur) {
            alert("Identifiant ou mot de passe incorrect.");
            return;
        }
        // Stocker le token de l'utilisateur dans le localStorage
        localStorage.setItem('pseudo', utilisateur.pseudo);

        // Connexion réussie, rediriger l'utilisateur
        alert("Connexion réussie !");
        navigate("/accueil");  // Redirige vers la page d'accueil ou autre
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <img src={logo} alt="Logo" />
            <h1>Connectez-vous !</h1>

            <label htmlFor="pseudo">Pseudo ou Email</label>
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

            <button type="submit">Se connecter</button>
            <p>Pas de compte ? <Link to="/sinscrire">Créez le votre dès maintenant !</Link></p>
        </form>
    );
}
