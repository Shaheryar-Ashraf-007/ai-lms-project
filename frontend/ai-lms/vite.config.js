import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";

// Paths to self-signed certificates
const keyPath = path.resolve(__dirname, "certs/localhost-key.pem");
const certPath = path.resolve(__dirname, "certs/localhost.pem");

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    https: {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    },
    port: 5173, // optional, default is 5173
  },
});