import { pgConfig } from "../../dbconfig";
import { DataSource, DataSourceOptions } from "typeorm";
import { runSeeders, SeederOptions } from "typeorm-extension";
import { UserFactory } from "./user.factory";
import { WorkerFactory } from "./worker.factory";
import { ServiceFactory } from "./service.factory";
import { MainSeeder } from "./main.seeder";
import { ReservationFactory } from "./reservation.factory";

const options: DataSourceOptions & SeederOptions = {
    ...pgConfig,
    factories:[UserFactory,WorkerFactory,ReservationFactory, ServiceFactory],
    seeds:[MainSeeder]
}
const datasouce= new DataSource(options)
datasouce.initialize().then(async()=>{
    await datasouce.synchronize(true)
    await runSeeders(datasouce)
    process.exit()
})