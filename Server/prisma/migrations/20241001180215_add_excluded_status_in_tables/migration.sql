/*
  Warnings:

  - Added the required column `excludedStatus` to the `category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `excludedStatus` to the `fill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `excludedStatus` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `excludedStatus` to the `sales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `excludedStatus` to the `suppliers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `excludedStatus` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "excludedStatus" BOOLEAN NOT NULL
);
INSERT INTO "new_category" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "category";
DROP TABLE "category";
ALTER TABLE "new_category" RENAME TO "category";
CREATE TABLE "new_fill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "totalPrice" DECIMAL NOT NULL,
    "dateTime" DATETIME NOT NULL,
    "observation" TEXT NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "excludedStatus" BOOLEAN NOT NULL,
    CONSTRAINT "fill_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "fill_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_fill" ("createdAt", "dateTime", "id", "observation", "supplier_id", "totalPrice", "updatedAt", "user_id") SELECT "createdAt", "dateTime", "id", "observation", "supplier_id", "totalPrice", "updatedAt", "user_id" FROM "fill";
DROP TABLE "fill";
ALTER TABLE "new_fill" RENAME TO "fill";
CREATE TABLE "new_product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "costPrice" DECIMAL NOT NULL,
    "minimunQuantity" INTEGER NOT NULL,
    "observation" TEXT NOT NULL,
    "totalQuantityInStock" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "excludedStatus" BOOLEAN NOT NULL,
    CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_product" ("category_id", "costPrice", "createdAt", "id", "minimunQuantity", "name", "observation", "price", "totalQuantityInStock", "updatedAt") SELECT "category_id", "costPrice", "createdAt", "id", "minimunQuantity", "name", "observation", "price", "totalQuantityInStock", "updatedAt" FROM "product";
DROP TABLE "product";
ALTER TABLE "new_product" RENAME TO "product";
CREATE TABLE "new_sales" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dateTime" DATETIME NOT NULL,
    "user_id" INTEGER NOT NULL,
    "observation" TEXT NOT NULL,
    "totalPrice" DECIMAL NOT NULL,
    "paymentMade" BOOLEAN NOT NULL,
    "eSalesStatus" INTEGER NOT NULL,
    "ePaymentMethod" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "excludedStatus" BOOLEAN NOT NULL,
    CONSTRAINT "sales_eSalesStatus_fkey" FOREIGN KEY ("eSalesStatus") REFERENCES "eSalesStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "sales_ePaymentMethod_fkey" FOREIGN KEY ("ePaymentMethod") REFERENCES "ePaymentMethod" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "sales_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_sales" ("createdAt", "dateTime", "ePaymentMethod", "eSalesStatus", "id", "observation", "paymentMade", "totalPrice", "updatedAt", "user_id") SELECT "createdAt", "dateTime", "ePaymentMethod", "eSalesStatus", "id", "observation", "paymentMade", "totalPrice", "updatedAt", "user_id" FROM "sales";
DROP TABLE "sales";
ALTER TABLE "new_sales" RENAME TO "sales";
CREATE TABLE "new_suppliers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "excludedStatus" BOOLEAN NOT NULL
);
INSERT INTO "new_suppliers" ("createdAt", "email", "id", "name", "phone", "updatedAt") SELECT "createdAt", "email", "id", "name", "phone", "updatedAt" FROM "suppliers";
DROP TABLE "suppliers";
ALTER TABLE "new_suppliers" RENAME TO "suppliers";
CREATE UNIQUE INDEX "suppliers_name_key" ON "suppliers"("name");
CREATE UNIQUE INDEX "suppliers_phone_key" ON "suppliers"("phone");
CREATE UNIQUE INDEX "suppliers_email_key" ON "suppliers"("email");
CREATE TABLE "new_user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL,
    "user_type" INTEGER NOT NULL DEFAULT 1,
    "excludedStatus" BOOLEAN NOT NULL,
    CONSTRAINT "user_user_type_fkey" FOREIGN KEY ("user_type") REFERENCES "eTypeUser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_user" ("createdAt", "email", "id", "login", "name", "password", "updateAt", "user_type") SELECT "createdAt", "email", "id", "login", "name", "password", "updateAt", "user_type" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
