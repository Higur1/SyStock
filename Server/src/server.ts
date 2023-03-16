import fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import ip from "ip";
//import { rotasCliente } from "./rotasCliente";
import { supplier_routes } from "./routes/supplier_routes";
import { category_routes } from "./routes/category_routes";
import { product_routes } from "./routes/product_routes";
import { user_routes } from "./routes/user_routes";

dotenv.config();

const app = fastify();
const port: number = Number(process.env.PORT);

app.register(cors, {
  origin: "*",
});

//Swagger config
const Swagger = require('./config/swaggerOptions');
app.register(require('fastify-swagger'), Swagger.options);

//app.register(rotasCliente);
app.register(supplier_routes);
app.register(category_routes);
app.register(product_routes);
app.register(user_routes);

const start = async () => {
  try {
    await app.listen({ port: port, host: ip.address() });
    app.swagger();
    console.log(`Served at ${ip.address()}:${port}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
