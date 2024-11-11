import dotenv from "dotenv"
import fastify from "fastify";
import {
  user_routes,
  category_routes,
  supplier_routes,
  product_routes,
  batch_routes,
  preuser_routes,
  login_routes,
  fill_routes,
} from "./routes";
import cors from "@fastify/cors";

dotenv.config();

const app = fastify();

app.register(cors, {
  origin: "*",
});

app.register(batch_routes)
app.register(user_routes)
app.register(category_routes)
app.register(supplier_routes)
app.register(product_routes)
app.register(preuser_routes)
app.register(login_routes)
app.register(fill_routes);



export default app;
