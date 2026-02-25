import { Get, Param, Post, Patch, Body, JsonController, NotFoundError, BadRequestError, Delete } from 'routing-controllers';
import UserItem from '../types/UserItem';
import DbService from '../services/DbService';
import { CreateUserData } from '../validators/CreateUserData';
import { UpdateUserData } from '../validators/UpdateUserData';
import { plainToInstance } from 'class-transformer';
@JsonController("/users")
export class UserController {
    @Get("/")
    getUsers() {
        try {
            const { users } = DbService.getDb();
            return { data: users }
        } catch (err) {
            throw new BadRequestError(String(err));
        }
    }
    @Get("/:id")
    getUserById(@Param("id") id: number) {
        try {
            const { users } = DbService.getDb();
            const userIndex = users.findIndex((user: UserItem) => user.id == Number(id))
            if (userIndex < 0) { throw new NotFoundError(`cannot find user by id:${id}`) }
            return users[userIndex];
        } catch (err) {
            throw new BadRequestError(String(err));
        }
    }
    @Post("/")
    addUser(@Body({ validate: true }) userData: CreateUserData) {
        try {
            const parsedDB = DbService.getDb();
            let { index, users } = parsedDB;
            users.push({ id: index++, ...userData });
            DbService.writeToDb({ index, users });
            return { user: users[users.length - 1] };

        } catch (err) {
            throw new BadRequestError(String(err));
        }
    }



    @Patch("/:id")
    changeUser(@Param("id") id: number, @Body() data: UpdateUserData) {
        try {
            const userData = plainToInstance(UpdateUserData, data, {
                excludeExtraneousValues: true
            });
            const parsedDB = DbService.getDb();
            const { users } = parsedDB;
            const userIndex = users.findIndex((user: UserItem) => user.id == Number(id));
            if (userIndex > -1) {
                for (let key of Object.keys(userData) as (keyof UpdateUserData)[]) {
                    if (userData[key] !== undefined) {
                        users[key] = userData[key];
                    }
                }
                DbService.writeToDb({ ...parsedDB, users });
                return { changed: users[userIndex], updatedUsersList: users };
            }
            else {
                throw new NotFoundError(`cannot find user by id:${id}`);
            }
        } catch (err) {
            throw new BadRequestError(String(err));
        }
    }
    @Delete("/:id")
    deleteUserById(@Param("id") id: number) {
        try {
            const parsedDB = DbService.getDb();
            const { users } = parsedDB;
            const userIndex = users.findIndex((user: any) => user.id == id);
            if (userIndex > -1) {
                const deletedUser = users.splice(userIndex, 1);
                DbService.writeToDb({ ...parsedDB, users });
                return { deletedUser, updatedUsersList: users };
            }
            else {
                throw new NotFoundError(`cannot find user by id:${id}`);
            }

        } catch (err) {
            throw new BadRequestError(String(err));
        }
    }
}

