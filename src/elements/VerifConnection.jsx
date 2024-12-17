import { Children, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Link, Navigate } from 'react-router-dom';

export default function VerifConnection({children}) {
  const [connected, setConnected] = useState(true);
  
  useEffect(() => {
    const token = window.localStorage.getItem("token");

    if (!token) {
      setConnected(false);
    }
  }, []);

  return (
    <>
      {connected ? (
        children
      ) : (
        <>
          <h1>Vous devez être connecté pour accéder à cette page.</h1>
          <Link to="/compte">Clickez ici pour vous connecter</Link>
        </>
      )}
    </>
  );
}