import { prisma } from "./libs/prisma"
import { FastifyInstance } from "fastify";
import { number, z } from 'zod'
export async function rotasCategoria(app: FastifyInstance) {
    app.post('/adicionarCategoria', async (request, response) => {
        const categoria = z.object({
            nome: z.string()
        });
        const { nome } = categoria.parse(request.body);

        try {
            await prisma.categoria.create({
                data: {
                    nome: nome
                }
            });
            response.status(200).send(JSON.stringify({
                mensagem: 'Categoria cadastrada com sucesso'
            }));
        } catch (error) {
            response.status(400).send(JSON.stringify({
                erro: error.meta.target,
                mensagem: 'Ocorreu um erro'
            }));
        }
    });
    app.get('/listarCategorias', async () => {
        const listaDeCategorias = await prisma.categoria.findMany();

        return listaDeCategorias;
    });
    app.get('/buscarCategoria/:id', async (request, response) => {
        const idCategoria = z.object({
            id: z.string()
        });
        const { id } = idCategoria.parse(request.params);

        try {
            const categoria = await prisma.categoria.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!categoria || Object.values(categoria).length === 0) {
                response.status(404).send(JSON.stringify({
                    mensagem: 'Não foi possível encontrar a categoria'
                }));
            }
            response.status(200).send(categoria);
        } catch (error) {
            response.status(500).send(JSON.stringify({
                erro: error.meta.target,
                mensagem: 'Ocorreu um erro'
            }));
        }
    });
    app.put('/atualizarCategoria', async (request, response) => {
        const categoria = z.object({
            id: z.number(),
            nome: z.string()
        });
        const { id,
                nome } = categoria.parse(request.body);

        try {
            const validarId = await prisma.categoria.findUnique({
                where: {
                    id: id
                }
            });

            if (!validarId || Object.values(validarId).length === 0) {
                response.status(404).send(JSON.stringify({
                    mensagem: 'Não foi possível encontrar a categoria'
                }));
            }
            await prisma.$queryRaw`
                UPDATE categorias
                SET 
                    nome = ${nome}
                WHERE 
                    id = ${id}
            `
            response.status(200).send(JSON.stringify({
                mensagem: 'Categoria atualizada com sucessoo'
            }));
        } catch (error) {
            response.status(500).send(JSON.stringify({
                erro: error.meta.target,
                mensagem: 'Ocorreu um erro'
            }));
        }
    });
    app.delete('/excluirCategoria', async (request, response) => {
        const idCategoria = z.object({
            id: z.number()
        });
        const { id } = idCategoria.parse(request.body);

        try {
            const validarId = await prisma.categoria.findUnique({
                where: {
                    id: id
                }
            });

            if (!validarId || Object.values(validarId).length === 0) {
                response.status(404).send(JSON.stringify({
                    mensagem: 'Não foi possível encontrar a categoria'
                }));
            }
            await prisma.categoria.delete({
                where: {
                    id: id
                }
            });
            response.status(200).send(JSON.stringify({
                mensagem: 'Categoria excluída com sucesso'
            }));
        } catch (error) {
            response.status(500).send(JSON.stringify({
                erro: error.meta.target,
                mensagem: 'Ocorreu um erro'
            }));
        }
    });
}