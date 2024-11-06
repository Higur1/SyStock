-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL,
    "user_type" INTEGER NOT NULL DEFAULT 2,
    "excludedStatus" BOOLEAN NOT NULL,
    CONSTRAINT "user_user_type_fkey" FOREIGN KEY ("user_type") REFERENCES "eTypeUser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_user" ("createdAt", "email", "excludedStatus", "id", "login", "name", "password", "updateAt", "user_type") SELECT "createdAt", "email", "excludedStatus", "id", "login", "name", "password", "updateAt", "user_type" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
