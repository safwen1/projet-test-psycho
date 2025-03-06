require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const { notFoundMiddleware, errorHandlerMiddleware } = require('./middleware/errorMiddleware');

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/", require("./routes"));

// Middleware pour les routes non trouvées (404)
app.use(notFoundMiddleware);

// Middleware de gestion des erreurs (doit être le dernier middleware)
app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server is running on Port : ${port}`);
});
