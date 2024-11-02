"use client";
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type Metrics = {
  carbon: number[];
  water: number[];
  waste: number[];
};

type Errors = {
  carbon: boolean[];
  water: boolean[];
  waste: boolean[];
};





const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [metrics, setMetrics] = useState<Metrics>({
    carbon: [0, 0, 0, 0, 0],
    water: [0, 0, 0, 0, 0],
    waste: [0, 0, 0, 0, 0],
  });

  const [errors, setErrors] = useState<Errors>({
    carbon: [false, false, false, false, false],
    water: [false, false, false, false, false],
    waste: [false, false, false, false, false],
  });

  const benchmarks: Metrics = {
    carbon: [50, 45, 40, 35, 30],
    water: [200, 180, 160, 140, 120],
    waste: [100, 90, 80, 70, 60],
  };

  const labels = ["2018", "2019", "2020", "2021", "2022"];

  const createChartData = (userMetric: number[], benchmarkMetric: number[], userLabel: string, benchmarkLabel: string, userColor: string, benchmarkColor: string) => ({
    labels,
    datasets: [
      {
        label: userLabel,
        data: userMetric,
        borderColor: userColor,
        fill: false,
      },
      {
        label: benchmarkLabel,
        data: benchmarkMetric,
        borderColor: benchmarkColor,
        borderDash: [5, 5],
        fill: false,
      }
    ]
  });

  const combinedChartData = {
    labels,
    datasets: [
      {
        label: "User Carbon Emissions",
        data: metrics.carbon,
        borderColor: "#1E3A8A",
        fill: false,
      },
      {
        label: "Benchmark Carbon Emissions",
        data: benchmarks.carbon,
        borderColor: "#FF5733",
        borderDash: [5, 5],
        fill: false,
      },
      {
        label: "User Water Usage",
        data: metrics.water,
        borderColor: "#34D399",
        fill: false,
      },
      {
        label: "Benchmark Water Usage",
        data: benchmarks.water,
        borderColor: "#FFBB33",
        borderDash: [5, 5],
        fill: false,
      },
      {
        label: "User Waste Generated",
        data: metrics.waste,
        borderColor: "#F472B6",
        fill: false,
      },
      {
        label: "Benchmark Waste Generated",
        data: benchmarks.waste,
        borderColor: "#FF33A6",
        borderDash: [5, 5],
        fill: false,
      },
    ],
  };

  const handleMetricChange = (metricType: keyof Metrics, index: number, value: string) => {
    const parsedValue = parseFloat(value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [metricType]: prevErrors[metricType].map((error, i) => i === index ? (isNaN(parsedValue) || parsedValue < 0) : error),
    }));

    if (!isNaN(parsedValue) && parsedValue >= 0) {
      setMetrics((prevMetrics) => ({
        ...prevMetrics,
        [metricType]: [
          ...prevMetrics[metricType].slice(0, index),
          parsedValue,
          ...prevMetrics[metricType].slice(index + 1),
        ]
      }));
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('user1')) {
      router.push('/login');
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('user1');
    router.push('/login');
  };

  const handleExportCSV = () => {
    const data = labels.map((year, index) => ({
      Year: year,
      Carbon: metrics.carbon[index],
      Water: metrics.water[index],
      Waste: metrics.waste[index],
    }));

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'sustainability_metrics.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-orenBlue">Sustainability Dashboard</h1>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg">Logout</button>
      </header>

      {/* Input Fields */}
      {["carbon", "water", "waste"].map((metricType) => (
        <div key={metricType} className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            {metricType.charAt(0).toUpperCase() + metricType.slice(1)} Usage
          </h2>
          <div className="grid grid-cols-5 gap-4">
            {labels.map((year, index) => (
              <input
                key={year}
                type="number"
                value={metrics[metricType as keyof Metrics][index]}
                onChange={(e) => handleMetricChange(metricType as keyof Metrics, index, e.target.value)}
                className={`border px-2 py-1 rounded ${errors[metricType as keyof Errors][index] ? 'border-red-500' : 'border-gray-300'}`}
                placeholder={year}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Individual Charts */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Carbon Emissions (tons)</h2>
        <Line data={createChartData(metrics.carbon, benchmarks.carbon, "User Carbon Emissions", "Benchmark Carbon Emissions", "#1E3A8A", "#FF5733")} options={{ responsive: true }} />
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Water Usage (liters)</h2>
        <Line data={createChartData(metrics.water, benchmarks.water, "User Water Usage", "Benchmark Water Usage", "#34D399", "#FFBB33")} options={{ responsive: true }} />
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Waste Generated (kg)</h2>
        <Line data={createChartData(metrics.waste, benchmarks.waste, "User Waste Generated", "Benchmark Waste Generated", "#F472B6", "#FF33A6")} options={{ responsive: true }} />
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Combined Metrics</h2>
        <Line data={combinedChartData} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Sustainability Metrics Over the Years' } }}} />
      </div>

      <button onClick={handleExportCSV} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg">
        Export to CSV
      </button>
    </div>
  );
};

export default DashboardPage;
