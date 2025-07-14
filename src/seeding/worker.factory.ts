import { faker } from "@faker-js/faker";
import { Worker } from "../entities/worker.entity";
import { setSeederFactory } from "typeorm-extension";

export const WorkerFactory = setSeederFactory(Worker,( x ) =>
     {
        const worker = new Worker();
        worker.name = faker.person.fullName();
        worker.email = faker.internet.email();
        worker.location = faker.location.city();
        worker.phone = faker.phone.number();
        
        return worker;

    })