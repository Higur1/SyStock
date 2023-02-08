import { prisma } from "./libs/prisma"
import { FastifyInstance } from "fastify";
import { number, z } from 'zod'
export async function rotasProduto(app: FastifyInstance) {
    //Rotas Produto
    app.post('/adicionarProduto', async(request, response) => {
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
                id_fornecedor} = produto.parse(request.body);
        try {
            await prisma.produto.create({
                data:{
                    nome,
                    descricao,
                    ncmSh,
                    preco,
                    id_categoria,
                    id_fornecedor
                }
            });
            response.status(200).send(JSON.stringify({
                mensagem: 'Produto cadastrado com sucesso'
            }))
        } catch (error) {
            response.status(400).send(JSON.stringify({
                erro: error.meta.target,
                mensagem: 'Ocorreu um erro'
            }))
        }
    });  /*
    app.get('/listarProdutos', async () => {
        
    });
    app.get('/buscarProduto/:nome', async(request) =>{
    
    });
    app.get('/buscarProduto/:id', async (request) => {
        
    });
    app.get('/listarProdutoPorCategoria/:categoria', async (request) => {
        
    });
    app.patch('/atualizarProduto/:id', async (request) => {
        
    });
    app.delete('/excluirProduto/:id', async (request) => {
        
    });
    */
}