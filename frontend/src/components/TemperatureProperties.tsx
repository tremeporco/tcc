"use client";

import { useState } from "react";

interface PubChemProperty {
  value: string | number | null;
  unit: string | null;
}

interface TemperaturePropertiesProps {
  meltingPoint?: PubChemProperty | string | number | null;
  boilingPoint?: PubChemProperty | string | number | null;
}

type TemperatureUnit = "C" | "F" | "K";

function isMissing(value: unknown) {
  return (
    value === undefined ||
    value === null ||
    value === ""
  );
}

function extractCelsius(value: string | number): number | null {
  if (typeof value === "number") {
    return value;
  }

  const celsiusMatch = value.match(
    /(-?\d+(?:\.\d+)?)\s*°C/
  );

  if (celsiusMatch) {
    return Number(celsiusMatch[1]);
  }

  const kelvinMatch = value.match(
    /(-?\d+(?:\.\d+)?)\s*K/
  );

  if (kelvinMatch) {
    return Number(kelvinMatch[1]) - 273.15;
  }

  const fahrenheitMatch = value.match(
    /(-?\d+(?:\.\d+)?)\s*°F/
  );

  if (fahrenheitMatch) {
    return (
      (Number(fahrenheitMatch[1]) - 32) * 5 / 9
    );
  }

  const number = Number(value);

  if (!Number.isNaN(number)) {
    return number;
  }

  return null;
}

function getTemperatureValue(
  property:
    | PubChemProperty
    | string
    | number
    | null
    | undefined
) {
  if (isMissing(property)) {
    return null;
  }

  if (
    typeof property === "object" &&
    property !== null &&
    "value" in property
  ) {
    return extractCelsius(property.value ?? "");
  }

  return extractCelsius(property);
}

function convertTemperature(
  celsius: number,
  unit: TemperatureUnit
) {
  if (unit === "F") {
    return (celsius * 9) / 5 + 32;
  }

  if (unit === "K") {
    return celsius + 273.15;
  }

  return celsius;
}

function formatTemperature(
  property:
    | PubChemProperty
    | string
    | number
    | null
    | undefined,
  unit: TemperatureUnit
) {
  const celsius = getTemperatureValue(property);

  if (celsius === null) {
    return "Não informado";
  }

  const converted = convertTemperature(
    celsius,
    unit
  );

  const symbol =
    unit === "C"
      ? "°C"
      : unit === "F"
        ? "°F"
        : "K";

  return `${converted.toFixed(2)} ${symbol}`;
}

export default function TemperatureProperties({
  meltingPoint,
  boilingPoint,
}: TemperaturePropertiesProps) {
  const [unit, setUnit] =
    useState<TemperatureUnit>("C");

  return (
    <>
      <div className="flex justify-end mb-5">
        <div className="flex items-center gap-3">
          <label
            htmlFor="temperature-unit"
            className="text-sm text-slate-400"
          >
            Temperatura:
          </label>

          <select
            id="temperature-unit"
            value={unit}
            onChange={(event) =>
              setUnit(
                event.target.value as TemperatureUnit
              )
            }
            className="
              rounded-md
              border
              border-white/10
              bg-slate-900
              px-3
              py-2
              text-sm
              text-white
              outline-none
              cursor-pointer
              focus:ring-2
              focus:ring-cyan-400
            "
          >
            <option value="C">
              Celsius (°C)
            </option>

            <option value="F">
              Fahrenheit (°F)
            </option>

            <option value="K">
              Kelvin (K)
            </option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
        <div>
          <p className="text-sm text-slate-400">
            Ponto de fusão
          </p>

          <p className="text-lg font-medium mt-1">
            {formatTemperature(
              meltingPoint,
              unit
            )}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-400">
            Ponto de ebulição
          </p>

          <p className="text-lg font-medium mt-1">
            {formatTemperature(
              boilingPoint,
              unit
            )}
          </p>
        </div>
      </div>
    </>
  );
}