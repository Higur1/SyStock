/*
  Warnings:

  - You are about to alter the column `user_id` on the `log_product` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_log_product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "dateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eTypeAction" INTEGER NOT NULL,
    "motivo" TEXT NOT NULL
);
INSERT INTO "new_log_product" ("dateTime", "eTypeAction", "id", "motivo", "product_id", "quantity", "user_id") SELECT "dateTime", "eTypeAction", "id", "motivo", "product_id", "quantity", "user_id" FROM "log_product";
DROP TABLE "log_product";
ALTER TABLE "new_log_product" RENAME TO "log_product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
