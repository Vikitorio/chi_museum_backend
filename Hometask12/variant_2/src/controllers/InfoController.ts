import { Get, JsonController } from "routing-controllers";

@JsonController("/")
export class InfoController {
    @Get("")
    getUsers() {
        return { author: "Viktor Mychalchevskyi", description: "Developed during CHI course" };
    }

}

