/*
  Warnings:

  - A unique constraint covering the columns `[id_fornecedor]` on the table `enderecos_fornecedor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "enderecos_fornecedor_id_fornecedor_key" ON "enderecos_fornecedor"("id_fornecedor");
