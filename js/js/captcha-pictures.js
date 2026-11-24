// Ilustraciones locales para el reto visual; no se envían etiquetas de solución por casilla.
const crypto = require("node:crypto");
const labels = ["hamburguesas", "porciones de pizza", "papas fritas"];
const drawings = [
  '<path d="M18 47a32 29 0 0 1 64 0Z" fill="#e9a448"/><path d="M15 52h70v8H15z" fill="#4d9c43"/><rect x="18" y="60" width="64" height="11" rx="5" fill="#653923"/><path d="M18 72h64v10H18z" fill="#efb653"/><path d="m32 32 4-2m12-4 4 1m10 5 4-2" stroke="#fff2cd" stroke-width="3"/>',
  '<path d="M18 24Q50 8 82 24L50 87Z" fill="#f4cf63" stroke="#d79539" stroke-width="4"/><path d="M18 24Q50 8 82 24" fill="none" stroke="#bf7830" stroke-width="10"/><g fill="#cc4536"><circle cx="39" cy="37" r="7"/><circle cx="62" cy="35" r="6"/><circle cx="51" cy="59" r="6"/></g>',
  '<g fill="#f3bc39" stroke="#c48a25" stroke-width="1"><path d="M24 22h9v49h-9zM39 15h9v55h-9zM54 24h9v49h-9zM69 18h9v51h-9z"/></g><path d="M18 49q32 16 64 0L75 88H25Z" fill="#d93c32"/><circle cx="50" cy="70" r="9" fill="#ffd45b"/>',
];
function image(kind) {
  const angle = crypto.randomInt(-9, 10),
    bg = ["#fff5e4", "#f0f7f3", "#fff0ed"][crypto.randomInt(3)];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" rx="10" fill="${bg}"/><g transform="rotate(${angle} 50 50)">${drawings[kind]}</g></svg>`;
  return "data:image/svg+xml;base64," + Buffer.from(svg).toString("base64");
}
module.exports = function pictures() {
  const target = crypto.randomInt(3),
    count = crypto.randomInt(2, 5);
  const cells = Array.from({ length: 9 }, (_, i) => ({
    id: crypto.randomBytes(12).toString("hex"),
    kind: i < count ? target : (target + crypto.randomInt(1, 3)) % 3,
  }));
  for (let i = cells.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }
  return {
    answer: cells
      .filter((c) => c.kind === target)
      .map((c) => c.id)
      .sort()
      .join(","),
    ids: cells.map((c) => c.id),
    public: {
      type: "images",
      prompt: "Selecciona todas las imágenes con " + labels[target] + ".",
      cells: cells.map((c) => ({ id: c.id, image: image(c.kind) })),
    },
  };
};
