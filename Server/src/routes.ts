import fastify, { FastifyInstance } from "fastify";

import auth_middleware from "./middleware/auth_middleware";

import UserController from "./controllers/UserController";
import CategoryController from "./controllers/CategoryController";
import SupplierController from "./controllers/SupplierController";
import ProductController from "./controllers/ProductController";
import BatchController from "./controllers/BatchController";
import PreUserController from "./controllers/PreUserController";

const app = fastify();

async function user_routes(app: FastifyInstance) {
  app.get("/users",{ preHandler: auth_middleware },UserController.listOfUsers);
  app.post("/user", /*{ preHandler: auth_middleware },*/ UserController.create);
  app.get("/user/:name",/*{ preHandler: auth_middleware },*/ UserController.findUserByName);
  app.get("/user/type/:type_id",/*{ preHandler: auth_middleware },*/UserController.findUserByTypeId);
  app.put("/user", /*{ preHandler: auth_middleware },*/ UserController.edit);
  app.delete("/user", /*{ preHandler: auth_middleware },*/ UserController.remove);
  app.post("/auth", UserController.auth);
  app.post("/recovery",UserController.recovery);
  app.put("/reset/password",UserController.resetPassword);
};
async function preuser_routes(app: FastifyInstance) {
  app.get("/preusers",/*{ preHandler: auth_middleware },*/PreUserController.listOfPreUsers);
  app.post("/preuser", PreUserController.create);
};
async function category_routes(app: FastifyInstance){
  app.post("/category", /*{ preHandler: auth_middleware },*/ CategoryController.create);
  app.get("/categories", /*{ preHandler: auth_middleware },*/ CategoryController.listOfCategory);
  app.get("/category/:id", /*{ preHandler: auth_middleware },*/ CategoryController.findById);
  //app.get("/category/name/:name", /*{ preHandler: auth_middleware },*/ CategoryController.findByName);
  app.put("/category", /*{ preHandler: auth_middleware },*/ CategoryController.edit);
  app.delete("/category", /*{ preHandler: auth_middleware },*/ CategoryController.remove);
};
async function supplier_routes(app: FastifyInstance){
  app.get("/suppliers", /*{ preHandler: auth_middleware },*/ SupplierController.findAll);
  app.post("/supplier", /*{ preHandler: auth_middleware },*/ SupplierController.create);
  app.get("/supplier/:id", /*{ preHandler: auth_middleware },*/ SupplierController.findById);
  app.get("/supplier/findByName/:name", /*{ preHandler: auth_middleware },*/ SupplierController.findByName);
  app.put("/supplier", /*{ preHandler: auth_middleware },*/ SupplierController.update);
  app.delete("/supplier", /*{ preHandler: auth_middleware },*/ SupplierController.delete);
};
async function product_routes(app: FastifyInstance){
  app.get("/products", /*{ preHandler: auth_middleware },*/ ProductController.findAll);
  app.post("/product", /*{ preHandler: auth_middleware },*/ ProductController.create);
  app.get("/product/category/:category_id", /*{ preHandler: auth_middleware },*/ ProductController.findByCategory);
  app.put("/product", /*{ preHandler: auth_middleware },*/ ProductController.update);
  app.delete("/product", /*{ preHandler: auth_middleware },*/ ProductController.delete);
};
async function batch_routes(app: FastifyInstance){
  app.get("/batchs", /*{ preHandler: auth_middleware },*/ BatchController.findAll);
  app.get("/batch/product/:product_id", /*{ preHandler: auth_middleware },*/ BatchController.findBatchByProduct);
  app.get("/batch/supplier/:supplier_id", /*{ preHandler: auth_middleware },*/ BatchController.findBatchBySupplier);
  app.put("/batch", /*{ preHandler: auth_middleware },*/ BatchController.update);
  app.delete("/batch", /*{ preHandler: auth_middleware },*/ BatchController.delete);
}
export {user_routes, category_routes, supplier_routes, product_routes, batch_routes, preuser_routes};