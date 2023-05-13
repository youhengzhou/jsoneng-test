// server.js
const express = require("express");
const cors = require("cors");
const JDB = require("jsoneng");
const app = express();
const jdb = new JDB("./database");

app.use(cors());
app.use(express.json());

// Initialize 'notes' directory on server startup
jdb.create({}, "notes").catch((err) => console.error(err));

app.post("/create", async (req, res) => {
    const { data, dir } = req.body;
    console.log(req.body);
    const currentData = await jdb.read(dir);
    const updatedData = { ...currentData, ...data };
    await jdb.create(updatedData, dir);
    res.sendStatus(200);
});

app.post("/update", async (req, res) => {
    const { data, dir } = req.body;
    await jdb.update(data, dir);
    res.sendStatus(200);
});

app.post("/patch", async (req, res) => {
    const { data, dir } = req.body;
    await jdb.patch(data, dir);
    res.sendStatus(200);
});

app.delete("/delete", async (req, res) => {
    const { dir } = req.body;
    await jdb.delete(dir);
    res.sendStatus(200);
});

app.get("/read", async (req, res) => {
    const { dir } = req.query;
    const data = await jdb.read(dir);
    res.json(data);
});

app.listen(3000, () => console.log("Server listening on port 3000"));
