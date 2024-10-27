/*
  Warnings:

  - You are about to drop the column `dateTime` on the `log_fill` table. All the data in the column will be lost.
  - You are about to drop the column `observation` on the `log_fill` table. All the data in the column will be lost.
  - You are about to drop the column `supplier_id` on the `log_fill` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `log_fill` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Batch_Fill" (
    "batch_id" INTEGER NOT NULL,
    "fill_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "costPrice" DECIMAL NOT NULL,
    "subTotal" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "logFill_id" INTEGER NOT NULL,

    PRIMARY KEY ("batch_id", "fill_id"),
    CONSTRAINT "Batch_Fill_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Batch_Fill_fill_id_fkey" FOREIGN KEY ("fill_id") REFERENCES "fill" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Batch_Fill" ("batch_id", "costPrice", "createdAt", "fill_id", "logFill_id", "quantity", "subTotal", "updatedAt") SELECT "batch_id", "costPrice", "createdAt", "fill_id", "logFill_id", "quantity", "subTotal", "updatedAt" FROM "Batch_Fill";
DROP TABLE "Batch_Fill";
ALTER TABLE "new_Batch_Fill" RENAME TO "Batch_Fill";
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
    "logFill_id" INTEGER,
    CONSTRAINT "fill_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "fill_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "fill_logFill_id_fkey" FOREIGN KEY ("logFill_id") REFERENCES "log_fill" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_fill" ("createdAt", "dateTime", "excludedStatus", "id", "observation", "supplier_id", "totalPrice", "updatedAt", "user_id") SELECT "createdAt", "dateTime", "excludedStatus", "id", "observation", "supplier_id", "totalPrice", "updatedAt", "user_id" FROM "fill";
DROP TABLE "fill";
ALTER TABLE "new_fill" RENAME TO "fill";
CREATE UNIQUE INDEX "fill_logFill_id_key" ON "fill"("logFill_id");
CREATE TABLE "new_log_fill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL
);
INSERT INTO "new_log_fill" ("id", "user_id") SELECT "id", "user_id" FROM "log_fill";
DROP TABLE "log_fill";
ALTER TABLE "new_log_fill" RENAME TO "log_fill";
CREATE TABLE "new_product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "costPrice" DECIMAL NOT NULL,
    "minimunQuantity" INTEGER NOT NULL,
    "observation" TEXT NOT NULL,
    "totalQuantityInStock" INTEGER NOT NULL,
    "category_id" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "excludedStatus" BOOLEAN NOT NULL,
    "logProduto_id" INTEGER,
    CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "product_logProduto_id_fkey" FOREIGN KEY ("logProduto_id") REFERENCES "log_product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_product" ("category_id", "costPrice", "createdAt", "excludedStatus", "id", "minimunQuantity", "name", "observation", "price", "totalQuantityInStock", "updatedAt") SELECT "category_id", "costPrice", "createdAt", "excludedStatus", "id", "minimunQuantity", "name", "observation", "price", "totalQuantityInStock", "updatedAt" FROM "product";
DROP TABLE "product";
ALTER TABLE "new_product" RENAME TO "product";
CREATE UNIQUE INDEX "product_logProduto_id_key" ON "product"("logProduto_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
