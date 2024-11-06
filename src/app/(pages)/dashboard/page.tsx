"use client";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slice/authSlice";

import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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

  const [years, setYears] = useState<string[]>([
    "2018",
    "2019",
    "2020",
    "2021",
    "2022",
  ]);
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

  const createIndividualChartData = (metricType: keyof Metrics) => ({
    labels: years,
    datasets: [
      {
        label: `User ${
          metricType.charAt(0).toUpperCase() + metricType.slice(1)
        }`,
        data: metrics[metricType],
        borderColor:
          metricType === "carbon"
            ? "#1E3A8A"
            : metricType === "water"
            ? "#34D399"
            : "#F472B6",
        borderWidth: 2,
        pointRadius: 3,
        fill: false,
      },
      {
        label: `Benchmark ${
          metricType.charAt(0).toUpperCase() + metricType.slice(1)
        }`,
        data: benchmarks[metricType],
        borderColor: "#FF5733",
        borderDash: [5, 5],
        borderWidth: 2,
        pointRadius: 3,
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

  const handleMetricChange = (
    metricType: keyof Metrics,
    index: number,
    value: string
  ) => {
    const parsedValue = parseFloat(value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [metricType]: prevErrors[metricType].map((error, i) =>
        i === index ? isNaN(parsedValue) || parsedValue < 0 : error
      ),
    }));

    if (!isNaN(parsedValue) && parsedValue >= 0) {
      setMetrics((prevMetrics) => ({
        ...prevMetrics,
        [metricType]: [
          ...prevMetrics[metricType].slice(0, index),
          parsedValue,
          ...prevMetrics[metricType].slice(index + 1),
        ],
      }));
    }
  };

  const handleYearChange = (index: number, value: string) => {
    if (!years.includes(value) || value === years[index]) {
      setYears((prevYears) => {
        const newYears = [...prevYears];
        newYears[index] = value;
        return newYears;
      });
    }
  };

  const handleLogout = async () => {
  
    try {
      // Call server-side logout API to clear the refresh token
      await axios.post("/api/logout");
      
      // Dispatch logout action to update Redux state
      dispatch(logout());
  
      // Redirect to the login page
      router.push("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleExportCSV = () => {
    const data = years.map((year, index) => ({
      Year: year,
      Carbon: metrics.carbon[index],
      Water: metrics.water[index],
      Waste: metrics.waste[index],
    }));

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "sustainability_metrics.csv");
    document.body.appendChild(link);
    link.click();
  };

  const handleExportJSON = () => {
    const data = years.map((year, index) => ({
      Year: year,
      Carbon: metrics.carbon[index],
      Water: metrics.water[index],
      Waste: metrics.waste[index],
    }));

    const json = JSON.stringify({ data }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "sustainability_metrics.json");
    document.body.appendChild(link);
    link.click();
  };

  const handleSaveData = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return;
    }

    for (let i = 0; i < years.length; i++) {
      const year = years[i];
      const carbon = metrics.carbon[i];
      const water = metrics.water[i];
      const waste = metrics.waste[i];

      try {
        const res = await axios.post(
          "/api/metrix",
          { carbon, water, waste, year },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(res.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Wrap each chart in a responsive container and update container styles for mobile
return (
  <div className="max-w-screen-lg mx-auto px-2 sm:px-4 py-8">
    <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <h1 className="text-2xl md:text-3xl font-bold">Sustainability Dashboard</h1>
      <div className="flex gap-4">
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Export as CSV
        </button>
        <button
          onClick={handleExportJSON}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Export as JSON
        </button>
        <button
            onClick={handleSaveData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Save Metrics
          </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Logout
        </button>
      </div>
    </header>

    <div className="mb-6 grid grid-cols-2 sm:grid-cols-5 gap-2">
      {years.map((year, index) => (
        <input
          key={`year-${index}`}
          type="text"
          value={year}
          onChange={(e) => handleYearChange(index, e.target.value)}
          className="border px-2 py-1 rounded text-center border-gray-300"
          placeholder={`Year ${index + 1}`}
        />
      ))}
    </div>

    {["carbon", "water", "waste"].map((metricType) => (
      <div key={metricType} className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          {metricType.charAt(0).toUpperCase() + metricType.slice(1)} Metrics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {metrics[metricType as keyof Metrics].map((value, index) => (
            <input
              key={`${metricType}-${index}`}
              type="number"
              value={value}
              onChange={(e) =>
                handleMetricChange(metricType as keyof Metrics, index, e.target.value)
              }
              className={`border px-2 py-1 rounded text-center border-gray-300 ${
                errors[metricType as keyof Metrics][index] ? "border-red-500" : ""
              }`}
              placeholder="Enter value"
            />
          ))}
        </div>
        <div className="relative w-full h-64 sm:h-80 md:h-96">
          <Line
            data={createIndividualChartData(metricType as keyof Metrics)}
            options={{
              responsive: true,
              maintainAspectRatio: false, // Ensures the chart adapts to container height
              plugins: {
                legend: {
                  position: "top",
                  labels: {
                    usePointStyle: true,
                    pointStyle: "line",
                  },
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: "Years",
                    font: { size: 14 },
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: "Values",
                    font: { size: 14 },
                  },
                },
              },
            }}
          />
        </div>
      </div>
    ))}

    <div className="bg-white p-4 rounded shadow mb-6">
      <h3 className="text-center font-semibold mb-2">Combined Metrics</h3>
      <div className="relative w-full h-64 sm:h-80 md:h-96">
        <Line
          data={createCombinedChartData()}
          options={{
            responsive: true,
            maintainAspectRatio: false, // Ensures chart adapts to container height
            plugins: {
              legend: {
                position: "top",
                labels: {
                  usePointStyle: true,
                  pointStyle: "line",
                },
              },
            },
            scales: {
              x: {
                title: { display: true, text: "Years", font: { size: 14 } },
              },
              y: {
                title: { display: true, text: "Values", font: { size: 14 } },
              },
            },
          }}
        />
      </div>
    </div>
  </div>
);
};

export default DashboardPage;
