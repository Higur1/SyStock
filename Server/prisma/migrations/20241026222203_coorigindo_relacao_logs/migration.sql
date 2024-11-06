/*
  Warnings:

  - You are about to drop the column `logFill_id` on the `fill` table. All the data in the column will be lost.
  - Added the required column `fill_id` to the `log_fill` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
INSERT INTO "new_fill" ("createdAt", "dateTime", "excludedStatus", "id", "observation", "supplier_id", "totalPrice", "updatedAt", "user_id") SELECT "createdAt", "dateTime", "excludedStatus", "id", "observation", "supplier_id", "totalPrice", "updatedAt", "user_id" FROM "fill";
DROP TABLE "fill";
ALTER TABLE "new_fill" RENAME TO "fill";
CREATE TABLE "new_log_fill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fill_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "log_fill_fill_id_fkey" FOREIGN KEY ("fill_id") REFERENCES "fill" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "log_fill_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_log_fill" ("id", "user_id") SELECT "id", "user_id" FROM "log_fill";
DROP TABLE "log_fill";
ALTER TABLE "new_log_fill" RENAME TO "log_fill";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
