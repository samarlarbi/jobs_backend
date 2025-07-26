"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pgConfig = void 0;
const dotenv = require("dotenv");
dotenv.config();
exports.pgConfig = {
    type: 'postgres',
    url: process.env.DATABASE,
    port: 5432,
    entities: [__dirname + "/**/*.entity.{ts,js}"],
    synchronize: true,
};
//# sourceMappingURL=dbconfig.js.map