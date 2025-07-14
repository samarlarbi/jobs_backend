import { PartialType } from "@nestjs/mapped-types";
import { CreateWorkerDto } from "./worker.dto";

export class UpdateWorkerDto extends PartialType(CreateWorkerDto){}