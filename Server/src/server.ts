import app from "./app";
import dotenv from "dotenv"
import ip from "ip";

dotenv.config();

const port: number = Number(process.env.PORT);

const start = async () => {
  try {
    await app.listen({ port: port, host: ip.address() });
    console.log(`Served at ${ip.address()}:${port}`);
  } catch (error) {
    console.log(error);
    app.log.error(error);
    process.exit(1);
  }
};

start();
