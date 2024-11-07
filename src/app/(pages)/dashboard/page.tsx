"use client";
import { useEffect, useState } from "react";
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

  const [benchmarks, setBenchmarks] = useState<Metrics>({
    carbon: [],
    water: [],
    waste: [],
  });

  useEffect(() => {
    const loadBenchmarks = async () => {
      const response = await fetch("/constant.json");
      const data = await response.json();
      setBenchmarks(data);
    };
    loadBenchmarks();
  }, []);

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
      await axios.post("/api/logout");
      dispatch(logout());
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
    if (!token) return;

    for (let i = 0; i < years.length; i++) {
      const year = years[i];
      const carbon = metrics.carbon[i];
      const water = metrics.water[i];
      const waste = metrics.waste[i];

      try {
        const res = await axios.post(
          "/api/metrix",
          { carbon, water, waste, year },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log(res.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-8">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">
          Sustainability Dashboard
        </h1>
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
            key={index}
            type="text"
            value={year}
            onChange={(e) => handleYearChange(index, e.target.value)}
            className="border p-1 rounded text-center"
          />
        ))}
      </div>

      <div className="space-y-8">
        {["carbon", "water", "waste"].map((metric) => (
          <div key={metric}>
            <h2 className="text-xl font-semibold mb-4">
              {metric.charAt(0).toUpperCase() + metric.slice(1)} Metrics
            </h2>
            <div className="mb-4 grid grid-cols-5 gap-2">
              {metrics[metric as keyof Metrics].map((value, index) => (
                <input
                  key={index}
                  type="number"
                  value={value}
                  onChange={(e) =>
                    handleMetricChange(
                      metric as keyof Metrics,
                      index,
                      e.target.value
                    )
                  }
                  className={`border p-1 rounded text-center ${
                    errors[metric as keyof Metrics][index]
                      ? "border-red-500"
                      : ""
                  }`}
                />
              ))}
            </div>
            <Line
              data={createIndividualChartData(metric as keyof Metrics)}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                    labels: {
                      usePointStyle: true,
                      pointStyle: "line", // Show lines instead of rectangles
                      boxWidth: 50,
                    },
                  },
                  title: {
                    display: true,
                    text: `${
                      metric.charAt(0).toUpperCase() + metric.slice(1)
                    } Emissions`,
                  },
                },
                elements: {
                  line: {
                    borderWidth: 2,
                  },
                },
              }}
            />
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-12 mb-4">Combined Metrics</h2>
      <Line
        data={createCombinedChartData()}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
              labels: {
                usePointStyle: true,
                pointStyle: "line", // Show lines instead of rectangles
                boxWidth: 50,
              },
            },
            title: {
              display: true,
              text: "Combined Sustainability Metrics",
            },
          },
          elements: {
            line: {
              borderWidth: 2,
            },
          },
        }}
      />
    </div>
  );
};

export default DashboardPage;
