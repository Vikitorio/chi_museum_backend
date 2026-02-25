import { Get, Param, Post, Patch, Body, JsonController, NotFoundError, BadRequestError, Delete } from 'routing-controllers';
import { CreateUserData } from '../validators/CreateUserData';
import { UpdateUserData } from '../validators/UpdateUserData';
import { plainToInstance } from 'class-transformer';
import { User } from '../entities/User';
import { AppDataSource } from '../ormconfig';
@JsonController("/users")
export class UserController {
    @Get("/")
    async getUsers() {
        try {
            const users = await AppDataSource.getRepository(User).find();
            return { data: users }
        } catch (err) {
            throw new BadRequestError(String(err));
        }
    }
    @Get("/:id")
    async getUserById(@Param("id") id: number) {
        try {
            const user = await AppDataSource.getRepository(User).findOneBy({ id: id });
            if (!user) { throw new NotFoundError(`cannot find user by id:${id}`) }
            return user;
        } catch (err) {
            throw new BadRequestError(String(err));
        }
    }
    @Post("/")
    async addUser(@Body({ validate: true }) userData: CreateUserData) {
        try {
            const userRepo = AppDataSource.getRepository(User);
            const userByEmail = await userRepo.findOneBy({ email: userData.email });
            if (userByEmail) { throw new BadRequestError("User with this email alredy exist") }
            const newUser = await userRepo.create(userData);
            userRepo.save(newUser);
            return { newUser };
        } catch (err) {
            throw new BadRequestError(String(err));
        }
    }

    @Patch("/:id")
    async changeUser(@Param("id") id: number, @Body() data: UpdateUserData) {
        try {
            const userData = plainToInstance(UpdateUserData, data, {
                excludeExtraneousValues: true
            });
            const userRepo = AppDataSource.getRepository(User);
            const userByIndex = await userRepo.findOneBy({ id: id });
            if (!userByIndex) { throw new NotFoundError(`cannot find user by id:${id}`); }
            if (data.email) {
                const userByEmail = await userRepo.findOneBy({ email: userData.email });
                if (userByEmail && userByEmail.id !== id) { throw new BadRequestError("User with this email alredy exist") }
            }
            userRepo.merge(userByIndex, userData);
            const updatedUser = await userRepo.save(userByIndex);
            return updatedUser;
        } catch (err) {
            throw new BadRequestError(String(err));
        }
    }
    @Delete("/:id")
    async deleteUserById(@Param("id") id: number) {
        try {
            const userRepo = AppDataSource.getRepository(User);
            const userById = await userRepo.findOneBy({ id: id });
            if (!userById) { throw new NotFoundError(`cannot find user by id:${id}`); }
            await userRepo.delete(userById.id);
            return { deleted: userById };

        } catch (err) {
            throw new BadRequestError(String(err));
        }


    }
}


