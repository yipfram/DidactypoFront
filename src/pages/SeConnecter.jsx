import { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom";

import Connexion from "../elements/Connexion";

import style from "../style/Connexion.module.css";

export default function SeConnecter() {
  return (
    <>
      <Connexion />
    </>
  );
}
