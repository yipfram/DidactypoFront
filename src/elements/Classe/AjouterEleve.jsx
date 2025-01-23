import { useState } from "react"
import api from "../../api";

const AjouterEleve = (props) => {

    const [nomEleve, setNomEleve] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            
            // Send data as query parameters, not in the body
            const response = await api.post('/membre_classe/', null, {
                params: {
                    id_groupe: props.id_groupe,
                    pseudo_utilisateur: nomEleve,
                    est_admin: false
                }
            });

            window.location.reload();
        } catch (error) {
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Pseudo de l'élève :</label>
                <input
                    type="text"
                    value={nomEleve}
                    onChange={(e) => setNomEleve(e.target.value)}
                    required
                />
                
            </div>
            <button type="submit">Créer Classe</button>
        </form>
    )
}

export default AjouterEleve;