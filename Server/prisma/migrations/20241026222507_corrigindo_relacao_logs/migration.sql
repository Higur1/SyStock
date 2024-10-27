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
    CONSTRAINT "log_product_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "log_product_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_log_product" ("dateTime", "eTypeAction", "id", "motivo", "produto_id", "quantity", "user_id") SELECT "dateTime", "eTypeAction", "id", "motivo", "produto_id", "quantity", "user_id" FROM "log_product";
DROP TABLE "log_product";
ALTER TABLE "new_log_product" RENAME TO "log_product";
CREATE UNIQUE INDEX "log_product_produto_id_key" ON "log_product"("produto_id");
CREATE UNIQUE INDEX "log_product_user_id_key" ON "log_product"("user_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
