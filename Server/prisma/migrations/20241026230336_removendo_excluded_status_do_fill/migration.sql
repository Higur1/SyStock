/*
  Warnings:

  - You are about to drop the column `excludedStatus` on the `fill` table. All the data in the column will be lost.

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
    CONSTRAINT "fill_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "fill_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_fill" ("createdAt", "dateTime", "id", "observation", "supplier_id", "totalPrice", "updatedAt", "user_id") SELECT "createdAt", "dateTime", "id", "observation", "supplier_id", "totalPrice", "updatedAt", "user_id" FROM "fill";
DROP TABLE "fill";
ALTER TABLE "new_fill" RENAME TO "fill";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
