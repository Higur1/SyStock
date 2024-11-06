/*
  Warnings:

  - You are about to drop the column `status` on the `token_recovery` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_token_recovery" (
    "token" TEXT NOT NULL PRIMARY KEY,
    "user_id" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "token_recovery_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_token_recovery" ("createdAt", "token", "updatedAt", "user_id") SELECT "createdAt", "token", "updatedAt", "user_id" FROM "token_recovery";
DROP TABLE "token_recovery";
ALTER TABLE "new_token_recovery" RENAME TO "token_recovery";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
