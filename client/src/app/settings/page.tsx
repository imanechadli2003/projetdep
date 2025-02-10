"use client";

import React, { useState, useEffect } from "react";
import {
  useCreateSessionMutation,
  useGetActiveSessionQuery,
  useCloseSessionMutation,
  useCreateManagerMutation,
  useGetManagersQuery,
} from "@/state/api";
import { useAppDispatch } from "@/app/redux";
import { setActiveSession } from "@/state/globalSlice";

interface Gestionnaire {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
}

const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();

  // States for session management
  const [nomSession, setNomSession] = useState("");
  const [fraisDepot, setFraisDepot] = useState("");
  const [fraisVente, setFraisVente] = useState("");

  // States for manager management
  const [newNom, setNewNom] = useState("");
  const [newPrenom, setNewPrenom] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newMotDePasse, setNewMotDePasse] = useState("");
  const [gestionnaires, setGestionnaires] = useState<Gestionnaire[]>([]);

  // Hooks RTK Query
  const { data: activeSessionData, refetch: refetchActiveSession } = useGetActiveSessionQuery();
  const [createSession, { isLoading: isCreatingSession }] = useCreateSessionMutation();
  const [closeSession, { isLoading: isClosingSession }] = useCloseSessionMutation();

  const { data: managersData, isLoading: managersLoading, refetch: refetchManagers } = useGetManagersQuery();
  const [createManager, { isLoading: isCreatingManager }] = useCreateManagerMutation();

  // Update managers list when data is fetched
  useEffect(() => {
    if (managersData) {
      setGestionnaires(
        managersData.map((manager) => ({
          nom: manager.Nom,
          prenom: manager.Prenom,
          email: manager.Email,
          motDePasse: "******", // Mask password
        }))
      );
    }
  }, [managersData]);

  // Handlers
  const handleCreateSession = async () => {
    if (activeSessionData) {
      alert("Une session est déjà active. Veuillez fermer la session active avant d'en créer une nouvelle.");
      return;
    }

    try {
      const newSession = await createSession({
        NomSession: nomSession,
        pourc_frais_depot: parseFloat(fraisDepot),
        pourc_frais_vente: parseFloat(fraisVente),
      }).unwrap();

      dispatch(setActiveSession(newSession));
      setNomSession("");
      setFraisDepot("");
      setFraisVente("");
      refetchActiveSession();
    } catch (error) {
      console.error("Erreur lors de la création de la session :", error);
    }
  };

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
    }
  };

  const handleAddManager = async () => {
    try {
      const newManager = await createManager({
        Nom: newNom,
        Prenom: newPrenom,
        Email: newEmail,
        MdP: newMotDePasse,
      }).unwrap();

      setGestionnaires((prev) => [
        ...prev,
        {
          nom: newManager.Nom,
          prenom: newManager.Prenom,
          email: newManager.Email,
          motDePasse: newMotDePasse,
        },
      ]);

      setNewNom("");
      setNewPrenom("");
      setNewEmail("");
      setNewMotDePasse("");
      refetchManagers();
    } catch (error) {
      console.error("Erreur lors de la création du gestionnaire :", error);
    }
  };

  return (
    <div className="settings-page">
      <h1>Gestion des Sessions et des Gestionnaires</h1>

      {/* Session Management Section */}
      <section className="section">
        <h2>Gestion des Sessions</h2>
        {activeSessionData ? (
          <div className="active-session">
            <h3>Session Active</h3>
            <p><strong>Nom :</strong> {activeSessionData.NomSession}</p>
            <p><strong>Frais Dépôt :</strong> {activeSessionData.pourc_frais_depot}%</p>
            <p><strong>Frais Vente :</strong> {activeSessionData.pourc_frais_vente}%</p>
            <button onClick={handleCloseSession} disabled={isClosingSession}>
              {isClosingSession ? "Fermeture en cours..." : "Fermer la Session"}
            </button>
          </div>
        ) : (
          <div className="create-session">
            <h3>Créer une Nouvelle Session</h3>
            <input
              type="text"
              placeholder="Nom de la Session"
              value={nomSession}
              onChange={(e) => setNomSession(e.target.value)}
            />
            <input
              type="number"
              placeholder="Frais Dépôt (%)"
              value={fraisDepot}
              onChange={(e) => setFraisDepot(e.target.value)}
            />
            <input
              type="number"
              placeholder="Frais Vente (%)"
              value={fraisVente}
              onChange={(e) => setFraisVente(e.target.value)}
            />
            <button onClick={handleCreateSession} disabled={isCreatingSession}>
              {isCreatingSession ? "Création en cours..." : "Créer la Session"}
            </button>
          </div>
        )}
      </section>

      {/* Manager Management Section */}
      <section className="section">
        <h2>Gestion des Gestionnaires</h2>
        <div className="add-manager">
          <h3>Ajouter un Gestionnaire</h3>
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
            placeholder="Mot de Passe"
            value={newMotDePasse}
            onChange={(e) => setNewMotDePasse(e.target.value)}
          />
          <button onClick={handleAddManager} disabled={isCreatingManager}>
            {isCreatingManager ? "Ajout en cours..." : "Ajouter"}
          </button>
        </div>

        <div className="managers-list">
          <h3>Liste des Gestionnaires</h3>
          {managersLoading ? (
            <p>Chargement...</p>
          ) : (
            gestionnaires.map((gestionnaire, index) => (
              <div key={index} className="manager-item">
                <p>
                  {gestionnaire.nom} {gestionnaire.prenom} - {gestionnaire.email}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;



