import React from 'react';
import { useRequestStore } from '../store/useRequestStore';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analytics: React.FC = () => {
  const { requests } = useRequestStore();

  const dailyRequests = requests.reduce((acc, req) => {
    const date = new Date(req.created_at).toLocaleDateString('ar-EG');
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = {
    labels: Object.keys(dailyRequests),
    datasets: [
      {
        label: 'عدد الطلبات',
        data: Object.values(dailyRequests),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold text-blue-900 mb-4">تحليلات الطلبات</h2>
      <Bar data={data} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
    </motion.div>
  );
};

export default Analytics;