import fastify, { FastifyInstance } from "fastify";
import UserController from "./controllers/UserController";
import CategoryController from "./controllers/CategoryController";
import auth_middleware from "./middleware/auth_middleware";
const app = fastify();

async function user_routes(app: FastifyInstance) {
  app.get("/users",{ preHandler: auth_middleware },UserController.listOfUsers);
  app.post("/user", /*{ preHandler: auth_middleware },*/ UserController.create);
  app.get("/user/:name",{ preHandler: auth_middleware }, UserController.findUserByName);
  app.get("/user/type/:type_id",{ preHandler: auth_middleware },UserController.findUserByTypeId);
  app.put("/user", { preHandler: auth_middleware }, UserController.edit);
  app.delete("/user", { preHandler: auth_middleware }, UserController.remove);
  app.post("/auth", UserController.auth);
  app.post("/recovery",UserController.recovery);
  app.put("/reset/password",UserController.resetPassword);
}
async function category_routes(app: FastifyInstance){
  app.post("/category", { preHandler: auth_middleware }, CategoryController.create);
  app.get("/categories", { preHandler: auth_middleware }, CategoryController.listOfCategory);
  app.get("/category/:id", { preHandler: auth_middleware }, CategoryController.findById);
  app.get("/category/name/:name", { preHandler: auth_middleware }, CategoryController.findByName);
  app.put("/category", { preHandler: auth_middleware }, CategoryController.edit);
  app.delete("/category", { preHandler: auth_middleware }, CategoryController.remove);
}

export {user_routes, category_routes}