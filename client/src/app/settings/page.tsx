"use client";

import React, { useState, useEffect } from "react";
import {
  useCreateSessionMutation,
  useCloseSessionMutation,
  useGetActiveSessionQuery,
  useCreateManagerMutation,
} from "@/state/api";
import { useAppDispatch } from "@/app/redux";
import { setActiveSession } from "@/state/globalSlice";

const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();

  // États de connexion
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // États du formulaire de session
  const [fraisDepot, setFraisDepot] = useState("");
  const [fraisVente, setFraisVente] = useState("");
  const [nomSession, setNomSession] = useState("");

  const { data: activeSessionData, error: activeSessionError, refetch: refetchActiveSession } =
    useGetActiveSessionQuery(undefined, { refetchOnMountOrArgChange: true });

  const [createSession] = useCreateSessionMutation();
  const [closeSession, { isSuccess: closeSuccess }] = useCloseSessionMutation();

  // États pour le formulaire de création d'un nouveau manager
  const [newNom, setNewNom] = useState("");
  const [newPrenom, setNewPrenom] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newMotDePasse, setNewMotDePasse] = useState("");

  const [createManager] = useCreateManagerMutation();

  // Fonction de connexion
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Fonction pour créer une session
  const handleCreateSession = async () => {
    if (activeSessionData && !activeSessionError) {
      alert("Une session est déjà active. Veuillez la fermer avant de créer une nouvelle session.");
      return;
    }
    try {
      const newSession = await createSession({
        NomSession: nomSession,
        pourc_frais_depot: parseFloat(fraisDepot),
        pourc_frais_vente: parseFloat(fraisVente),
      }).unwrap();

      dispatch(setActiveSession(newSession));
      setFraisDepot("");
      setFraisVente("");
      setNomSession("");
      refetchActiveSession();
    } catch (error) {
      console.error("Erreur lors de la création de la session :", error);
      alert("Erreur lors de la création de la session.");
    }
  };

  // Fonction pour fermer la session active
  const handleCloseSession = async () => {
    if (!activeSessionData) {
      alert("Aucune session active à fermer.");
      return;
    }
    try {
      await closeSession().unwrap();
      dispatch(setActiveSession(null));
      refetchActiveSession();
    } catch (error) {
      console.error("Erreur lors de la fermeture de la session :", error);
      alert("Erreur lors de la fermeture de la session.");
    }
  };

  useEffect(() => {
    if (closeSuccess) {
      refetchActiveSession();
    }
  }, [closeSuccess, refetchActiveSession]);

  // Fonction pour créer un nouveau manager
  const handleAddManager = async () => {
    try {
      await createManager({
        Nom: newNom,
        Prenom: newPrenom,
        Email: newEmail,
        MdP: newMotDePasse,
      }).unwrap();
      setNewNom("");
      setNewPrenom("");
      setNewEmail("");
      setNewMotDePasse("");
      alert("Gestionnaire créé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la création du manager :", error);
      alert("Erreur lors de la création du manager.");
    }
  };

  if (!isLoggedIn) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f0f0f5",
        }}
      >
        <div
          style={{
            borderRadius: "12px",
            border: "1px solid #ddd",
            padding: "40px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            backgroundColor: "white",
            width: "300px",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: "20px", fontSize: "24px", fontWeight: "bold" }}>
            Connexion
          </h2>
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              marginBottom: "20px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={handleLogin}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleCreateSession}>Créer une session</button>
      <button onClick={handleCloseSession}>Fermer la session</button>
      <div>
        <h3>Ajouter un gestionnaire</h3>
        <input
          type="text"
          placeholder="Nom"
          value={newNom}
          onChange={(e) => setNewNom(e.target.value)}
        />
        <input
          type="text"
          placeholder="Prénom"
          value={newPrenom}
          onChange={(e) => setNewPrenom(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={newMotDePasse}
          onChange={(e) => setNewMotDePasse(e.target.value)}
        />
        <button onClick={handleAddManager}>Ajouter</button>
      </div>
    </div>
  );
};

export default SettingsPage;

