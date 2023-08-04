import fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import ip from "ip";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { SwaggerTheme } from "swagger-themes";
import { user_routes } from "./routes/user/users_routes";
import { user_recovery } from "./routes/user/user_recovery";
import { categories_routes } from "./routes/category/categories_routes";

dotenv.config();

const app = fastify();
const port: number = Number(process.env.PORT);

await app.register(swagger, {
  openapi: {},
});
app.register(swaggerUi, {
  theme: {
    css: [
      {
        filename: "theme.css",
        content: new SwaggerTheme("v3").getBuffer("dark"),
      },
    ],
  },
});
app.register(cors, {
  origin: "*",
});

//routes
app.register(user_routes);
app.register(user_recovery);
app.register(categories_routes);

const start = async () => {
  try {
    await app.listen({ port: port, host: ip.address() });
    console.log(`Served at ${ip.address()}:${port}`);
  } catch (error) {
    console.log(error);
    app.log.error(error);
    process.exit(1);
  }
};

start();