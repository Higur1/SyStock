/*
  Warnings:

  - Added the required column `updatedAt` to the `Batch_Fill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `batch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `fill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `pre_user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `product_sales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `sales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `suppliers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `token_recovery` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Batch_Fill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "batch_id" INTEGER NOT NULL,
    "fill_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "costPrice" DECIMAL NOT NULL,
    "subTotal" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Batch_Fill_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Batch_Fill_fill_id_fkey" FOREIGN KEY ("fill_id") REFERENCES "fill" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Batch_Fill" ("batch_id", "costPrice", "fill_id", "id", "quantity", "subTotal") SELECT "batch_id", "costPrice", "fill_id", "id", "quantity", "subTotal" FROM "Batch_Fill";
DROP TABLE "Batch_Fill";
ALTER TABLE "new_Batch_Fill" RENAME TO "Batch_Fill";
CREATE TABLE "new_batch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "expirationDate" DATETIME NOT NULL,
    "quantity" INTEGER NOT NULL,
    "deletionStatus" BOOLEAN NOT NULL,
    "dateTimeEmptyStock" DATETIME NOT NULL,
    "product_id" INTEGER NOT NULL,
    "eValidationSattus" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "batch_eValidationSattus_fkey" FOREIGN KEY ("eValidationSattus") REFERENCES "eValitadionStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "batch_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_batch" ("dateTimeEmptyStock", "deletionStatus", "eValidationSattus", "expirationDate", "id", "product_id", "quantity") SELECT "dateTimeEmptyStock", "deletionStatus", "eValidationSattus", "expirationDate", "id", "product_id", "quantity" FROM "batch";
DROP TABLE "batch";
ALTER TABLE "new_batch" RENAME TO "batch";
CREATE TABLE "new_category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_category" ("id", "name") SELECT "id", "name" FROM "category";
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
    CONSTRAINT "fill_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "fill_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_fill" ("dateTime", "id", "observation", "supplier_id", "totalPrice", "user_id") SELECT "dateTime", "id", "observation", "supplier_id", "totalPrice", "user_id" FROM "fill";
DROP TABLE "fill";
ALTER TABLE "new_fill" RENAME TO "fill";
CREATE TABLE "new_pre_user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_pre_user" ("email", "id", "name") SELECT "email", "id", "name" FROM "pre_user";
DROP TABLE "pre_user";
ALTER TABLE "new_pre_user" RENAME TO "pre_user";
CREATE UNIQUE INDEX "pre_user_email_key" ON "pre_user"("email");
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
    CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_product" ("category_id", "costPrice", "id", "minimunQuantity", "name", "observation", "price", "totalQuantityInStock") SELECT "category_id", "costPrice", "id", "minimunQuantity", "name", "observation", "price", "totalQuantityInStock" FROM "product";
DROP TABLE "product";
ALTER TABLE "new_product" RENAME TO "product";
CREATE TABLE "new_product_sales" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_id" INTEGER NOT NULL,
    "sales_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalPrice" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "product_sales_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "product_sales_sales_id_fkey" FOREIGN KEY ("sales_id") REFERENCES "sales" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_product_sales" ("id", "product_id", "quantity", "sales_id", "totalPrice") SELECT "id", "product_id", "quantity", "sales_id", "totalPrice" FROM "product_sales";
DROP TABLE "product_sales";
ALTER TABLE "new_product_sales" RENAME TO "product_sales";
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
    CONSTRAINT "sales_eSalesStatus_fkey" FOREIGN KEY ("eSalesStatus") REFERENCES "eSalesStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "sales_ePaymentMethod_fkey" FOREIGN KEY ("ePaymentMethod") REFERENCES "ePaymentMethod" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "sales_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_sales" ("dateTime", "ePaymentMethod", "eSalesStatus", "id", "observation", "paymentMade", "totalPrice", "user_id") SELECT "dateTime", "ePaymentMethod", "eSalesStatus", "id", "observation", "paymentMade", "totalPrice", "user_id" FROM "sales";
DROP TABLE "sales";
ALTER TABLE "new_sales" RENAME TO "sales";
CREATE TABLE "new_suppliers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_suppliers" ("email", "id", "name", "phone") SELECT "email", "id", "name", "phone" FROM "suppliers";
DROP TABLE "suppliers";
ALTER TABLE "new_suppliers" RENAME TO "suppliers";
CREATE UNIQUE INDEX "suppliers_name_key" ON "suppliers"("name");
CREATE UNIQUE INDEX "suppliers_phone_key" ON "suppliers"("phone");
CREATE UNIQUE INDEX "suppliers_email_key" ON "suppliers"("email");
CREATE TABLE "new_token_recovery" (
    "token" TEXT NOT NULL PRIMARY KEY,
    "user_id" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "token_recovery_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_token_recovery" ("status", "token", "user_id") SELECT "status", "token", "user_id" FROM "token_recovery";
DROP TABLE "token_recovery";
ALTER TABLE "new_token_recovery" RENAME TO "token_recovery";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
