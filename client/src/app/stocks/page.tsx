"use client";

import React, { useState } from "react";
import {
  useGetDepotsQuery,
  useGetVendeurByIdQuery,
} from "@/state/api";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import CreateProductModal, { depotformdata } from "./createdepot";

// Nouveau composant pour afficher le nom du vendeur
const VendeurCell: React.FC<{ vendeurId: number }> = ({ vendeurId }) => {
  const { data: vendeur } = useGetVendeurByIdQuery(vendeurId);
  return <>{vendeur ? vendeur.Nom : "Loading..."}</>;
};

const Inventory = () => {
  const { data: depots, error: depotsError, isLoading: depotsLoading } = useGetDepotsQuery();

  // État pour gérer l'ouverture du modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fonctions pour ouvrir/fermer le modal
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Fonction appelée lors de la création d'un dépôt (depuis le modal)
  const handleCreateDepot = (formData: depotformdata) => {
    console.log("Dépôt créé avec les données :", formData);
    // Ici, vous pouvez appeler votre mutation pour créer le dépôt
    handleCloseModal();
  };

  if (depotsLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (depotsError || !depots) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch data
      </div>
    );
  }

  // Définition des colonnes pour le DataGrid
  const columns: GridColDef[] = [
    { field: "ID_depot", headerName: "ID du depot", width: 200 },
    {
      field: "VendeurID",
      headerName: "Vendeur du dépôt",
      width: 200,
      renderCell: (params) => <VendeurCell vendeurId={Number(params.value)} />,
    },
    {
      field: "date_depot",
      headerName: "Date du dépôt",
      width: 250,
    },
    {
      field: "comission_depot_total",
      headerName: "Frais du dépôt payé",
      width: 250,
      type: "number",
    },
  ];

  return (
    <div className="flex flex-col">
      <Header name="Inventory" />

      {/* Bouton pour ouvrir le modal */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenModal}
        className="mb-4"
      >
        Ajouter un dépôt
      </Button>

      <DataGrid
        rows={depots}
        columns={columns}
        getRowId={(row) => row.ID_depot}
        checkboxSelection
        className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
      />

      {/* Modal pour ajouter un dépôt */}
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreate={handleCreateDepot}
      />
    </div>
  );
};

export default Inventory;
