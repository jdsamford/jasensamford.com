// Encrypts/decrypts the Last Waltz track list so it never sits in the repo as plain text.
//
//   node scripts/lastwaltz-data.js decrypt <password>   writes scripts/lastwaltz-tracks.json (gitignored)
//   node scripts/lastwaltz-data.js encrypt <password>   rewrites js/setlist-data.js from that JSON
//
// The browser side (js/setlist.js) derives the same key from the password the visitor types.
const fs = require("fs");
const path = require("path");
const { webcrypto: crypto } = require("crypto");

const root = path.resolve(__dirname, "..");
const jsonPath = path.join(__dirname, "lastwaltz-tracks.json");
const dataPath = path.join(root, "js/setlist-data.js");
const ITERATIONS = 250000;

const b64 = (buf) => Buffer.from(buf).toString("base64");
const unb64 = (s) => new Uint8Array(Buffer.from(s, "base64"));

async function deriveKey(password, salt) {
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encrypt(password) {
  const tracks = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const data = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(JSON.stringify(tracks)));
  const blob = { iterations: ITERATIONS, salt: b64(salt), iv: b64(iv), data: b64(data) };
  fs.writeFileSync(
    dataPath,
    "// Encrypted Last Waltz track list. Edit with scripts/lastwaltz-data.js, not by hand.\n" +
      "window.SETLIST_DATA = " + JSON.stringify(blob, null, 2) + ";\n"
  );
  console.log(`Encrypted ${tracks.length} tracks into js/setlist-data.js`);
}

async function decrypt(password) {
  const src = fs.readFileSync(dataPath, "utf-8");
  const blob = JSON.parse(src.slice(src.indexOf("{"), src.lastIndexOf("}") + 1));
  const key = await deriveKey(password, unb64(blob.salt));
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(blob.iv) }, key, unb64(blob.data));
  fs.writeFileSync(jsonPath, JSON.stringify(JSON.parse(new TextDecoder().decode(plain)), null, 2) + "\n");
  console.log("Decrypted to scripts/lastwaltz-tracks.json");
}

const [cmd, password] = process.argv.slice(2);
if (!password || !["encrypt", "decrypt"].includes(cmd)) {
  console.error("Usage: node scripts/lastwaltz-data.js <encrypt|decrypt> <password>");
  process.exit(1);
}
(cmd === "encrypt" ? encrypt : decrypt)(password.trim().toLowerCase()).catch((e) => {
  console.error(cmd === "decrypt" ? "Wrong password or corrupted data." : e.message);
  process.exit(1);
});
