export async function balanceEquation(equation: string) {
  const res = await fetch("http://localhost:5500/api/balance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ equation }),
  });

  return res.json();
}