"use client";
import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// Définir une interface pour décrire la structure de "bilan"
interface Bilan {
  total_depots: number;
  total_ventes: number;
  total_stocks: number;
  total_gains: number;
  total_comissions: number;
}

// Définir l'interface des props du composant
interface StatisticsProps {
  bilan: Bilan;
}

const Statistics: React.FC<StatisticsProps> = ({ bilan }) => {
  const {
    total_depots,
    total_ventes,
    total_stocks,
    total_gains,
    total_comissions,
  } = bilan;

  // Données pour les graphiques
  const barData = {
    labels: ['Dépôts', 'Ventes', 'Stocks'],
    datasets: [
      {
        label: 'Quantité',
        data: [total_depots, total_ventes, total_stocks],
        backgroundColor: ['#4caf50', '#2196f3', '#ff9800'],
      },
    ],
  };

  const pieData = {
    labels: ['Gains', 'Commissions'],
    datasets: [
      {
        label: 'Montants (€)',
        data: [total_gains, total_comissions],
        backgroundColor: ['#8e44ad', '#e74c3c'],
      },
    ],
  };

  return (
    <div>
      <h2>Statistiques</h2>
      <div style={{ width: '600px', margin: '0 auto' }}>
        <h3>Dépôts, Ventes, Stocks</h3>
        <Bar data={barData} />
      </div>

      <div style={{ width: '400px', margin: '20px auto' }}>
        <h3>Répartition Gains/Commissions</h3>
        <Pie data={pieData} />
      </div>
    </div>
  );
};

export default Statistics;
