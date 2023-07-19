/*
  Warnings:

  - You are about to alter the column `tokenStatus` on the `token_recovery` table. The data in that column could be lost. The data in that column will be cast from `String` to `Boolean`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_token_recovery" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL,
    "tokenStatus" BOOLEAN NOT NULL DEFAULT true,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "token_recovery_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_token_recovery" ("id", "tokenStatus", "user_id", "value") SELECT "id", "tokenStatus", "user_id", "value" FROM "token_recovery";
DROP TABLE "token_recovery";
ALTER TABLE "new_token_recovery" RENAME TO "token_recovery";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
