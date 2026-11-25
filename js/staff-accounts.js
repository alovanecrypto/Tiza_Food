const { pbkdf2, timingSafeEqual } = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { promisify } = require("node:util");

const dataDir = process.env.TIZA_DATA_DIR
  ? path.resolve(process.env.TIZA_DATA_DIR)
  : path.join(__dirname, "../data");
const file = path.join(dataDir, "staff.json");
const accounts = fs.existsSync(file)
  ? JSON.parse(fs.readFileSync(file, "utf8")).accounts
  : [];
const derive = promisify(pbkdf2);
const attempts = new Map();
const find = (email) =>
  accounts.find(
    (account) =>
      account.email ===
      String(email || "")
        .trim()
        .toLowerCase(),
  );

async function authenticate(body) {
  const account = find(body.email || body.username);
  if (!account) return null;
  const password = body.password;
  if (
    typeof password !== "string" ||
    password.length < 8 ||
    password.length > 256
  )
    throw Error("Correo o contraseña incorrectos.");
  const now = Date.now();
  let attempt = attempts.get(account.email);
  if (!attempt || attempt.until <= now) {
    attempt = { count: 0, until: now + 900000 };
    attempts.set(account.email, attempt);
  }
  if (attempt.count >= 5)
    throw Error("Espera 15 minutos antes de volver a intentar.");
  attempt.count++;
  const actual = await derive(password, account.salt, 100000, 32, "sha256");
  const expected = Buffer.from(account.passwordHash, "hex");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
    throw Error("Correo o contraseña incorrectos.");
  if (attempts.get(account.email) === attempt) attempts.delete(account.email);
  if (body.staffRole && body.staffRole !== account.role)
    throw Error("Esta cuenta no tiene permiso para este panel.");
  const { salt, passwordHash, ...user } = account;
  return user;
}

module.exports = { accounts, find, authenticate };
