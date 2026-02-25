import "reflect-metadata";
import { createExpressServer } from "routing-controllers";
import { UserController } from "./controllers/UserController";
import { InfoController } from "./controllers/InfoController";
import { AppDataSource } from "./ormconfig";

const initializeDB = () => {
    AppDataSource.initialize();
}

const app = createExpressServer({
    controllers: [InfoController, UserController]
});

initializeDB();

app.listen(3000, () => {
    console.log("listen port http://localhost:3000/");
})