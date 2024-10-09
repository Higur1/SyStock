/*
  Warnings:

  - You are about to drop the column `eValidationSattus` on the `batch` table. All the data in the column will be lost.
  - Added the required column `eValidationStatus` to the `batch` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_batch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "expirationDate" DATETIME NOT NULL,
    "quantity" INTEGER NOT NULL,
    "deletionStatus" BOOLEAN NOT NULL,
    "dateTimeEmptyStock" DATETIME,
    "product_id" INTEGER NOT NULL,
    "eValidationStatus" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "batch_eValidationStatus_fkey" FOREIGN KEY ("eValidationStatus") REFERENCES "eValitadionStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "batch_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_batch" ("createdAt", "dateTimeEmptyStock", "deletionStatus", "expirationDate", "id", "product_id", "quantity", "updatedAt") SELECT "createdAt", "dateTimeEmptyStock", "deletionStatus", "expirationDate", "id", "product_id", "quantity", "updatedAt" FROM "batch";
DROP TABLE "batch";
ALTER TABLE "new_batch" RENAME TO "batch";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
