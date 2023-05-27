import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import professorRoute from "./routes/professor.js";
import { DATABASE_URL } from "./env.js";
import { getFile } from "./grid.js";
import fs from "fs";

const __dirname = path.resolve();

dotenv.config({ path: __dirname + "/.env" });
const app = express();
const url = DATABASE_URL;
// console.log(DATABASE_URL)
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database Connected Successfully"))
  .catch((err) => console.log(err));

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
if (!fs.existsSync("/tmp/files")) {
  fs.mkdirSync("/tmp/files");
}

app.use(cors(corsOptions));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use("/professor", professorRoute);

app.use(express.static(path.join(__dirname, "client", "build")));
// app.use("/professor/file/",express.static(path.join(__dirname, "backend","files")))
app.get("/file", async (req, res) => {
  // removeDirectory()
  let fileName = req.query.fileName;
  res.sendFile(path.join("/tmp", "files", fileName));
});

app.get("/testHtml", async (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "test.html"));
});

app.get("/testDocx", async (req, res) => {
  res.sendFile(path.join(__dirname, "backend", "FFE Donor Letter.docx"));
});

app.get("/testPPt", async (req, res) => {
  res.sendFile(path.join(__dirname, "backend", "Bhopal Gas Tragedy.pptx"));
});

app.get("/testxl", async (req, res) => {
  res.sendFile(path.join(__dirname, "backend", "08.04.2023M.xlsx"));
});


const PORT = process.env.PORT || 8082;
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(PORT, console.log(`Server started on port ${PORT}`));
