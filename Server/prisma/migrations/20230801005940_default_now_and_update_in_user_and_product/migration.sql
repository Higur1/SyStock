-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" TEXT NOT NULL,
    "user_type_id" INTEGER NOT NULL,
    "user_login" TEXT NOT NULL,
    "user_password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL,
    CONSTRAINT "user_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "user_user_type_id_fkey" FOREIGN KEY ("user_type_id") REFERENCES "user_type" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_user" ("company_id", "createdAt", "email", "id", "name", "updateAt", "user_login", "user_password", "user_type_id") SELECT "company_id", "createdAt", "email", "id", "name", "updateAt", "user_login", "user_password", "user_type_id" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE TABLE "new_product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL,
    "price" DECIMAL NOT NULL,
    CONSTRAINT "product_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_product" ("category_id", "company_id", "createAt", "id", "name", "price", "updateAt") SELECT "category_id", "company_id", "createAt", "id", "name", "price", "updateAt" FROM "product";
DROP TABLE "product";
ALTER TABLE "new_product" RENAME TO "product";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
