import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

async function auth_middleware(request, response) {
  const authHeader = request.headers["authorization"];
  const knowkey = process.env.JWTSecret;

  if (!authHeader) {
    return response.status(401).send({ err: "Access Denied" });
  }

  jwt.verify(authHeader, knowkey!, (error, data) =>{
    if(error){
      response.status(401).send(error);
    }
    request.token = authHeader;
    request.loggedUser = {id: data.user_login}
  })
}

export default auth_middleware;