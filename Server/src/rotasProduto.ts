import { prisma } from "./libs/prisma";
import { FastifyInstance } from "fastify";
import { z } from 'zod';
export async function rotasProduto(app: FastifyInstance) {
    app.post('/adicionarProduto', async (request, response) => {
        const produto = z.object({
            nome: z.string(),
            descricao: z.string(),
            ncmSh: z.string(),
            preco: z.number(),
            id_categoria: z.number(),
            id_fornecedor: z.number()
        });
        const { nome,
            descricao,
            ncmSh,
            preco,
            id_categoria,
            id_fornecedor } = produto.parse(request.body);
        try {
            await prisma.$queryRaw`
                INSERT INTO produtos (nome, descricao, ncmSh, preco, id_categoria, id_fornecedor)
                VALUES (${nome},${descricao},${ncmSh},${preco},${id_categoria},${id_fornecedor})
            `
            response.status(200).send(JSON.stringify({
                mensagem: 'Produto cadastrado com sucesso'
            }));
        } catch (error) {
            response.status(400).send(JSON.stringify({
                erro: error.meta,
                mensagem: 'Ocorreu um erro'
            }));
            console.log(error)
        }
    });
    app.get('/listarProdutos', async () => {
        const listaProdutos = await prisma.$queryRaw`
            SELECT * 
            FROM produtos 
        `
        if (!listaProdutos || Object.values(listaProdutos).length === 0) {
            return 'Lista vazia';
        }
        return listaProdutos;
    });
    app.get('/buscarProdutoNome/:nome', async (request, response) => {
        const produtoNome = z.object({
            nome: z.string()
        });
        const { nome } = produtoNome.parse(request.params);

        try {
            const listaBuscaProdutos = await prisma.$queryRawUnsafe(
                'SELECT * FROM produtos WHERE nome like $1',
                `${nome}%`
            );
            if (!listaBuscaProdutos || Object.values(listaBuscaProdutos).length === 0) {
                response.status(404).send(JSON.stringify({
                    mensagem: 'Não foi possível encontrar o produto'
                }));
            }
            response.status(200).send(listaBuscaProdutos);
        } catch (error) {
            response.status(500).send(JSON.stringify({
                erro: error.meta.target,
                mensagem: 'Ocorreu um erro'
            }));
        }
    });
    app.get('/buscarProdutoId/:id', async (request, response) => {
        const idProduto = z.object({
            id: z.string()
        });
        const { id } = idProduto.parse(request.params);

        try {
            const produto = await prisma.produto.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!produto || Object.values(produto).length === 0) {
                response.status(404).send(JSON.stringify({
                    mensagem: 'Não foi possível encontrar o produto'
                }));
            }
            response.status(200).send(produto);
        } catch (error) {
            response.status(500).send(JSON.stringify({
                erro: error.meta.target,
                mensagem: 'Ocorreu um erro'
            }));
        }
    });
    app.get('/listarProdutoPorCategoria/:id', async (request, response) => {
        const listaProdutoCategoria = z.object({
            id: z.string()
        });
        const { id } = listaProdutoCategoria.parse(request.params);

        try {
            const produtos = await prisma.produto.findMany({
                where: {
                    id_categoria: Number(id)
                }
            });
            if (!produtos || Object.values(produtos).length === 0) {
                response.status(404).send(JSON.stringify({
                    mensagem: 'Não foi possível encontrar o produto'
                }));
            }
            response.status(200).send(produtos);
        } catch (error) {
            response.status(500).send(JSON.stringify({
                erro: error.meta.target,
                mensagem: 'Ocorreu um erro'
            }));
        }
    });
    app.put('/atualizarProduto', async (request, response) => {
        const produto = z.object({
            id: z.number(),
            nome: z.string(),
            descricao: z.string(),
            ncmSh: z.string(),
            preco: z.number(),
            id_categoria: z.number(),
            id_fornecedor: z.number()
        });
        const { id,
            nome,
            descricao,
            ncmSh,
            preco,
            id_categoria,
            id_fornecedor } = produto.parse(request.body);

        try {
            const validarId = await prisma.produto.findUnique({
                where: {
                    id: id
                }
            });
            if (!validarId || Object.values(validarId).length === 0) {
                response.status(404).send(JSON.stringify({
                    mensagem: 'Não foi possível encontrar o produto'
                }));
            }
            await prisma.$queryRaw`
                UPDATE produtos
                SET
                    nome = ${nome},
                    descricao = ${descricao},
                    ncmSh = ${ncmSh},
                    preco = ${preco},
                    id_categoria = ${id_categoria},
                    id_fornecedor = ${id_fornecedor}
                WHERE 
                    id = ${id}
            `
            response.status(200).send(JSON.stringify({
                mensagem: 'Produto atualizado'
            }));
        } catch (error) {
            response.status(500).send(JSON.stringify({
                erro: error,
                mensagem: 'Ocorreu um erro'
            }))
        }
    });
    app.delete('/excluirProduto', async (request, response) => {
        const idProduto = z.object({
            id: z.number()
        });
        const { id } = idProduto.parse(request.body);
        try {
            const validarId = await prisma.produto.findUnique({
                where: {
                    id: id
                }
            });
            if (!validarId || Object.values(validarId).length === 0) {
                response.status(404).send(JSON.stringify({
                    mensagem: 'Não foi possível encontrar o produto'
                }));
            }
            await prisma.produto.delete({
                where: {
                    id: id
                }
            });
            response.status(200).send(JSON.stringify({
                mensagem: 'Produto excluido com sucesso'
            }));
        } catch (error) {
            response.status(500).send(JSON.stringify({
                erro: error.meta.target,
                mensagem: 'Ocorreu um erro'
            }));
        }
    });
}