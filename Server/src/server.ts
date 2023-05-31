import fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import ip from "ip";
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { SwaggerTheme } from 'swagger-themes'
import { supplier_routes } from "./routes/supplier_routes";
import { category_routes } from "./routes/category_routes";
import { product_routes } from "./routes/product_routes";
import { user_routes } from "./routes/users_routes";
import { userSchemas } from "./routes/user.schema";
import { batch_routes } from "./routes/batch_routes";

dotenv.config();

const app = fastify();
const port: number = Number(process.env.PORT);

await app.register(swagger, {
  openapi: {}
})
app.register(swaggerUi, {
  theme:{
    css:[
      {filename: 'theme.css', content: new SwaggerTheme('v3').getBuffer('dark')}
    ],
  }
})
app.register(cors, {
  origin: "*",
});

//app.register(rotasCliente);
app.register(supplier_routes);
app.register(category_routes);
app.register(product_routes);
app.register(user_routes);
app.register(batch_routes);


const start = async () => {
  try {
    for(const schema of [...userSchemas]){
      app.addSchema(schema);
    }
    await app.listen({ port: port, host: ip.address() });
    console.log(`Served at ${ip.address()}:${port}`);
  } catch (error) {
    console.log(error);
    app.log.error(error);
    process.exit(1);
  }
};

start();
