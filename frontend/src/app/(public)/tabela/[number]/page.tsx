import elementsData from "@/data/periodicTable.json";
import Image from "next/image";
import TemperatureProperties from "../../../../components/TemperatureProperties";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PeriodicTable from "@/components/periodicTable";

interface ElementData {
  ionization_energies: number[];
  number: number;
  category: string;
  xpos: number;
  ypos: number;
  symbol: string;
  name: string;

  atomic_mass?: number;
  density?: number;

  bohr_model_image?: string;
  bohr_model_3d?: string;

  electron_configuration?: string | number;
  electronegativity?: string | number;
  electron_affinity?: string | number;
  atomic_radius?: string | number;
  oxidation_states?: string | number;
}

interface PubChemProperty {
  value: string | number | null;
  unit: string | null;
}

interface PubChemElement {
  density?: PubChemProperty | null;
  melting_point?: PubChemProperty | null;
  boiling_point?: PubChemProperty | null;

  electron_configuration?: PubChemProperty | null;
  electronegativity?: PubChemProperty | null;
  electron_affinity?: PubChemProperty | null;
  atomic_radius?: PubChemProperty | null;  oxidation_states?: PubChemProperty | null;
}

interface PageProps {
  params: Promise<{
    number: string;
  }>;
}

async function getPubChemElement(
  number: number
): Promise<PubChemElement | null> {
  try {
    const response = await fetch(
      `http://localhost:5500/api/elements/${number}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();

  } catch {
    return null;
  }
}

function isMissing(value: unknown) {
  return (
    value === undefined ||
    value === null ||
    value === ""
  );
}

function getValue(
  localValue: string | number | undefined,
  pubchemValue: PubChemProperty | null | undefined
) {
  if (!isMissing(localValue)) {
    return {
      value: localValue,
      unit: null,
    };
  }

  return pubchemValue ?? null;
}

export default async function ElementPage({
  params,
}: PageProps) {

  const { number } = await params;

  const elements =
    elementsData.elements as ElementData[];

  const selectedElement = elements.find(
    (item) => item.number === Number(number)
  );


  if (!selectedElement) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

        <h1 className="text-2xl font-bold">
          Elemento não encontrado
        </h1>

      </main>
    );
  }


  const pubchem = await getPubChemElement(
    selectedElement.number
  );


  const density = getValue(
    selectedElement.density,
    pubchem?.density
  );


  const meltingPoint =
    pubchem?.melting_point ?? null;


  const boilingPoint =
    pubchem?.boiling_point ?? null;


  const electronConfiguration = getValue(
    selectedElement.electron_configuration,
    pubchem?.electron_configuration
  );


  const electronegativity = getValue(
    selectedElement.electronegativity,
    pubchem?.electronegativity
  );


  const electronAffinity = getValue(
    selectedElement.electron_affinity,
    pubchem?.electron_affinity
  );


  const atomicRadius = getValue(
    selectedElement.atomic_radius,
    pubchem?.atomic_radius
  );

 
  const oxidationStates = getValue(
    selectedElement.oxidation_states,
    pubchem?.oxidation_states
  );

  const ionizationEnergy = selectedElement.ionization_energies?.[0];

console.log(selectedElement.bohr_model_image);
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-10">

      <div className="max-w-5xl mx-auto">


        <div className="mb-10">

          


          <div className="flex items-end gap-5 mt-3">

            <h1 className="text-5xl md:text-6xl font-bold">
              {selectedElement.name}
            </h1>


            <span className="text-3xl md:text-4xl font-light text-slate-400">
              {selectedElement.symbol}
            </span>

          </div>


          <p className="text-slate-400 mt-3">
            {selectedElement.category}
          </p>

        </div>



        <div className="grid sm:grid-cols-3 gap-5 mb-6">


          <InfoCard
            title="Número atômico"
            value={selectedElement.number}
          />


          <InfoCard
            title="Símbolo"
            value={selectedElement.symbol}
          />


          <InfoCard
            title="Massa atômica"
            value={
              selectedElement.atomic_mass !== undefined
                ? `${selectedElement.atomic_mass} u`
                : "Não informado"
            }
          />


        </div>        <Section title="Informações gerais">

          <Info
            label="Nome"
            value={selectedElement.name}
          />


          <Info
            label="Categoria"
            value={selectedElement.category}
          />


          <Info
            label="Grupo"
            value={selectedElement.xpos}
          />


          <Info
            label="Período"
            value={selectedElement.ypos}
          />


          <Info
            label="Estados de oxidação"
            value={oxidationStates}
          />



          <Info
            label="Energia de ionização"
            value={ionizationEnergy}
          />

        </Section>



        <Section title="Propriedades físicas">


          <Info
            label="Densidade"
            value={density}
          />


          <TemperatureProperties
            meltingPoint={meltingPoint}
            boilingPoint={boilingPoint}
          />


          <Info
            label="Raio atômico"
            value={atomicRadius}
          />


        </Section>



        <Section title="Estrutura atômica">


          <Info
            label="Configuração eletrônica"
            value={electronConfiguration}
          />


          <Info
            label="Eletronegatividade"
            value={electronegativity}
          />


          <Info
            label="Afinidade eletrônica"
            value={electronAffinity}
          />


        </Section>



        <Section title="Modelo atômico">


          {selectedElement.bohr_model_image ? (

            <div className="sm:col-span-2 flex justify-center">


              <Image
                src={selectedElement.bohr_model_image}
                alt={`Modelo de Bohr do elemento ${selectedElement.name}`}
                width={350}
                height={350}
                className="rounded-lg"
              />


            </div>


          ) : (


            <Info
              label="Modelo de Bohr"
              value="Não informado"
            />


          )}


        </Section>


      </div>

    </main>
  );
}



function InfoCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {

  return (

    <Card className="bg-white/10 border-white/10 text-white">


      <CardHeader>

        <CardTitle className="text-sm font-normal text-slate-400">
          {title}
        </CardTitle>

      </CardHeader>


      <CardContent>

        <p className="text-xl font-bold text-cyan-400">
          {value}
        </p>

      </CardContent>


    </Card>

  );

}




function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {

  return (

    <Card className="bg-white/10 border-white/10 text-white mb-6">


      <CardHeader>

        <CardTitle className="text-2xl">
          {title}
        </CardTitle>

      </CardHeader>


      <CardContent>

        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6">

          {children}

        </div>


      </CardContent>


    </Card>

  );

}




function Info({
  label,
  value,
}: {
  label: string;
  value?: string | number | PubChemProperty | null;
}) {


  let displayValue: string | number =
    "Não informado";



  if (!isMissing(value)) {


    if (
      typeof value === "object" &&
      value !== null &&
      "value" in value
    ) {


      displayValue =
        `${value.value}${
          value.unit
            ? ` ${value.unit}`
            : ""
        }`;


    } else {


      displayValue =
        value as string | number;


    }

  }



  return (

    <div>


      <p className="text-sm text-slate-400">
        {label}
      </p>


      <p className="text-lg font-medium mt-1">

        {displayValue}

      </p>


    </div>

  );

}