/*import { prisma } from "./libs/prisma"
import { FastifyInstance } from "fastify";
import { number, z } from 'zod'
export async function rotasCliente(app: FastifyInstance) {
    //Rotas Cliente
    app.post('/adicionarCliente', async (request, response) => {
        const cliente = z.object({
            nomeRazaoSocial: z.string(),
            cpfCnpj: z.string(),
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
        const { nomeRazaoSocial,
            cpfCnpj,
            telefone,
            email,
            inscricaoEstadual,
            cep,
            cidade,
            estado,
            logradouro,
            numero,
            complemento } = cliente.parse(request.body);

        try {
            await prisma.cliente.create({
                data: {
                    nomeRazaoSocial,
                    cpfCnpj,
                    telefone,
                    email,
                    inscricaoEstadual
                }
            });
            const cliente_cadastrado = await prisma.cliente.findFirst({
                take: -1
            });

            await prisma.endereco.create({
                data: {
                    id_cliente: cliente_cadastrado!.id,
                    cep,
                    cidade,
                    estado,
                    logradouro,
                    numero,
                    complemento
                }
            });
            response.status(200).send('Cliente adicionado com sucesso!');
        } catch (error) {
            response.status(400).send(JSON.stringify({
                campo: error.meta.target + ' Duplicado',
                mensagem: 'Não foi possível cadastrar o cliente'
            }));
        }
    });
    app.get('/listarClientes', async () => {
        const listaDeClientes = await prisma.$queryRaw`
            SELECT 
                C.id,
                C.nomeRazaoSocial,
                C.cpfCnpj,
                C.telefone,
                C.email,
                C.inscricaoEstadual,
                E.cep,
                E.cidade,
                E.estado,
                E.logradouro,
                E.numero,
                E.complemento
            FROM  clientes C
            JOIN enderecos E
                ON C.id = E.id_cliente
        `

        return listaDeClientes;
    });
    app.get('/buscarClienteNome/:nomeRazaoSocial', async (request, response) => {
        const nomeCliente = z.object({
            nomeRazaoSocial: z.string()
        });
        const { nomeRazaoSocial } = nomeCliente.parse(request.params);

        try {
            const cliente = await prisma.$queryRaw`
                SELECT * 
                FROM clientes 
                WHERE nomeRazaoSocial = ${nomeRazaoSocial}
            `
            if (!cliente || Object.values(cliente).length === 0) {
                response.status(404).send(JSON.stringify({
                    message: 'Não foi possível encontrar o cliente'
                }));
            }
            response.send(cliente);
        } catch (error) {
            response.status(500).send(JSON.stringify({
                message: 'Ocorreu um erro!'
            }));
        }
    });
    app.get('/buscarClienteId/:id', async (request, response) => {
        const idCliente = z.object({
            id: z.string()
        });
        const { id } = idCliente.parse(request.params);

        try {
            const cliente = await prisma.$queryRaw`
            SELECT *
            FROM clientes
            WHERE id = ${Number(id)}
        `
            if (!cliente || Object.values(cliente).length === 0) {
                response.status(404).send(JSON.stringify({
                    message: 'Não foi possível encontrar o cliente'
                }));
            }
            response.status(200).send(cliente);
        } catch (error) {
            response.status(500).send(JSON.stringify({
                mensagem: 'Ocorreu um erro'
            }));
        }
    });
    app.get('/buscarClienteEndereco/:id', async (request, response) => {
        const idEndereco = z.object({
            id: z.string()
        });
        const { id } = idEndereco.parse(request.params);

        try {
            const endereco = await prisma.$queryRaw`
                SELECT * 
                FROM enderecos
                WHERE id = ${Number(id)}
            `
            if (!endereco || Object.values(endereco).length === 0) {
                response.status(404).send(JSON.stringify({
                    message: 'Não foi possível encontrar o endereço'
                }));
            }
            response.status(200).send(endereco);
        } catch (error) {
            response.status(500).send(JSON.stringify({
                message: 'Ocorreu um erro'
            }));
        }
    });
    app.put('/atualizarCliente', async (request, response) => {
        const cliente = z.object({
            nomeRazaoSocial: z.string(),
            cpfCnpj: z.string(),
            telefone: z.string(),
            email: z.string(),
            inscricaoEstadual: z.string(),
        });
        const { nomeRazaoSocial,
            cpfCnpj,
            telefone,
            email,
            inscricaoEstadual } = cliente.parse(request.body);

        try {
            const validarId = await prisma.cliente.findUnique({
                where: {
                    cpfCnpj: cpfCnpj
                }
            });
            if (!validarId || Object.values(validarId).length === 0) {
                response.status(404).send(JSON.stringify({
                    mensagem: 'Não foi possível encontrar o cliente'
                }))
            }
            await prisma.$queryRaw`
                UPDATE clientes
                SET 
                    nomeRazaoSocial = ${nomeRazaoSocial},
                    telefone = ${telefone},
                    email = ${email},
                    inscricaoEstadual = ${inscricaoEstadual}
                WHERE cpfCnpj = ${cpfCnpj}
            `
            response.status(200).send(JSON.stringify({
                cliente: cpfCnpj,
                mensagem: 'Atualizado com sucesso'
            }));
        } catch (error) {
            response.status(500).send(JSON.stringify({
                erro: error.meta.message,
                mensagem: 'Ocorreu um erro'
            }));
        }
    });
    app.delete('/excluirCliente', async (request, response) => {
        const idCliente = z.object({
            id: z.number()
        });
        const { id } = idCliente.parse(request.body);
        const validarId = await prisma.cliente.findUnique({
            where: {
                id: id
            }
        });

        try {
            if (!validarId || Object.values(validarId).length === 0) {
                response.status(404).send(JSON.stringify({
                    mensagem: 'Não foi possível encontrar o cliente!'
                }));
            }
            await prisma.endereco.delete({
                where: {
                    id_cliente: id
                }
            });
            await prisma.cliente.delete({
                where: {
                    id: id
                }
            });
            response.status(200).send(JSON.stringify({
                mensagem: 'Cliente excluido com sucesso!'
            }));
        } catch (error) {
            response.status(500).send(JSON.stringify({
                erro: error,
                mensagem: 'Ocorreu um erro'
            }));
        }
    });
}*/