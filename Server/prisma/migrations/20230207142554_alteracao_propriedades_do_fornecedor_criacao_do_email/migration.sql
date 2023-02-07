/*
  Warnings:

  - Added the required column `email` to the `fornecedores` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_fornecedores" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "razaoSocial" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "inscricaoEstadual" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "id_produto" INTEGER NOT NULL,
    CONSTRAINT "fornecedores_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produtos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_fornecedores" ("cnpj", "id", "id_produto", "inscricaoEstadual", "razaoSocial", "telefone") SELECT "cnpj", "id", "id_produto", "inscricaoEstadual", "razaoSocial", "telefone" FROM "fornecedores";
DROP TABLE "fornecedores";
ALTER TABLE "new_fornecedores" RENAME TO "fornecedores";
CREATE UNIQUE INDEX "fornecedores_email_key" ON "fornecedores"("email");
CREATE UNIQUE INDEX "fornecedores_cnpj_key" ON "fornecedores"("cnpj");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
