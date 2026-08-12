"use client";

interface TemperatureSelectorProps {
  value: "C" | "F" | "K";
  onChange: (value: "C" | "F" | "K") => void;
}

export default function TemperatureSelector({
  value,
  onChange,
}: TemperatureSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="temperature-unit"
        className="text-sm text-slate-400"
      >
        Temperatura:
      </label>

      <select
        id="temperature-unit"
        value={value}
        onChange={(e) =>
          onChange(e.target.value as "C" | "F" | "K")
        }
        className="
          rounded-md
          border
          border-white/10
          bg-white/10
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
        <option value="C" className="text-black">
          Celsius (°C)
        </option>

        <option value="F" className="text-black">
          Fahrenheit (°F)
        </option>

        <option value="K" className="text-black">
          Kelvin (K)
        </option>
      </select>
    </div>
  );
}