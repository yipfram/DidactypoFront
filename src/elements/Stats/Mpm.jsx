import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import Stat from "./Stat.jsx";
import {
  Chart as ChartJS,
  LineElement,
  PointElement, // Ajouter cet élément
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Mpm({ pseudo }) {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await Stat({ pseudo: pseudo, type: "wpm" });
        setStats(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchStats();
  }, [pseudo]);

  if (loading) {
    return <p>Chargement des statistiques de mots par minute...</p>;
  }

  if (!stats || stats.length === 0) {
    return <p>Aucune donnée de mots par minute disponible.</p>;
  }

  const labels = stats.map((stat) =>
    new Date(stat.date_stat * 1000).toLocaleDateString()
  );
  const values = stats.map((stat) => stat.valeur_stat);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Mots par minute (WPM)",
        data: values,
        borderColor: "#4caf50",
        backgroundColor: "rgba(53, 76, 54, 0.2)",
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Mots par minute",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
