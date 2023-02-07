/*
  Warnings:

  - You are about to drop the column `id_produto` on the `fornecedores` table. All the data in the column will be lost.
  - Added the required column `id_fornecedor` to the `produtos` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_fornecedores" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "razaoSocial" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "inscricaoEstadual" TEXT NOT NULL,
    "telefone" TEXT NOT NULL
);
INSERT INTO "new_fornecedores" ("cnpj", "email", "id", "inscricaoEstadual", "razaoSocial", "telefone") SELECT "cnpj", "email", "id", "inscricaoEstadual", "razaoSocial", "telefone" FROM "fornecedores";
DROP TABLE "fornecedores";
ALTER TABLE "new_fornecedores" RENAME TO "fornecedores";
CREATE UNIQUE INDEX "fornecedores_email_key" ON "fornecedores"("email");
CREATE UNIQUE INDEX "fornecedores_cnpj_key" ON "fornecedores"("cnpj");
CREATE TABLE "new_produtos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "ncmSh" TEXT NOT NULL,
    "preco" INTEGER NOT NULL,
    "id_categoria" INTEGER NOT NULL,
    "id_fornecedor" INTEGER NOT NULL,
    CONSTRAINT "produtos_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categorias" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "produtos_id_fornecedor_fkey" FOREIGN KEY ("id_fornecedor") REFERENCES "fornecedores" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_produtos" ("descricao", "id", "id_categoria", "ncmSh", "nome", "preco") SELECT "descricao", "id", "id_categoria", "ncmSh", "nome", "preco" FROM "produtos";
DROP TABLE "produtos";
ALTER TABLE "new_produtos" RENAME TO "produtos";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
