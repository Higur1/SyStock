-- CreateTable
CREATE TABLE "token_recovery" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL,
    "tokenStatus" TEXT NOT NULL DEFAULT 'not used',
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "token_recovery_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
