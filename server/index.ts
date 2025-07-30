import express from "express";
import { registerRoutes } from "./routes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

(async () => {
  const server = await registerRoutes(app);
  
  const PORT = 5000;
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`[express] Server running on port ${PORT}`);
  });
})();