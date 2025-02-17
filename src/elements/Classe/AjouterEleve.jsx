import { useState } from "react"
import { api } from "../../api";

const AjouterEleve = (props) => {

    const [nomEleve, setNomEleve] = useState('');
    const [errorMessage, setErrorMessage] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            // Send data as query parameters, not in the body
            const response = await api.post('/membre_classe/', null, {
                params: {
                    id_groupe: props.id_groupe,
                    pseudo_utilisateur: nomEleve,
                    est_admin: false
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            window.location.reload();
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setErrorMessage('Utilisateur non trouvé');
            } else {
                setErrorMessage('Une erreur est survenue');
            }
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
            <button type="submit">Ajouter élève</button>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </form>
    )
}

export default AjouterEleve;