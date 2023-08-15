import fastify, { FastifyInstance } from "fastify";
import UserController from "./controllers/UserController";
import auth_middleware from "./middleware/auth_middleware";
const app = fastify();

export default async function user_routes(app: FastifyInstance) {
  app.get("/users",{ preHandler: auth_middleware }, UserController.listOfUsers);
  app.post("/user", /*{ preHandler: auth_middleware },*/ UserController.create);
  app.get("/user/:name",{ preHandler: auth_middleware },UserController.findUserByName);
  app.get("/user/type/:type_id", { preHandler: auth_middleware }, UserController.findUserByTypeId);
  app.put("/user", UserController.edit);
  app.delete("/user", UserController.remove);
  app.post("/auth", UserController.auth);
  app.post("/recovery", UserController.recovery);
  app.put("/reset/password", UserController.resetPassword);
}
