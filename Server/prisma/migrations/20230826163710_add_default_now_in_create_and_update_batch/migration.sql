-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_batch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_id" INTEGER NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "batch_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "batch_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "batch_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_batch" ("company_id", "createAt", "id", "product_id", "quantity", "supplier_id", "updateAt") SELECT "company_id", "createAt", "id", "product_id", "quantity", "supplier_id", "updateAt" FROM "batch";
DROP TABLE "batch";
ALTER TABLE "new_batch" RENAME TO "batch";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
