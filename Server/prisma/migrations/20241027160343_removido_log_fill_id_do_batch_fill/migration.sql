/*
  Warnings:

  - You are about to drop the column `logFill_id` on the `Batch_Fill` table. All the data in the column will be lost.

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

    PRIMARY KEY ("batch_id", "fill_id"),
    CONSTRAINT "Batch_Fill_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Batch_Fill_fill_id_fkey" FOREIGN KEY ("fill_id") REFERENCES "fill" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Batch_Fill" ("batch_id", "costPrice", "createdAt", "fill_id", "quantity", "subTotal", "updatedAt") SELECT "batch_id", "costPrice", "createdAt", "fill_id", "quantity", "subTotal", "updatedAt" FROM "Batch_Fill";
DROP TABLE "Batch_Fill";
ALTER TABLE "new_Batch_Fill" RENAME TO "Batch_Fill";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
