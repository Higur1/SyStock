import fastify, { FastifyInstance } from "fastify";

import auth_middleware from "./middleware/auth_middleware";

import UserController from "../src/controllers/UserController";
import CategoryController from "../src/controllers/CategoryController"
import SupplierController from "../src/controllers/SupplierController";
import ProductController from "../src/controllers/ProductController";
import BatchController from "../src/controllers/BatchController";
import PreUserController from "../src/controllers/PreUserController";
import LoginController from "../src/controllers/LoginController";
import FillController from "../src/controllers/FillController";

const app = fastify();

async function user_routes(app: FastifyInstance) {
  app.get("/users",{ preHandler: auth_middleware },UserController.list);
  app.post("/user", UserController.create);
  app.get("/user/findByName/:name",{ preHandler: auth_middleware }, UserController.findByName);
  app.get("/user/listByName/:name", {preHandler: auth_middleware}, UserController.findByNameList);
  app.get("/user/findById/:id", {preHandler: auth_middleware}, UserController.find);
  app.patch("/user", { preHandler: auth_middleware }, UserController.edit);
  app.patch("/user/editPassword", UserController.editPassword);
  app.delete("/user/:id",{ preHandler: auth_middleware },UserController.delete);
  app.put("/reset/password", UserController.resetPassword);
};
async function login_routes(app: FastifyInstance) {
  app.post("/auth", LoginController.auth);
  app.post("/recovery", LoginController.recovery);
};
async function preuser_routes(app: FastifyInstance) {
  app.get("/preusers",{ preHandler: auth_middleware }, PreUserController.list);
  app.post("/preuser", PreUserController.create);
};
async function category_routes(app: FastifyInstance) {
  app.post("/category",{ preHandler: auth_middleware }, CategoryController.create);
  app.get("/categories",{ preHandler: auth_middleware },CategoryController.list);
  app.get("/category/:id",{ preHandler: auth_middleware },CategoryController.findById);
  app.get("/category/findByName/:name",{ preHandler: auth_middleware },CategoryController.findByName);
  app.get("/category/listByName/:name",{ preHandler: auth_middleware },CategoryController.listByName);
  app.put("/category",{ preHandler: auth_middleware },CategoryController.edit);
  app.delete("/category/:id",{ preHandler: auth_middleware },CategoryController.delete);
};
async function supplier_routes(app: FastifyInstance) {
  app.get("/suppliers", { preHandler: auth_middleware }, SupplierController.findAll);
  app.post("/supplier", { preHandler: auth_middleware }, SupplierController.create);
  app.get("/supplier/:id", { preHandler: auth_middleware }, SupplierController.find);
  app.get("/supplier/findByName/:name",{ preHandler: auth_middleware }, SupplierController.findByName);
  app.get("/supplier/listByName/:name", {preHandler: auth_middleware}, SupplierController.listByName);
  app.patch("/supplier", { preHandler: auth_middleware }, SupplierController.update);
  app.delete("/supplier/:id", { preHandler: auth_middleware }, SupplierController.delete);
};
async function product_routes(app: FastifyInstance) {
  app.get("/products",{ preHandler: auth_middleware }, ProductController.findAll);
  app.post("/product",{ preHandler: auth_middleware }, ProductController.create);
  app.get("/product/:id", {preHandler: auth_middleware}, ProductController.find);
  app.get("/product/findByName/:name", {preHandler: auth_middleware}, ProductController.findByName);
  app.get("/product/category/:category_id",{ preHandler: auth_middleware },ProductController.findByCategory);
  app.put("/product",{ preHandler: auth_middleware },ProductController.update);
  app.delete("/product/:id",{ preHandler: auth_middleware },ProductController.delete);
  app.get("/products/expired", {preHandler: auth_middleware}, ProductController.listExpired)
  app.get("/products/zeroStock", {preHandler: auth_middleware}, ProductController.listZeroStock)
  app.get("/products/lowQuantity", {preHandler: auth_middleware}, ProductController.listLowQuantity)
  app.get("/products/closeToExpiration", {preHandler: auth_middleware}, ProductController.listCloseToExpiration)
};
async function batch_routes(app: FastifyInstance) {
  app.get("/batchs", { preHandler: auth_middleware }, BatchController.findAll);
  app.post("/batch", {preHandler: auth_middleware}, BatchController.create);
  app.get("/batch/product/:product_id",{ preHandler: auth_middleware },BatchController.findByProduct);
  app.post("/batch/addQuantity", { preHandler: auth_middleware }, BatchController.addQuantity);
  app.post("/batch/subQuantity", {preHandler: auth_middleware}, BatchController.subQuantity);
  app.delete("/batch/:id", { preHandler: auth_middleware }, BatchController.delete);
};
async function fill_routes(app: FastifyInstance){
  app.post("/fill", {preHandler: auth_middleware}, FillController.create);
  app.get("/fill", {preHandler: auth_middleware}, FillController.findAll);
  app.get("/fill/findById/:id", {preHandler: auth_middleware}, FillController.findById);
  app.get("/fill/findBySupplierName/:id", {preHandler: auth_middleware}, FillController.findBySupplierId);
}
export {
  user_routes,
  category_routes,
  supplier_routes,
  product_routes,
  batch_routes,
  preuser_routes,
  login_routes,
  fill_routes,
};
