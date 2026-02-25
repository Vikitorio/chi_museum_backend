import "reflect-metadata";
import fs from "fs";
import { createExpressServer } from "routing-controllers";
import bodyParser from "body-parser";
import path from "path";
import { UserController } from "./controllers/UserController";
import { InfoController } from "./controllers/InfoController";
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

const app = createExpressServer({
    controllers: [InfoController, UserController]
});
app.use(bodyParser.json());
dbInitialize();


app.listen(3000, () => {
    console.log("listen port 3000");
})