import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

async function auth_middleware(request, response) {
  const authorization = request.headers["authorization"];
  const hasBearer = authorization.indexOf("Bearer") !== -1;
  const authHeader = hasBearer
    ? authorization.split("Bearer ")[1]
    : authorization;
  const knowkey = process.env.JWTSecret;
  if (!authHeader) {
    return response.status(401).send({ err: "Access Denied" });
  }

  jwt.verify(authHeader, knowkey!, (error, data) => {
    if (error) {
      response.status(401).send(error);
    } else {
      request.token = authHeader;
      request.loggedUser = { id: data.id, name: data.name};
    }
  });
}

export default auth_middleware;
