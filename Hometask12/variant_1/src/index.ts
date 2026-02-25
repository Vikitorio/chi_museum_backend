import fs from "fs";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
const dbPath = "./src/fakedb/users.json";
const dbInitialize = () => {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(dbPath)) {
        const initial = { index: 0, users: [] };
        fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2), "utf-8");
    }
}

const app = express();
app.use(bodyParser.json());
dbInitialize();

interface DbStructure {
    index: number;
    users: UserItem[];

}
interface UserItem {
    id: number;
    name: string;
    email: string;
}


const writeToDb = (data: DbStructure) => {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}
const getDb = () => {
    return JSON.parse(fs.readFileSync(dbPath, { encoding: "utf-8" }));
}


app.get("/test", (req, res) => {
    res.send("test")
})
app.get("/", (req, res) => {
    res.send({ author: "Viktor Mychalchevskyi", description: "Developed during CHI course" })
})
app.get("/users", (req, res) => {
    try {
        const { users } = getDb();
        res.send({ data: users })
    } catch (err) {
        res.status(500).send(err);
    }

})

app.get("/users/:id", (req, res) => {
    const { id } = req.params;
    try {
        const { users } = getDb();
        const userIndex = users.findIndex((user: UserItem) => user.id == Number(id))
        if (userIndex < 0) { return res.status(404).send(`User id:${id} not found`); }
        res.send(users[userIndex]);
    } catch (err) {
        res.status(500).send(err);
    }
})

app.post("/users", (req, res) => {
    const { userData } = req.body;
    try {
        const parsedDB = getDb();
        let { index, users } = parsedDB;
        users.push({ id: index++, name: userData.name });
        writeToDb({ index, users });
        res.send({ user: users[users.length - 1] });

    } catch (err) {
        res.status(500).send(err);
    }
})

app.patch("/users/:id", (req, res) => {
    const data = req.body;
    const { id } = req.params;
    try {
        const parsedDB = getDb();
        const { users } = parsedDB;
        const userIndex = users.findIndex((user: UserItem) => user.id == Number(id));
        if (userIndex > -1) {
            for (let key in data) {
                if (key == "id") continue;
                users[userIndex][key] = data[key];
            }
            writeToDb({ ...parsedDB, users });
            res.send({ changed: users[userIndex], updatedUsersList: users });
        }
        else {
            return res.status(404).send({ err: `cannot find user by id:${id} ` });
        }
    } catch (err) {
        res.status(500).send(err);
    }
})

app.delete("/users/:id", (req, res) => {
    const { id } = req.params;
    try {
        const parsedDB = getDb();
        const { users } = parsedDB;
        const userIndex = users.findIndex((user: any) => user.id == id);
        if (userIndex > -1) {
            const deletedUser = users.splice(userIndex, 1);
            writeToDb({ ...parsedDB, users });
            res.send({ deletedUser, updatedUsersList: users });
        }
        else {
            return res.status(404).send({ err: `cannot find user by id:${id}` });
        }

    } catch (err) {
        res.status(500).send(err);
    }
})

app.listen(3000, () => {
    console.log("listen port 3000");
})