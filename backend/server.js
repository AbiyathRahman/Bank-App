// backend/server.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const { initMongo, getClient } = require("./db/conn");

// Route modules (you already have these files)
const registerRoutes = require("./routes/register");
const loginRoutes = require("./routes/login");
const logoutRoutes = require("./routes/logout");
const homeRoutes = require("./routes/home");
const accountsRoutes = require("./routes/accounts");
const transactionsRoutes = require("./routes/transaction");
const summaryRoutes = require("./routes/summary");

(async () => {
  // 1) Connect to MongoDB BEFORE starting the server
  await initMongo();

  // 2) Create app
  const app = express();

  // 3) Middleware
  app.use(
    cors({
      origin: true, // allows Vite (5173) during dev
      credentials: true,
    })
  );
  app.use(express.json());

  // 4) Sessions backed by MongoDB
  //    IMPORTANT: give connect-mongo a REAL client (fixes "Cannot init Client" error)
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "dev-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: "lax", // for HTTPS + cross-site use 'none' and also set secure: true
        // secure: true,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      },
      store: MongoStore.create({
        client: getClient(),
        dbName: process.env.DB_NAME || "test",
        stringify: false,
      }),
    })
  );

  // 5) Routes
  app.use("/", homeRoutes);
  app.use("/", registerRoutes);
  app.use("/", loginRoutes);
  app.use("/", logoutRoutes);
  app.use("/", accountsRoutes);
  app.use("/", transactionsRoutes);
  app.use("/", summaryRoutes);

  // Health check
  app.get("/health", (_req, res) => res.json({ ok: true }));

  // 6) Start server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
    console.log(`(Vite dev server is usually http://localhost:5173)`);
  });
})().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
