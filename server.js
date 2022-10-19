const express = require("express");
const path    = require("path");
var notes   = require("./db/db.json");
const app     = express();
const fs      = require("fs")
const PORT    = process.env.PORT || 3001;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function (req, res) {
    fs.readFile("./db/db.json", "utf8", (err, data)=>{
        if (err) {
            console.log(err)
        } else {
            res.json(JSON.parse(data))
        }
    })
});

app.post("/api/notes", function (req, res) { 
    req.body["id"] = notes.length+1;
    notes.push(req.body);
    console.log(notes)
    fs.writeFileSync("./db/db.json", JSON.stringify(notes))
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.delete("/api/notes/:id", function (req, res) {
    erase(req.params.id)
    fs.writeFileSync("./db/db.json", JSON.stringify(notes))
    res.json(JSON.stringify(notes))
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

function erase(id){
  let current = notes.filter(task => task.id != id);
  notes=current;
};

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);