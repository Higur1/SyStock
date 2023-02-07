import { prisma } from "./libs/prisma"
import { FastifyInstance } from "fastify";
import { number, z } from 'zod'
export async function rotasFornecedor(app: FastifyInstance) {
    //Rotas Fornecedor
    app.post('/adicionarFornecedor', async (request, response) => {
        const fornecedor = z.object({
            razaoSocial: z.string(),
            cnpj: z.string(),
            telefone: z.string(),
            email: z.string(),
            inscricaoEstadual: z.string(),
            cep: z.string(),
            cidade: z.string(),
            estado: z.string(),
            logradouro: z.string(),
            numero: z.number(),
            complemento: z.string()
        });
        const { razaoSocial,
            cnpj,
            telefone,
            email,
            inscricaoEstadual,
            cep,
            cidade,
            estado,
            logradouro,
            numero,
            complemento } = fornecedor.parse(request.body);

        try {
            await prisma.fornecedor.create({
                data: {
                    razaoSocial,
                    cnpj,
                    telefone,
                    email,
                    inscricaoEstadual
                }
            })
            const fornecedor_cadastrado = await prisma.fornecedor.findFirst({
                take: -1
            })
            await prisma.endereco_Fornecedor.create({
                data: {
                    id_fornecedor: fornecedor_cadastrado!.id,
                    cep,
                    cidade,
                    estado,
                    logradouro,
                    numero,
                    complemento
                }
            })
            response.status(200).send(JSON.stringify({
                mensagem: 'Fornecedor cadastrado com sucesso!'
            }))
        } catch (error) {
            response.status(400).send(JSON.stringify({
                campo: error.meta.target + 'Duplicado',
                mensagem: 'Não foi possível cadastrar o fornecedor'
            }))
        }
    });
    app.get('/listarFornecedores', async () => {
        const listaDeFornecedores = await prisma.$queryRaw`
            SELECT  
                F.id,
                F.razaoSocial,
                F.email,
                F.cnpj,
                F.inscricaoEstadual,
                F.telefone,
                EF.cep,
                EF.cidade,
                EF.estado,
                EF.logradouro,
                EF.numero,
                EF.complemento
            FROM fornecedores F
            JOIN enderecos_fornecedor EF
                ON F.id = EF.id_fornecedor
        `
        return listaDeFornecedores
    });
    app.get('/buscarFornecedor/:razaoSocial', async (request, response) => {
        const nomeFornecedor = z.object({
            razaoSocial: z.string()
        });

        const { razaoSocial } = nomeFornecedor.parse(request.params);

        try {
            const fornecedor = await prisma.$queryRaw`
                SELECT *
                FROM fornecedores
                WHERE razaoSocial = ${razaoSocial}
            `
            if(!fornecedor || Object.values(fornecedor).length === 0){
                response.status(404).send(JSON.stringify({
                    mensagem: 'Não foi possível encontrar o fornecedor'
                }));
            }
            response.status(200).send(fornecedor);
        } catch (error) {
            response.status(500).send(JSON.stringify({
                mensagem: 'Ocorreu um erro'
            }));
        }
    });/*
    app.get('/buscarFornecedor/:id', async (request) => {

    });
    app.put('/atualizarFornecedor/:id', async (request) => {

    });
    app.delete('/excluirFornecedor/:id', async (request) => {

    });*/
}