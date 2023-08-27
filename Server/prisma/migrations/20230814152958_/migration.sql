/*
  Warnings:

  - Added the required column `updateAt` to the `token_recovery` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_token_recovery" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token_status" BOOLEAN NOT NULL DEFAULT true,
    "company_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL,
    CONSTRAINT "token_recovery_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "token_recovery_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_token_recovery" ("company_id", "id", "token_status", "user_id") SELECT "company_id", "id", "token_status", "user_id" FROM "token_recovery";
DROP TABLE "token_recovery";
ALTER TABLE "new_token_recovery" RENAME TO "token_recovery";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
