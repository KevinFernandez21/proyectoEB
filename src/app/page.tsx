import Image from "next/image";
import Circuito from "./A9R1tkk56a_dxlbqk_et0.webp";

export default function Home() {
  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center text-white px-5">
      <div><h1 className="text-3xl font-bold mb-10">Ley de Kirchhoff</h1></div>
      <div className="flex">
        <div className="relative w-1/2">
          <Image
            src={Circuito}
            alt="Diagrama de circuito"
          />
        </div>
        <div className="w-1/2">
          <p className="text-2xl font-bold mt-10 ">Ley de Kirchhoff</p>
          <p className="mt-5">La ley de Kirchhoff es una de las leyes fundamentales del análisis de circuitos eléctricos. Fue formulada por Gustav Kirchhoff en 1845. La ley de Kirchhoff se basa en la conservación de la energía y la carga eléctrica. La ley de Kirchhoff se divide en dos leyes: la ley de corrientes de Kirchhoff y la ley de tensiones de Kirchhoff.</p>
        </div>
      </div>
      <div>
        <h1>Graficas</h1>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}