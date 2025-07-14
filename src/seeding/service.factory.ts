import { faker } from "@faker-js/faker";
import { Service } from "../entities/service.entity";
import { setSeederFactory } from "typeorm-extension";

export const ServiceFactory = setSeederFactory(Service,( x ) =>
     {
        const service = new Service();
        service.title = faker.person.jobTitle();
       
        return service;
    })