"use client";

import elementsData from "@/data/periodicTable.json";
import Link from "next/link";

interface ElementData {
  number: number;
  category: string;
  xpos: number;
  ypos: number;
  symbol: string;
  name: string;
}

const colors: Record<string, string> = {
  "metal alcalino": "bg-red-600",
  "metal alcalino-terroso": "bg-orange-600",
  "metal de transição": "bg-yellow-600",
  "metal pós-transição": "bg-lime-600",

  "metaloide": "bg-green-600",

  "não metal diatômico": "bg-sky-600",
  "não metal poliatômico": "bg-blue-600",

  "halogênio": "bg-purple-600",
  "gás nobre": "bg-fuchsia-700",

  "desconhecido": "bg-gray-600",
  "desconhecido, provavelmente metal pós-transição": "bg-lime-700",
  "desconhecido, provavelmente metal de transição": "bg-yellow-700",
  "desconhecido, provavelmente metaloide": "bg-green-700",
  "desconhecido, previsto como gás nobre": "bg-fuchsia-700",
  "desconhecido, mas previsto para ser metal alcalino": "bg-red-700",

  "lantanídeo": "bg-amber-600",
  "actinídeo": "bg-stone-600",
};

export default function PeriodicTable() {
  const elements = elementsData.elements as ElementData[];

  return (
    <div className="w-full p-6 md:p-1">

      <div className="w-full overflow-x-auto overflow-y-visible py-4">
        <div  
          className="
            grid
            gap-1
            w-full
            min-w-175
            md:min-w-225
            lg:min-w-full
            relative
          "
          style={{
            gridTemplateColumns: "repeat(18, minmax(0, 1fr))",
          }}
        >

          {elements.map((element) => (
            <Link
              key={element.number}
              href={`/tabela/${element.number}`}
              style={{
                gridColumn: element.xpos,
                gridRow: element.ypos,
              }}
              className={`
                aspect-square
                rounded-md
                border
                shadow-sm
                hover:scale-103
                hover:shadow-xl
                transition-transform
                relative
                z-20
                flex
                flex-col
                items-center
                justify-center
                overflow-visible
                p-1

                text-[8px]
                sm:text-[10px]
                md:text-xs

                ${colors[element.category] ?? "bg-gray-300"}
              `}
            >

              <span className="opacity-70">
                {element.number}
              </span>

              <span
                className="
                  text-xs
                  sm:text-sm
                  md:text-xl
                  font-bold
                "
              >
                {element.symbol}
              </span>

              <span
                className="
                  hidden
                  lg:block
                  text-[8px]
                  text-center
                  leading-none
                "
              >
                {element.name}
              </span>

            </Link>
          ))}

        </div>
      </div>

      <div className="mt-5 text-sm text-muted-foreground">
        Clique em um elemento para visualizar informações detalhadas.
      </div>

    </div>
  );
}