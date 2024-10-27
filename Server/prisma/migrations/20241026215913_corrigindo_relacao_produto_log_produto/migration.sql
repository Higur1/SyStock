/*
  Warnings:

  - You are about to drop the column `product_id` on the `log_product` table. All the data in the column will be lost.
  - You are about to drop the column `logProduto_id` on the `product` table. All the data in the column will be lost.
  - Added the required column `produto_id` to the `log_product` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_log_product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "produto_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "dateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eTypeAction" INTEGER NOT NULL,
    "motivo" TEXT NOT NULL,
    CONSTRAINT "log_product_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_log_product" ("dateTime", "eTypeAction", "id", "motivo", "quantity", "user_id") SELECT "dateTime", "eTypeAction", "id", "motivo", "quantity", "user_id" FROM "log_product";
DROP TABLE "log_product";
ALTER TABLE "new_log_product" RENAME TO "log_product";
CREATE UNIQUE INDEX "log_product_produto_id_key" ON "log_product"("produto_id");
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
    CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_product" ("category_id", "costPrice", "createdAt", "excludedStatus", "id", "minimunQuantity", "name", "observation", "price", "totalQuantityInStock", "updatedAt") SELECT "category_id", "costPrice", "createdAt", "excludedStatus", "id", "minimunQuantity", "name", "observation", "price", "totalQuantityInStock", "updatedAt" FROM "product";
DROP TABLE "product";
ALTER TABLE "new_product" RENAME TO "product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
