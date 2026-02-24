import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "data.json");

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper to read DB
  const readDB = async () => {
    try {
      const data = await fs.readFile(DB_PATH, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return { watchlist: [], portfolio: [] };
    }
  };

  // Helper to write DB
  const writeDB = async (data: any) => {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
  };

  // API Routes
  app.get("/api/watchlist", async (req, res) => {
    const db = await readDB();
    res.json(db.watchlist);
  });

  app.post("/api/watchlist", async (req, res) => {
    const { item } = req.body;
    const db = await readDB();
    if (!db.watchlist.find((i: any) => i.id === item.id)) {
      db.watchlist.push(item);
      await writeDB(db);
    }
    res.json(db.watchlist);
  });

  app.delete("/api/watchlist/:id", async (req, res) => {
    const { id } = req.params;
    const db = await readDB();
    // GLITCH 1: Logic error - this will keep only the item clicked and delete everything else
    db.watchlist = db.watchlist.filter((i: any) => i.id === id);
    await writeDB(db);
    res.json(db.watchlist);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
