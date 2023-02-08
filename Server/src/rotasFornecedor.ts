import { prisma } from "./libs/prisma"
import { FastifyInstance } from "fastify";
import { number, z } from 'zod'
export async function rotasFornecedor(app: FastifyInstance) {
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
            });
            const fornecedor_cadastrado = await prisma.fornecedor.findFirst({
                take: -1
            });
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
            });
            response.status(200).send(JSON.stringify({
                mensagem: 'Fornecedor cadastrado com sucesso!'
            }));
        } catch (error) {
            response.status(400).send(JSON.stringify({
                campo: error.meta.target + 'Duplicado',
                mensagem: 'Não foi possível cadastrar o fornecedor'
            }));
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
        return listaDeFornecedores;
    });
    app.get('/buscarFornecedorNome/:razaoSocial', async (request, response) => {
        const nomeFornecedor = z.object({
            razaoSocial: z.string()
        });

        const { razaoSocial } = nomeFornecedor.parse(request.params);

        try {
            const fornecedor = await prisma.$queryRawUnsafe(
                'SELECT * FROM fornecedores WHERE razaoSocial like $1',
                `${razaoSocial}%`
            );
            if (!fornecedor || Object.values(fornecedor).length === 0) {
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
    });
    app.get('/buscarFornecedorId/:id', async (request, response) => {
        const idFornecedor = z.object({
            id: z.string()
        });
        const { id } = idFornecedor.parse(request.params);

        try {
            const fornecedor = await prisma.$queryRaw`
                SELECT * 
                FROM fornecedores 
                WHERE id = ${Number(id)}
            `
            if (!fornecedor || Object.values(fornecedor).length === 0) {
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
    });
    app.get('/buscarEnderecoFornecedor/:id', async (request, response) => {
        const idEndereco = z.object({
            id: z.string()
        });
        const { id } = idEndereco.parse(request.params);

        try {
            const endereco = await prisma.$queryRaw`
                SELECT *
                FROM enderecos_fornecedor
                WHERE id = ${Number(id)}
            `
            if (!endereco || Object.values(endereco).length === 0) {
                response.status(404).send(JSON.stringify({
                    mensagem: 'Não foi possível encontrar o endereço do fornecedor'
                }));
            }
            response.status(200).send(endereco);
        } catch (error) {
            response.status(500).send(JSON.stringify({
                mensagem: 'Ocorreu um erro'
            }))
        }
    })
    app.put('/atualizarFornecedor/:id', async (request, response) => {
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
            const validarId = await prisma.fornecedor.findUnique({
                where: {
                    cnpj: cnpj
                }
            });
            if (!validarId || Object.values(validarId).length === 0) {
                response.status(404).send(JSON.stringify({
                    mensagem: 'Não foi possível encontrar o fornecedor'
                }));
            }
            await prisma.$queryRaw`
                UPDATE fornecedores
                SET 
                    razaoSocial = ${razaoSocial},
                    telefone = ${telefone},
                    email = ${email},
                    inscricaoEstadual = ${inscricaoEstadual}
                WHERE cnpj = ${cnpj}
            `
            response.status(200).send(JSON.stringify({
                cliente: cnpj,
                mensagem: 'Fornecedor atualizado com sucesso'
            }));
        } catch (error) {
            response.status(500).send(JSON.stringify({
                erro: error.meta.message,
                mensagem: 'Ocorreu um erro'
            }));
        }
    });
    app.delete('/excluirFornecedor', async (request, response) => {
        const idFornecedor = z.object({
            id: z.number()
        });
        const { id } = idFornecedor.parse(request.body);
        const validarId = await prisma.fornecedor.findUnique({
            where: {
                id: id
            }
        });
        try {
            if (!validarId || Object.values(validarId).length === 0) {
                response.status(404).send(JSON.stringify({
                    mensagem: 'Não foi possível encontrar o fornecedor'
                }));
            }
            await prisma.endereco_Fornecedor.delete({
                where: {
                    id_fornecedor: id
                }
            });
            await prisma.fornecedor.delete({
                where: {
                    id: id
                }
            });
            response.status(200).send(JSON.stringify({
                mensagem: 'Fornecedor excluido com sucesso'
            }));
        } catch (error) {
            response.status(500).send(JSON.stringify({
                erro: error,
                mensagem: 'Ocorreu um erro'
            }));
        }
    });
}