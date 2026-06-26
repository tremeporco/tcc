/**
 * Busca informações de um composto químico no PubChem
 * @param {string} name - nome do composto (ex: water, glucose)
 */

export async function getCompound(name) {
  try {
    const res = await fetch(
      `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(
        name
      )}/JSON`
    )

    if (!res.ok) {
      throw new Error("Erro ao buscar no PubChem")
    }

    const data = await res.json()

    const compound = data?.PC_Compounds?.[0]

    if (!compound) {
      return {
        error: "Composto não encontrado"
      }
    }

    // pega algumas propriedades úteis
    const props = compound.props || []

    const getProp = (label) =>
      props.find((p) => p.urn?.label === label)?.value?.sval ||
      props.find((p) => p.urn?.label === label)?.value?.fval ||
      null

    return {
      name,
      molecularFormula: getProp("Molecular Formula"),
      molecularWeight: getProp("Molecular Weight"),
      iupacName: getProp("IUPAC Name"),
      raw: compound
    }
  } catch (error) {
    return {
      error: error.message || "Erro desconhecido"
    }
  }
}