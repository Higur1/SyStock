import fastify, { FastifyInstance } from "fastify";

import UserController from "./controllers/UserController";
import CategoryController from "./controllers/CategoryController";
import Supplier from "./models/Supplier";

import auth_middleware from "./middleware/auth_middleware";
import SupplierController from "./controllers/SupplierController";

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
};
async function category_routes(app: FastifyInstance){
  app.post("/category", { preHandler: auth_middleware }, CategoryController.create);
  app.get("/categories", { preHandler: auth_middleware }, CategoryController.listOfCategory);
  app.get("/category/:id", { preHandler: auth_middleware }, CategoryController.findById);
  app.get("/category/name/:name", { preHandler: auth_middleware }, CategoryController.findByName);
  app.put("/category", { preHandler: auth_middleware }, CategoryController.edit);
  app.delete("/category", { preHandler: auth_middleware }, CategoryController.remove);
};
async function supplier_routes(app: FastifyInstance){
  app.get("/suppliers", { preHandler: auth_middleware }, SupplierController.findAll);
  app.post("/supplier", { preHandler: auth_middleware }, SupplierController.create);
  app.get("/supplier/:id", { preHandler: auth_middleware }, SupplierController.findById);
  app.put("/supplier", { preHandler: auth_middleware }, SupplierController.update);
  app.delete("/supplier", { preHandler: auth_middleware }, SupplierController.delete);
  app.get("/supplier/batchs/:supplier_id", {preHandler: auth_middleware}, SupplierController.findBatchs);
};

export {user_routes, category_routes, supplier_routes}