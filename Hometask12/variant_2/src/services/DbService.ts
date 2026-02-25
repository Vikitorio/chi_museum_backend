import fs from "fs";
import DbStructure from "../types/DbStructure";
import path from "path";
const dbPath = "./src/fakedb/users.json";

export default class DbService {
    static writeToDb = (data: DbStructure) => {
        const dir = path.dirname(dbPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    }
    static getDb = () => {
        return JSON.parse(fs.readFileSync(dbPath, { encoding: "utf-8" }));
    }
}
