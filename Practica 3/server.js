const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "db_peluqueria"
});

db.connect(err => {
    if (err) {
        console.error("Error al conectar con MySQL:", err);
        return;
    }
    console.log("Conectado a MySQL");
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/items", (req, res) => {
    db.query("SELECT * FROM peluqueria", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post("/create", (req, res) => {
    const { nombre, edad, especie, sexo } = req.body;
    db.query("INSERT INTO peluqueria (nombre, edad, especie, sexo) VALUES (?, ?, ?, ?)", 
        [nombre, edad, especie, sexo], err => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Registro agregado" });
    });
});

app.put("/update/:id", (req, res) => {
    const { nombre, edad, especie, sexo } = req.body;
    const { id } = req.params;
    db.query("UPDATE peluqueria SET nombre = ?, edad = ?, especie = ?, sexo = ? WHERE id = ?", 
        [nombre, edad, especie, sexo, id], err => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Registro actualizado" });
    });
});

app.delete("/delete/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM peluqueria WHERE id = ?", [id], err => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Registro eliminado" });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
