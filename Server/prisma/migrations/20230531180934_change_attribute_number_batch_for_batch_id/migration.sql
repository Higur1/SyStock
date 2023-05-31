/*
  Warnings:

  - The primary key for the `batch_product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `number_batch` on the `batch_product` table. All the data in the column will be lost.
  - Added the required column `batch_id` to the `batch_product` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_batch_product" (
    "batch_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    PRIMARY KEY ("batch_id", "product_id"),
    CONSTRAINT "batch_product_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "batch_product_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_batch_product" ("product_id", "quantity") SELECT "product_id", "quantity" FROM "batch_product";
DROP TABLE "batch_product";
ALTER TABLE "new_batch_product" RENAME TO "batch_product";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
