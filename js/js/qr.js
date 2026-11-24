/* Generador de códigos QR sin dependencias (modo byte, corrección L/M).
   Uso: FoodQR.svg("https://...") devuelve un <svg> listo para insertar. */
(function (root) {
  "use strict";
  const ECC = {
    L: {
      fmt: 1,
      cw: [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
      blocks: [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
    },
    M: {
      fmt: 0,
      cw: [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
      blocks: [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
    },
  };
  const gfMul = (x, y) => {
    let z = 0;
    for (let i = 7; i >= 0; i--) {
      z = (z << 1) ^ ((z >>> 7) * 0x11d);
      z ^= ((y >>> i) & 1) * x;
    }
    return z;
  };
  function rsDivisor(degree) {
    const result = new Array(degree).fill(0);
    result[degree - 1] = 1;
    let r = 1;
    for (let i = 0; i < degree; i++) {
      for (let j = 0; j < result.length; j++) {
        result[j] = gfMul(result[j], r);
        if (j + 1 < result.length) result[j] ^= result[j + 1];
      }
      r = gfMul(r, 2);
    }
    return result;
  }
  function rsRemainder(data, divisor) {
    const result = divisor.map(() => 0);
    for (const b of data) {
      const factor = b ^ result.shift();
      result.push(0);
      divisor.forEach((coef, i) => (result[i] ^= gfMul(coef, factor)));
    }
    return result;
  }
  function rawModules(ver) {
    let result = (16 * ver + 128) * ver + 64;
    if (ver >= 2) {
      const n = Math.floor(ver / 7) + 2;
      result -= (25 * n - 10) * n - 55;
      if (ver >= 7) result -= 36;
    }
    return result;
  }
  const dataCodewords = (ver, ec) =>
    Math.floor(rawModules(ver) / 8) - ec.cw[ver] * ec.blocks[ver];
  function alignPositions(ver) {
    if (ver === 1) return [];
    const n = Math.floor(ver / 7) + 2,
      size = ver * 4 + 17,
      step = ver === 32 ? 26 : Math.ceil((ver * 4 + 4) / (n * 2 - 2)) * 2,
      result = [6];
    for (let pos = size - 7; result.length < n; pos -= step)
      result.splice(1, 0, pos);
    return result;
  }
  function penalty(m, size) {
    let r = 0,
      dark = 0;
    for (let pass = 0; pass < 2; pass++)
      for (let a = 0; a < size; a++) {
        const line = [];
        for (let b = 0; b < size; b++) line.push(pass ? m[b][a] : m[a][b]);
        let run = 1;
        for (let b = 1; b < size; b++) {
          if (line[b] === line[b - 1]) {
            run++;
            if (run === 5) r += 3;
            else if (run > 5) r++;
          } else run = 1;
        }
        const s = line.map((v) => (v ? "1" : "0")).join("");
        for (let k = 0; k + 11 <= s.length; k++) {
          const t = s.substr(k, 11);
          if (t === "10111010000" || t === "00001011101") r += 40;
        }
      }
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) {
        if (m[y][x]) dark++;
        if (
          x < size - 1 &&
          y < size - 1 &&
          m[y][x] === m[y][x + 1] &&
          m[y][x] === m[y + 1][x] &&
          m[y][x] === m[y + 1][x + 1]
        )
          r += 3;
      }
    const total = size * size;
    r += (Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1) * 10;
    return r;
  }
  function matrix(text, level) {
    const ec = ECC[level] || ECC.M,
      bytes = Array.from(new TextEncoder().encode(String(text)));
    let ver = 1;
    for (; ver <= 40; ver++) {
      const lenBits = ver <= 9 ? 8 : 16;
      if (4 + lenBits + bytes.length * 8 <= dataCodewords(ver, ec) * 8) break;
    }
    if (ver > 40) throw Error("El texto es demasiado largo para un QR.");
    const bits = [],
      put = (value, len) => {
        for (let i = len - 1; i >= 0; i--) bits.push((value >>> i) & 1);
      };
    put(4, 4);
    put(bytes.length, ver <= 9 ? 8 : 16);
    bytes.forEach((b) => put(b, 8));
    const capacity = dataCodewords(ver, ec) * 8;
    put(0, Math.min(4, capacity - bits.length));
    put(0, (8 - (bits.length % 8)) % 8);
    for (let pad = 0xec; bits.length < capacity; pad ^= 0xec ^ 0x11)
      put(pad, 8);
    const data = [];
    for (let i = 0; i < bits.length; i += 8) {
      let v = 0;
      for (let j = 0; j < 8; j++) v = (v << 1) | bits[i + j];
      data.push(v);
    }
    // Bloques + corrección de errores
    const numBlocks = ec.blocks[ver],
      eccLen = ec.cw[ver],
      raw = Math.floor(rawModules(ver) / 8),
      shortBlocks = numBlocks - (raw % numBlocks),
      shortLen = Math.floor(raw / numBlocks),
      divisor = rsDivisor(eccLen),
      blocks = [];
    for (let i = 0, k = 0; i < numBlocks; i++) {
      const len = shortLen - eccLen + (i < shortBlocks ? 0 : 1),
        chunk = data.slice(k, k + len);
      k += len;
      const ecc = rsRemainder(chunk, divisor);
      if (i < shortBlocks) chunk.push(0);
      blocks.push(chunk.concat(ecc));
    }
    const all = [];
    for (let i = 0; i < blocks[0].length; i++)
      blocks.forEach((block, j) => {
        if (i !== shortLen - eccLen || j >= shortBlocks) all.push(block[i]);
      });
    // Matriz
    const size = ver * 4 + 17,
      m = Array.from({ length: size }, () => new Array(size).fill(false)),
      fn = Array.from({ length: size }, () => new Array(size).fill(false)),
      setFn = (x, y, dark) => {
        m[y][x] = dark;
        fn[y][x] = true;
      },
      inside = (x, y) => x >= 0 && y >= 0 && x < size && y < size;
    for (let i = 0; i < size; i++) {
      setFn(6, i, i % 2 === 0);
      setFn(i, 6, i % 2 === 0);
    }
    for (const [cx, cy] of [
      [3, 3],
      [size - 4, 3],
      [3, size - 4],
    ])
      for (let dy = -4; dy <= 4; dy++)
        for (let dx = -4; dx <= 4; dx++) {
          const dist = Math.max(Math.abs(dx), Math.abs(dy));
          if (inside(cx + dx, cy + dy))
            setFn(cx + dx, cy + dy, dist !== 2 && dist !== 4);
        }
    const pos = alignPositions(ver);
    pos.forEach((px, i) =>
      pos.forEach((py, j) => {
        if (
          (i === 0 && j === 0) ||
          (i === 0 && j === pos.length - 1) ||
          (i === pos.length - 1 && j === 0)
        )
          return;
        for (let dy = -2; dy <= 2; dy++)
          for (let dx = -2; dx <= 2; dx++)
            setFn(px + dx, py + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
      }),
    );
    const bit = (v, i) => ((v >>> i) & 1) !== 0;
    function drawFormat(mask) {
      const d = (ec.fmt << 3) | mask;
      let rem = d;
      for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
      const f = ((d << 10) | rem) ^ 0x5412;
      for (let i = 0; i <= 5; i++) setFn(8, i, bit(f, i));
      setFn(8, 7, bit(f, 6));
      setFn(8, 8, bit(f, 7));
      setFn(7, 8, bit(f, 8));
      for (let i = 9; i < 15; i++) setFn(14 - i, 8, bit(f, i));
      for (let i = 0; i < 8; i++) setFn(size - 1 - i, 8, bit(f, i));
      for (let i = 8; i < 15; i++) setFn(8, size - 15 + i, bit(f, i));
      setFn(8, size - 8, true);
    }
    drawFormat(0);
    if (ver >= 7) {
      let rem = ver;
      for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
      const v = (ver << 12) | rem;
      for (let i = 0; i < 18; i++) {
        const a = size - 11 + (i % 3),
          b = Math.floor(i / 3);
        setFn(a, b, bit(v, i));
        setFn(b, a, bit(v, i));
      }
    }
    let idx = 0;
    for (let right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (let vert = 0; vert < size; vert++)
        for (let j = 0; j < 2; j++) {
          const x = right - j,
            y = ((right + 1) & 2) === 0 ? size - 1 - vert : vert;
          if (!fn[y][x] && idx < all.length * 8) {
            m[y][x] = bit(all[idx >>> 3], 7 - (idx & 7));
            idx++;
          }
        }
    }
    const masks = [
      (x, y) => (x + y) % 2 === 0,
      (x, y) => y % 2 === 0,
      (x, y) => x % 3 === 0,
      (x, y) => (x + y) % 3 === 0,
      (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
      (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
      (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
      (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
    ];
    const applyMask = (k) => {
      for (let y = 0; y < size; y++)
        for (let x = 0; x < size; x++)
          if (!fn[y][x] && masks[k](x, y)) m[y][x] = !m[y][x];
    };
    let best = 0,
      bestScore = Infinity;
    for (let k = 0; k < 8; k++) {
      applyMask(k);
      drawFormat(k);
      const score = penalty(m, size);
      if (score < bestScore) {
        bestScore = score;
        best = k;
      }
      applyMask(k);
    }
    applyMask(best);
    drawFormat(best);
    return m;
  }
  function svg(text, level, border = 4) {
    const m = matrix(text, level),
      n = m.length + border * 2;
    let d = "";
    m.forEach((row, y) =>
      row.forEach((dark, x) => {
        if (dark) d += "M" + (x + border) + " " + (y + border) + "h1v1h-1z";
      }),
    );
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' +
      n +
      " " +
      n +
      '" width="100%" height="100%" shape-rendering="crispEdges" role="img" aria-label="Código QR"><rect width="' +
      n +
      '" height="' +
      n +
      '" fill="#ffffff"/><path d="' +
      d +
      '" fill="#000000"/></svg>'
    );
  }
  const api = { matrix, svg };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.FoodQR = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
