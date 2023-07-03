const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const noteInfo = require("./db/db.json");
const PORT = process.env.PORT || 3331;

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  res.json(noteInfo);
});

app.post("/api/notes", (req, res) => {
  const newNote = {
    id: uuidv4(),
    ...req.body,
  };

  noteInfo.push(newNote);

  fs.writeFile("./db/db.json", JSON.stringify(noteInfo), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    console.info(`${req.method} request received to add a note`);
    res.json(noteInfo);
  });
});


app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});