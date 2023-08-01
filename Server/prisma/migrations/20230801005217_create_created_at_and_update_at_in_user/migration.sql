/*
  Warnings:

  - Added the required column `createdAt` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `user` table without a default value. This is not possible if the table is not empty.

*/
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
    "createdAt" DATETIME NOT NULL,
    "updateAt" DATETIME NOT NULL,
    CONSTRAINT "user_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "user_user_type_id_fkey" FOREIGN KEY ("user_type_id") REFERENCES "user_type" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_user" ("company_id", "email", "id", "name", "user_login", "user_password", "user_type_id") SELECT "company_id", "email", "id", "name", "user_login", "user_password", "user_type_id" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
