import { faker } from "@faker-js/faker";
import { Reservation } from "../entities/reservation.entity";
import { User } from "../entities/user.entity";
import { Worker } from "../entities/worker.entity";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { Service } from "../entities/service.entity";

export class MainSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    console.log("Seeding...");

    const userFactory = factoryManager.get(User);
    const users = await userFactory.saveMany(10);

    const serviceFactory = factoryManager.get(Service);
    const services = await serviceFactory.saveMany(10); // Just one time!

    const workerFactory = factoryManager.get(Worker);
    const workers = await Promise.all(
      Array.from({ length: 50 }).map(() =>
        workerFactory.make({
          services: faker.helpers.arrayElements(services, { min: 1, max: 3 }),
        })
      )
    );

    const workerRepo = dataSource.getRepository(Worker);
    await workerRepo.save(workers);

    const reservationFactory = factoryManager.get(Reservation);
    const reservations = await Promise.all(
      Array.from({ length: 50 }).map(() =>
        reservationFactory.make({
          client: faker.helpers.arrayElement(users),
          worker: faker.helpers.arrayElement(workers),
        })
      )
    );

    const reservationRepo = dataSource.getRepository(Reservation);
    await reservationRepo.save(reservations);

    console.log("✅ Seeding complete!");
  }
}
