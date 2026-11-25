// PDF de texto con fuentes estándar. El servidor genera el adjunto en memoria.
function pdfString(value) {
  return Buffer.from(
    String(value).replace(/[^\x20-\x7e\xa0-\xff]/gu, "?"),
    "latin1",
  ).toString("hex");
}

function wrap(value, width) {
  const lines = [];
  let current = "";
  for (const word of value.split(/[ \t]+/)) {
    if (current && current.length + word.length + 1 > width) {
      lines.push(current);
      current = "";
    }
    if (current) current += " ";
    current += word;
    while (current.length > width) {
      lines.push(current.slice(0, width));
      current = current.slice(width);
    }
  }
  lines.push(current);
  return lines;
}

module.exports = function receiptPdf(ticket) {
  const rows = ticket
    .split("\n")
    .slice(2)
    .flatMap((line) =>
      wrap(line.replace(/(\$[\d.]+) MXN/g, "$1\u00a0MXN"), 43),
    );
  const pages = [];
  for (let start = 0; start < rows.length; start += 29)
    pages.push(rows.slice(start, start + 29));
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
  ];
  const pageRefs = [];
  pages.forEach((lines, index) => {
    const height = 138 + lines.length * 14;
    const text = (x, y, value, font = "F1", size = 10) =>
      `BT /${font} ${size} Tf ${x} ${y} Td <${pdfString(value)}> Tj ET`;
    const drawing = [
      "0.82 0.12 0.14 rg",
      `0 ${height - 64} 308 64 re f`,
      "1 1 1 rg",
      text(24, height - 31, "Tiza Food", "F2", 22),
      text(24, height - 49, "TICKET DE PEDIDO", "F2", 9),
      "0.12 0.11 0.10 rg",
      ...lines.map((line, row) =>
        /^Total /.test(line)
          ? text(24, height - 86 - row * 14, line, "F2", 11)
          : text(24, height - 86 - row * 14, line),
      ),
      "0.4 g",
      text(24, 35, "Gracias por tu compra", "F2", 10),
      text(24, 20, "Página " + (index + 1) + " de " + pages.length),
    ].join("\n");
    const pageNumber = objects.length + 1;
    pageRefs.push(pageNumber + " 0 R");
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 308 ${height}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${pageNumber + 1} 0 R >>`,
      `<< /Length ${Buffer.byteLength(drawing)} >>\nstream\n${drawing}\nendstream`,
    );
  });
  objects[1] = `<< /Type /Pages /Count ${pages.length} /Kids [${pageRefs.join(" ")}] >>`;
  let output = "%PDF-1.4\n";
  const offsets = ["0000000000 65535 f \n"];
  objects.forEach((object, index) => {
    offsets.push(
      String(Buffer.byteLength(output)).padStart(10, "0") + " 00000 n \n",
    );
    output += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = Buffer.byteLength(output);
  output += `xref\n0 ${offsets.length}\n${offsets.join("")}trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(output);
};
