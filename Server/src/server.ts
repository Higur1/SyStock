import fastify from 'fastify';
import cors from '@fastify/cors';
import { appRoutes } from './routes';
import dotenv from 'dotenv';
import ip from 'ip';
import { rotasCliente } from './rotasCliente';
import { rotasFornecedor } from './rotasFornecedor';

dotenv.config();

const app = fastify();
const port: number = Number(process.env.PORT);

app.register(cors, {
    origin: '*'
});

app.register(appRoutes);
app.register(rotasCliente);
app.register(rotasFornecedor);

app.listen({
    port: port,
    host: ip.address()

}).then(() => {
    console.log(`Served at ${ip.address()}:${port}`);
})