/*
  Warnings:

  - You are about to alter the column `preco` on the `produtos` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_produtos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "ncmSh" TEXT NOT NULL,
    "preco" REAL NOT NULL,
    "id_categoria" INTEGER NOT NULL,
    "id_fornecedor" INTEGER NOT NULL,
    CONSTRAINT "produtos_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categorias" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "produtos_id_fornecedor_fkey" FOREIGN KEY ("id_fornecedor") REFERENCES "fornecedores" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_produtos" ("descricao", "id", "id_categoria", "id_fornecedor", "ncmSh", "nome", "preco") SELECT "descricao", "id", "id_categoria", "id_fornecedor", "ncmSh", "nome", "preco" FROM "produtos";
DROP TABLE "produtos";
ALTER TABLE "new_produtos" RENAME TO "produtos";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
