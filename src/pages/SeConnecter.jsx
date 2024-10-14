import { Link } from "react-router-dom";

export default function SeConnecter() {
  return (
    <>
      <h1>Se connecter</h1>
      <form>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required />

        <label htmlFor="password">Mot de passe</label>
        <input type="password" id="password" name="password" required />
        <p>
          Pas encore inscrit ?
          <Link to="/sinscrire">S'inscrire</Link>
        </p>
        <button type="submit">Se connecter</button>
      </form>
    </>
  );
}