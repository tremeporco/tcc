export async function getCompound(name) {
  async function parseResponse(response) {
    const data = await response.json();

    const properties =
      data?.PropertyTable?.Properties?.[0];

    if (!properties) {
      throw new Error("Dados não encontrados");
    }

    return {
      iupac: properties.IUPACName ?? null,
      formula: properties.MolecularFormula ?? null,
      weight: properties.MolecularWeight ?? null,
    };
  }

  // Busca por fórmula
  try {
    const formulaUrl =
      `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/fastformula/${encodeURIComponent(
        name
      )}/property/IUPACName,MolecularFormula,MolecularWeight/JSON`;

    const formulaResponse = await fetch(formulaUrl);

    if (formulaResponse.ok) {
      return await parseResponse(formulaResponse);
    }
  } catch {}

  // Busca por nome
  try {
    const nameUrl =
      `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(
        name
      )}/property/IUPACName,MolecularFormula,MolecularWeight/JSON`;

    const response = await fetch(nameUrl);

    if (response.ok) {
      return await parseResponse(response);
    }
  } catch {}

  throw new Error("Composto não encontrado");
}


export async function searchCompoundSuggestions(query) {
  if (!query || query.trim().length < 3) {
    return [];
  }

  const encodedQuery = encodeURIComponent(query.trim());

  const url =
    `https://pubchem.ncbi.nlm.nih.gov/rest/autocomplete/compound/${encodedQuery}/json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Erro ao consultar sugestões no PubChem");
  }

  const data = await response.json();

  return data?.dictionary_terms?.compound ?? [];
}


export async function getCompounds(names) {
  const results = [];

  for (const name of names) {
    try {
      const compound = await getCompound(name);

      results.push({
        name,
        ...compound,
      });
    } catch {
      results.push({
        name,
        error: "Composto não encontrado",
      });
    }
  }

  return results;
}


function normalizeHeading(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}


function findSection(sections, heading) {
  if (!Array.isArray(sections)) {
    return null;
  }

  const target = normalizeHeading(heading);

  for (const section of sections) {
    const currentHeading =
      normalizeHeading(section?.TOCHeading);

    if (currentHeading === target) {
      return section;
    }

    const children = section?.Section;

    if (Array.isArray(children)) {
      const found = findSection(
        children,
        heading
      );

      if (found) {
        return found;
      }
    }
  }

  return null;
}


function getSectionValue(section) {
  if (!section) {
    return null;
  }

  const info = section?.Information;

  if (Array.isArray(info)) {
    for (const item of info) {
      const value = item?.Value;

      if (!value) {
        continue;
      }

      if (
        Array.isArray(value.Number) &&
        value.Number.length > 0
      ) {
        const number = Number(value.Number[0]);

        if (!Number.isNaN(number)) {
          return {
            value: number,
            unit: value.Unit ?? null,
          };
        }
      }

      if (typeof value.String === "string") {
        return {
          value: value.String,
          unit: value.Unit ?? null,
        };
      }

      if (
        Array.isArray(value.StringWithMarkup) &&
        value.StringWithMarkup.length > 0
      ) {
        const text = value.StringWithMarkup
          .map((item) => item?.String)
          .filter(Boolean)
          .join(" ");

        if (text) {
          return {
            value: text,
            unit: value.Unit ?? null,
          };
        }
      }
    }
  }

  const children = section?.Section;

  if (Array.isArray(children)) {
    for (const child of children) {
      const result = getSectionValue(child);

      if (result) {
        return result;
      }
    }
  }

  return null;
}


function electronVoltToKjMol(property) {
  if (
    !property ||
    property.value === null ||
    property.value === undefined
  ) {
    return null;
  }

  const number = Number(property.value);

  if (Number.isNaN(number)) {
    return null;
  }

  return {
    value: Number(
      (number * 96.485).toFixed(3)
    ),
    unit: "kJ/mol",
  };
}


export async function getElement(atomicNumber) {
  try {
    const url =
      `https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/element/${atomicNumber}/JSON`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Elemento não encontrado");
    }

    const data = await response.json();

    const sections =
      data?.Record?.Section ?? [];

    function get(name) {
      const section = findSection(
        sections,
        name
      );

      return getSectionValue(section);
    }

    return {
      electron_configuration:
        get("Electron Configuration"),

      atomic_radius:
        get("Atomic Radius"),

      electronegativity:
        get("Electronegativity"),

      electron_affinity:
        electronVoltToKjMol(
          get("Electron Affinity")
        ),

      oxidation_states:
        get("Oxidation States"),

      density:
        get("Density"),

      melting_point:
        get("Melting Point"),

      boiling_point:
        get("Boiling Point"),
    };
  } catch {
    throw new Error(
      "Não foi possível buscar o elemento no PubChem"
    );
  }
}