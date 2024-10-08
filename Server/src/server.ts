import fastify from "fastify";
import cors from "@fastify/cors";

import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { SwaggerTheme } from "swagger-themes";
import {
  user_routes,
  category_routes,
  supplier_routes,
  product_routes,
  batch_routes,
  preuser_routes,
  login_routes,
} from "./routes";

const app = fastify();

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
app.register(category_routes, supplier_routes);
app.register(user_routes, product_routes);
app.register(batch_routes, preuser_routes);
app.register(login_routes);

export default app;
