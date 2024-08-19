"use client";
import Image from "next/image";
import Circuito from "./problema1.jpg";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

type ValuesType = {
  R1: string;
  R2: string;
  R3: string;
  R4: string;
  R5: string;
  V1: string;
  V2: string;
  V3: string;
};

type ResultsType = {
  VR1: number;
  VR2: number;
  VR3: number;
  VR4: number;
  VR5: number;
  IAC: number;
  IAB: number;
  IBC: number;
  IAD: number;
  IDC: number;
  IBD: number;
};

export default function Home() {
  const [values, setValues] = useState<ValuesType>({
    R1: "",
    R2: "",
    R3: "",
    R4: "",
    R5: "",
    V1: "",
    V2: "",
    V3: "",
  });

  const [results, setResults] = useState<ResultsType | null>(null);
  const [selectedResistor, setSelectedResistor] = useState<string>("R1");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleResistorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedResistor(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("https://then-canidae-orangecorp-04c092da.koyeb.app/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      // Limitar los resultados a 3 decimales
      const formattedData = {
        VR1: parseFloat(data.VR1.toFixed(3)),
        VR2: parseFloat(data.VR2.toFixed(3)),
        VR3: parseFloat(data.VR3.toFixed(3)),
        VR4: parseFloat(data.VR4.toFixed(3)),
        VR5: parseFloat(data.VR5.toFixed(3)),
        IAC: parseFloat(data.IAC.toFixed(3)),
        IAB: parseFloat(data.IAB.toFixed(3)),
        IBC: parseFloat(data.IBC.toFixed(3)),
        IAD: parseFloat(data.IAD.toFixed(3)),
        IDC: parseFloat(data.IDC.toFixed(3)),
        IBD: parseFloat(data.IBD.toFixed(3)),
      };

      setResults(formattedData);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const generateGraphPoints = (voltage: number | undefined, resistanceMax: number) => {
    if (voltage === undefined) return { resistances: [], voltages: [], currents: [], powers: [] };

    let resistances = [];
    let voltages = [];
    let currents = [];
    let powers = [];

    // Disminuye el incremento para generar más puntos
    for (let R = 1; R <= resistanceMax; R += 10) {  // Incrementa de 10 en 10 para más puntos
        const I = voltage / R;
        const P = voltage * I;

        resistances.push(R);
        voltages.push(voltage);
        currents.push(I);
        powers.push(P);
    }

    return { resistances, voltages, currents, powers };
  };

  const getGraphData = () => {
    if (!results) return { resistances: [], voltages: [], currents: [], powers: [] };

    let voltage: number | undefined, resistanceMax = 10000;
    switch (selectedResistor) {
      case "R1":
        voltage = results.VR1;
        break;
      case "R2":
        voltage = results.VR2;
        break;
      case "R3":
        voltage = results.VR3;
        break;
      case "R4":
        voltage = results.VR4;
        break;
      case "R5":
        voltage = results.VR5;
        break;
      default:
        voltage = undefined;
        break;
    }

    return generateGraphPoints(voltage, resistanceMax);
  };

  const graphData = getGraphData();

  const voltageChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Gráfica de ${selectedResistor}`,
        color: '#ffffff',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Resistencia (Ohms)',
          color: '#ffffff',
        },
        ticks: {
          color: '#ffffff',
        }
      },
      y: {
        min: 0,
        max: Math.max(...graphData.voltages) * 1.2,
        title: {
          display: true,
          text: 'Valor',
          color: '#ffffff',
        },
        ticks: {
          color: '#ffffff',
        }
      }
    },
    elements: {
      line: {
        tension: 0.4, // Make the line smooth (curved)
      },
      point: {
        radius: 0, // Hide points for a cleaner look
      }
    }
  };

  const currentChartOptions = {
    ...voltageChartOptions,
    scales: {
      ...voltageChartOptions.scales,
      y: {
        ...voltageChartOptions.scales.y,
        max: Math.max(...graphData.currents) * 1.2,
      }
    }
  };

  const powerChartOptions = {
    ...voltageChartOptions,
    scales: {
      ...voltageChartOptions.scales,
      y: {
        ...voltageChartOptions.scales.y,
        max: Math.max(...graphData.powers) * 1.2,
      }
    }
  };

  const voltageData = {
    labels: graphData.resistances,
    datasets: [
      {
        label: 'Voltaje (V)',
        data: graphData.voltages,
        borderColor: 'rgb(0, 255, 128)',
        backgroundColor: 'rgba(0, 255, 128, 0.3)',
        fill: true,
      },
    ],
  };

  const currentData = {
    labels: graphData.resistances,
    datasets: [
      {
        label: 'Corriente (I)',
        data: graphData.currents,
        borderColor: 'rgb(255, 0, 128)',
        backgroundColor: 'rgba(255, 0, 128, 0.3)',
        fill: true,
      },
    ],
  };

  const powerData = {
    labels: graphData.resistances,
    datasets: [
      {
        label: 'Potencia (P)',
        data: graphData.powers,
        borderColor: 'rgb(0, 128, 255)',
        backgroundColor: 'rgba(0, 128, 255, 0.3)',
        fill: true,
      },
    ],
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center text-white px-5">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-10 text-green-300 p-10">Ley de Kirchhoff</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="flex flex-col items-center justify-center">
          <Image src={Circuito} alt="Diagrama de circuito" />
          <form className="mt-5 w-full max-w-lg grid grid-cols-3 gap-4" onSubmit={handleSubmit}>
            {["R1", "R2", "R3", "R4", "R5", "V1", "V2", "V3"].map((field) => (
              <div key={field} className="mb-4">
                <label
                  className="block text-sm font-bold mb-2 text-center text-yellow-300"
                  htmlFor={field}
                >
                  {field}
                </label>
                <input
                  className="w-full p-2 bg-gray-700 border border-gray-500 rounded text-center text-yellow-300"
                  type="number"
                  id={field}
                  name={field}
                  value={values[field as keyof ValuesType]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
            <div className="col-span-3 flex justify-center">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                Calcular
              </button>
            </div>
          </form>
        </div>
        <div className="p-5">
          <p className="text-2xl font-bold text-center mb-5 text-blue-300">Resultados</p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            {results ? (
              <>
                <p className="font-bold text-yellow-300">VR1:</p><p>{results.VR1}</p><div></div>
                <p className="font-bold text-yellow-300">VR2:</p><p>{results.VR2}</p><div></div>
                <p className="font-bold text-yellow-300">VR3:</p><p>{results.VR3}</p><div></div>
                <p className="font-bold text-yellow-300">VR4:</p><p>{results.VR4}</p><div></div>
                <p className="font-bold text-yellow-300">VR5:</p><p>{results.VR5}</p><div></div>
                <p className="font-bold text-yellow-300">IAC:</p><p>{results.IAC}</p><div></div>
                <p className="font-bold text-yellow-300">IAB:</p><p>{results.IAB}</p><div></div>
                <p className="font-bold text-yellow-300">IBC:</p><p>{results.IBC}</p><div></div>
                <p className="font-bold text-yellow-300">IAD:</p><p>{results.IAD}</p><div></div>
                <p className="font-bold text-yellow-300">IDC:</p><p>{results.IDC}</p><div></div>
                <p className="font-bold text-yellow-300">IBD:</p><p>{results.IBD}</p><div></div>
              </>
            ) : (
              <p className="col-span-3 text-center">Ingrese los valores y presione "Calcular" para ver los resultados.</p>
            )}
          </div>
        </div>
      </div>
      <div className="mt-10">
        <h1 className="text-2xl font-bold mb-5 text-center text-purple-300">Gráficas</h1>
        <div className="mb-4 text-center">
          <label className="block text-sm font-bold mb-2 text-yellow-300" htmlFor="resistor-select">
            Seleccione una resistencia:
          </label>
          <select
            id="resistor-select"
            value={selectedResistor}
            onChange={handleResistorChange}
            className="w-full p-2 bg-gray-700 border border-gray-500 rounded text-center text-yellow-300"
          >
            {["R1", "R2", "R3", "R4", "R5"].map((resistor) => (
              <option key={resistor} value={resistor}>
                {resistor}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="w-full h-64">
            <Line data={voltageData} options={voltageChartOptions} />
          </div>
          <div className="w-full h-64">
            <Line data={currentData} options={currentChartOptions} />
          </div>
          <div className="w-full h-64">
            <Line data={powerData} options={powerChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
