import { faker, Faker } from "@faker-js/faker";
import { User } from "../entities/user.entity";
import { setSeederFactory } from "typeorm-extension";

export const UserFactory = setSeederFactory(User,( x ) =>
     {
        const user = new User();
        user.name = faker.person.firstName();
        user.email = faker.internet.email();
        user.location = faker.location.city();
        user.phone = faker.phone.number();

        return user;
    })