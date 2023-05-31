-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_batch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "supplier_id" INTEGER NOT NULL,
    CONSTRAINT "batch_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_batch" ("date", "id", "number", "supplier_id") SELECT "date", "id", "number", "supplier_id" FROM "batch";
DROP TABLE "batch";
ALTER TABLE "new_batch" RENAME TO "batch";
CREATE UNIQUE INDEX "batch_number_key" ON "batch"("number");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
