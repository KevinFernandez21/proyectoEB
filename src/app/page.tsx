"use client"; 
import Image from "next/image";
import Circuito from "./A9R1tkk56a_dxlbqk_et0.webp";
import { useState } from "react";

// Definir los tipos para los valores de entrada y los resultados
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/calculate", {
        method: "POST",  // Asegúrate de que el método sea POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center text-white px-5">
      <div>
        <h1 className="text-3xl font-bold mb-10">Ley de Kirchhoff</h1>
      </div>
      <div className="flex">
        <div className="relative w-1/2 flex flex-col items-center justify-center">
          <Image src={Circuito} alt="Diagrama de circuito" />
          <form className="mt-5 w-full max-w-sm" onSubmit={handleSubmit}>
            {["R1", "R2", "R3", "R4", "R5", "V1", "V2", "V3"].map((field) => (
              <div key={field} className="mb-4">
                <label
                  className="block text-sm font-bold mb-2"
                  htmlFor={field}
                >
                  {field}
                </label>
                <input
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                  type="number"
                  id={field}
                  name={field}
                  value={values[field as keyof ValuesType]} // Indexación segura
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Calcular
            </button>
          </form>
        </div>
        <div className="w-1/2 p-5">
          <p className="text-2xl font-bold mt-10">Resultados</p>
          <div className="mt-5">
            {results ? (
              <div>
                <p>VR1: {results.VR1}</p>
                <p>VR2: {results.VR2}</p>
                <p>VR3: {results.VR3}</p>
                <p>VR4: {results.VR4}</p>
                <p>VR5: {results.VR5}</p>
                <p>IAC: {results.IAC}</p>
                <p>IAB: {results.IAB}</p>
                <p>IBC: {results.IBC}</p>
                <p>IAD: {results.IAD}</p>
                <p>IDC: {results.IDC}</p>
                <p>IBD: {results.IBD}</p>
              </div>
            ) : (
              <p>Ingrese los valores y presione "Calcular" para ver los resultados.</p>
            )}
          </div>
        </div>
      </div>
      <div>
        <h1>Gráficas</h1>
        <div className="flex">
          <div>
            <h1>VvsR</h1>
            <div></div>
          </div>
          <div>
            <h1>IvsR</h1>
            <div></div>
          </div>
          <div>
            <h1>PvsR</h1>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
