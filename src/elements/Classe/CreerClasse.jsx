import { useState } from "react";
import { api } from "../../api";

const CreerClasse = (props) => {

    const [nomClasse, setNomClasse] = useState('');
    const [descriptionClasse, setDescriptionClasse] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('/groupe/', {
                nom_groupe: nomClasse,
                description_groupe: descriptionClasse
            },
                {
                    params: {
                        pseudo_admin: props.pseudo_utilisateur
                    }
                }
            );

            window.location.reload();
        } catch {
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Nom de la classe :</label>
                <input
                    type="text"
                    value={nomClasse}
                    onChange={(e) => setNomClasse(e.target.value)}
                    required
                />
                <label>Description de la classe :</label>
                <input
                    type="text"
                    value={descriptionClasse}
                    onChange={(e) => setDescriptionClasse(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Créer Classe</button>
        </form>
    );
}

export default CreerClasse;