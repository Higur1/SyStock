/*
  Warnings:

  - You are about to drop the column `price` on the `log_fill` table. All the data in the column will be lost.
  - You are about to drop the column `subTotal` on the `log_fill` table. All the data in the column will be lost.
  - You are about to drop the column `supplier_name` on the `log_fill` table. All the data in the column will be lost.
  - You are about to drop the column `user_name` on the `log_fill` table. All the data in the column will be lost.
  - You are about to drop the column `product_name` on the `log_product` table. All the data in the column will be lost.
  - You are about to drop the column `user_name` on the `log_product` table. All the data in the column will be lost.
  - Added the required column `logFill_id` to the `Batch_Fill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplier_id` to the `log_fill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `log_fill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `motivo` to the `log_product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `log_product` table without a default value. This is not possible if the table is not empty.

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
    "logFill_id" INTEGER NOT NULL,
    CONSTRAINT "Batch_Fill_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Batch_Fill_fill_id_fkey" FOREIGN KEY ("fill_id") REFERENCES "fill" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Batch_Fill_logFill_id_fkey" FOREIGN KEY ("logFill_id") REFERENCES "log_fill" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Batch_Fill" ("batch_id", "costPrice", "createdAt", "fill_id", "id", "quantity", "subTotal", "updatedAt") SELECT "batch_id", "costPrice", "createdAt", "fill_id", "id", "quantity", "subTotal", "updatedAt" FROM "Batch_Fill";
DROP TABLE "Batch_Fill";
ALTER TABLE "new_Batch_Fill" RENAME TO "Batch_Fill";
CREATE TABLE "new_log_fill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "observation" TEXT NOT NULL,
    "dateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "totalPrice" DECIMAL NOT NULL
);
INSERT INTO "new_log_fill" ("dateTime", "id", "observation", "totalPrice") SELECT "dateTime", "id", "observation", "totalPrice" FROM "log_fill";
DROP TABLE "log_fill";
ALTER TABLE "new_log_fill" RENAME TO "log_fill";
CREATE TABLE "new_log_product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "dateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eTypeAction" INTEGER NOT NULL,
    "motivo" TEXT NOT NULL
);
INSERT INTO "new_log_product" ("dateTime", "eTypeAction", "id", "product_id", "quantity") SELECT "dateTime", "eTypeAction", "id", "product_id", "quantity" FROM "log_product";
DROP TABLE "log_product";
ALTER TABLE "new_log_product" RENAME TO "log_product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
