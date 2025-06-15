const os = require("os");
const fs = require("fs");
const path = require("path");

function getLocalIp() {
  const nets = os.networkInterfaces();
  const privateRanges = [
    /^192\.168\./,
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[01])\./,
  ];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (
        net.family === "IPv4" &&
        !net.internal &&
        privateRanges.some((rgx) => rgx.test(net.address))
      ) {
        return net.address;
      }
    }
  }
  return "localhost";
}

const ip = getLocalIp();
const envPath = path.join(process.cwd(), ".env.local");
let content = "";

if (fs.existsSync(envPath)) {
  content = fs.readFileSync(envPath, "utf8");
  // Retire la ligne existante
  content = content.replace(/^NEXT_PUBLIC_HOST_IP=.*$/m, "");
  content = content.trim() + "\n";
}
content += `NEXT_PUBLIC_HOST_IP=${ip}\n`;

fs.writeFileSync(envPath, content, "utf8");

console.log(`✅ IP locale détectée : ${ip}`);
console.log(`Clé NEXT_PUBLIC_HOST_IP mise à jour dans .env.local`);
