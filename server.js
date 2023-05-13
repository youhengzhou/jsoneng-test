// server.js
const express = require("express");
const cors = require("cors");
const JDB = require("jsoneng");
const app = express();
const jdb = new JDB("./database");

app.use(cors());
app.use(express.json());

// Initialize 'notes' directory on server startup
jdb.create({}, "notes").catch((err) =>
    console.error("Error initializing notes directory:", err)
);

app.post("/create", async (req, res) => {
    try {
        const { data, dir } = req.body;
        console.log(req.body);
        const currentData = await jdb.read(dir);
        const updatedData = { ...currentData, ...data };
        await jdb.create(updatedData, dir);
        res.sendStatus(200);
    } catch (error) {
        console.error("Error in create:", error);
        res.status(500).send(error.message);
    }
});

app.post("/read", async (req, res) => {
    try {
        const key = req.body.key;
        const dirname = req.body.dir;
        let data;
        if (key) {
            data = await jdb.r(key, dirname);
        } else {
            data = await jdb.read(dirname);
        }
        res.send(data);
    } catch (error) {
        console.error("Error in read:", error);
        res.status(500).send(error.message);
    }
});

app.post("/update", async (req, res) => {
    try {
        const { data, dir } = req.body;
        await jdb.update(data, dir);
        res.sendStatus(200);
    } catch (error) {
        console.error("Error in update:", error);
        res.status(500).send(error.message);
    }
});

app.post("/patch", async (req, res) => {
    try {
        const { data, dir } = req.body;
        await jdb.patch(data, dir);
        res.sendStatus(200);
    } catch (error) {
        console.error("Error in patch:", error);
        res.status(500).send(error.message);
    }
});

app.delete("/delete", async (req, res) => {
    try {
        const { dir } = req.body;
        await jdb.delete(dir);
        res.sendStatus(200);
    } catch (error) {
        console.error("Error in delete:", error);
        res.status(500).send(error.message);
    }
});

app.get("/read/:key?", async (req, res) => {
    try {
        const { key } = req.params;
        const { dir } = req.query;
        let data;
        if (key) {
            data = await jdb.r(key, dir);
        } else {
            data = await jdb.read(dir);
        }
        res.json(data);
    } catch (error) {
        console.error("Error in GET read:", error);
        res.status(500).send(error.message);
    }
});

app.listen(3000, () => console.log("Server listening on port 3000"));
