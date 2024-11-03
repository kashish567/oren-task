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
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slice/authSlice';
import { RootState } from '@/redux/store';

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

  const [years, setYears] = useState<string[]>(["2018", "2019", "2020", "2021", "2022"]);
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

  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, []);

  const createIndividualChartData = (metricType: keyof Metrics) => ({
    labels: years,
    datasets: [
      {
        label: `User ${metricType.charAt(0).toUpperCase() + metricType.slice(1)}`,
        data: metrics[metricType],
        borderColor: metricType === 'carbon' ? '#1E3A8A' : metricType === 'water' ? '#34D399' : '#F472B6',
        fill: false,
      },
      {
        label: `Benchmark ${metricType.charAt(0).toUpperCase() + metricType.slice(1)}`,
        data: benchmarks[metricType],
        borderColor: '#FF5733',
        borderDash: [5, 5],
        fill: false,
      },
    ],
  });

  const createCombinedChartData = () => ({
    labels: years,
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
  });

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

  const handleYearChange = (index: number, value: string) => {
    setYears((prevYears) => {
      const newYears = [...prevYears];
      newYears[index] = value;
      return newYears;
    });
  };


  const handleLogout = () => {
    localStorage.removeItem('user1');
    dispatch(logout());
    router.push('/login');
  };

  const handleExportCSV = () => {
    const getColorLabel = (percentage:any) => {
      if (percentage >= 91) return "dark red";
      if (percentage >= 61) return "red";
      if (percentage >= 31) return "orange";
      return "green";
    };
  
    const data = years.map((year, index) => {
      const carbonPercentage = ((metrics.carbon[index] / benchmarks.carbon[index]) * 100).toFixed(2);
      const waterPercentage = ((metrics.water[index] / benchmarks.water[index]) * 100).toFixed(2);
      const wastePercentage = ((metrics.waste[index] / benchmarks.waste[index]) * 100).toFixed(2);
  
      return {
        Year: year,
        Carbon: metrics.carbon[index],
        CarbonPercentage: `${carbonPercentage}% (${getColorLabel(carbonPercentage)})`,
        Water: metrics.water[index],
        WaterPercentage: `${waterPercentage}% (${getColorLabel(waterPercentage)})`,
        Waste: metrics.waste[index],
        WastePercentage: `${wastePercentage}% (${getColorLabel(wastePercentage)})`,
      };
    });
  
    const averages = {
      AverageCarbon: (metrics.carbon.reduce((sum, value) => sum + value, 0) / metrics.carbon.length).toFixed(2),
      AverageWater: (metrics.water.reduce((sum, value) => sum + value, 0) / metrics.water.length).toFixed(2),
      AverageWaste: (metrics.waste.reduce((sum, value) => sum + value, 0) / metrics.waste.length).toFixed(2),
    };
  
    const csvData = [...data, { Year: 'Average', ...averages }];
    const csv = Papa.unparse(csvData);
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

      {/* Input Fields for Years and Metrics */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Years</h2>
        <div className="grid grid-cols-5 gap-4">
          {years.map((year, index) => (
            <input
              key={`year-${index}`}
              type="text"
              value={year}
              onChange={(e) => handleYearChange(index, e.target.value)}
              className="border px-2 py-1 rounded border-gray-300"
              placeholder={`Year ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {["carbon", "water", "waste"].map((metricType) => (
        <div key={metricType} className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            {metricType.charAt(0).toUpperCase() + metricType.slice(1)} Usage
          </h2>
          <div className="grid grid-cols-5 gap-4">
            {years.map((year, index) => (
              <input
                key={`${metricType}-${index}`}
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

      {/* Individual Charts for Each Metric */}
      {["carbon", "water", "waste"].map((metricType) => (
        <div key={metricType} className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{metricType.charAt(0).toUpperCase() + metricType.slice(1)} Metrics</h2>
          <Line data={createIndividualChartData(metricType as keyof Metrics)} />
        </div>
      ))}

      {/* Combined Chart */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Combined Metrics</h2>
        <Line data={createCombinedChartData()} />
      </div>

      <button onClick={handleExportCSV} className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg">
        Export CSV
      </button>
    </div>
  );
};

export default DashboardPage;
