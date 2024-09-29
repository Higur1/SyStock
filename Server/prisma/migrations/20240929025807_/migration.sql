/*
  Warnings:

  - You are about to drop the `token_Recoverys` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "token_Recoverys";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "token_recovery" (
    "token" TEXT NOT NULL PRIMARY KEY,
    "user_id" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    CONSTRAINT "token_recovery_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
