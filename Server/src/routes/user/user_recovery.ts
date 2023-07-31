import { prisma } from "../../config/prisma";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { sendEmail } from "./nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { generatorHATEOAS, generatorPasswordCrypt } from "./user_controller";

dotenv.config();

export async function user_recovery(app: FastifyInstance) {
  app.post("/auth", async (request, response) => {
    const user = z.object({
      user_login: z
        .string()
        .trim()
        .min(5, "user_login required minimum 5 chars")
        .max(10, "user_login required maximum 10 chars"),
      user_password: z
        .string()
        .trim()
        .min(5, "user_password required minimum 5 chars")
        .max(10, "user_password required maximum 10 chars"),
    });

    const { user_login, user_password } = user.parse(request.body);

    try {
      await prisma.user
        .findUnique({
          where: {
            user_login: user_login,
          },
        })
        .then(async (user) => {
          if (!user) {
            response.status(404).send({ message: "Not found" });
          }
          await bcrypt
            .compare(user_password, user!.user_password)
            .then(async (checkpassword) => {
              if (!checkpassword) {
                response.status(401).send({ message: "Unauthorized" });
              }
              const knowkey = process.env.JWTSecret;
              const token = jwt.sign(
                { id: user?.id, email: user?.email },
                knowkey!,
                { expiresIn: "48h" }
              );
              const _links = generatorHATEOAS(user);
              response.status(200).send({ token: token, _links });
            });
        });
    } catch (error) {
      response.status(500).send(
        JSON.stringify({
          message: "An error has occurred",
        })
      );
    }
  });
  app.post("/recovery", async (request, response) => {
    const recovery = z.object({
      email: z.string().trim().email("valid email required"),
      instance: z.string().trim().min(10, "instance required 10 chars"),
    });

    const { email, instance } = recovery.parse(request.body);

    await prisma.user
      .findUnique({
        where: {
          email: email,
        },
      })
      .then(async (emailValidad) => {
        if (emailValidad == undefined) {
          response.status(404).send({ message: "Not found" });
        }
        await prisma.tokenRecovery
          .create({
            data: {
              user_id: emailValidad!.id,
            },
          })
          .then((token) => {
            sendEmail(email, token, instance);
            response.status(200).send({ message: "e-mail sent" });
          });
      });
  });
  app.put("/reset/password", async (request, response) => {
    const passwordReset = z.object({
      token: z
        .string()
        .trim()
        .min(36, "token required minimum 36 chars")
        .max(36, "token required maximum 36 chars"),
      user_password: z
        .string()
        .min(5, "user_password required minimum 5 chars")
        .max(10, "user_password required maximum 10 chars"),
    });
    const { user_password, token } = passwordReset.parse(request.body);

    try {
      await prisma.tokenRecovery
        .findFirst({
          where: {
            value: token,
          },
        })
        .then(async (tokenValidad) => {
          if (tokenValidad == undefined) {
            response.status(401).send({ message: "Token invalid" });
          }
          if (tokenValidad?.tokenStatus == false) {
            response.status(401).send({ message: "Token is not available" });
          }
          await prisma
            .$transaction([
              prisma.user.update({
                where: {
                  id: tokenValidad!.user_id,
                },
                data: {
                  user_password: generatorPasswordCrypt(user_password),
                },
              }),
              prisma.tokenRecovery.update({
                where: {
                  id: tokenValidad!.id,
                },
                data: {
                  tokenStatus: false,
                },
              }),
            ])
            .then(() => {
              response.status(200);
            });
        });
    } catch (error) {
      response.status(500).send(
        JSON.stringify({
          message: "An error has occurred",
        })
      );
    }
  });
}
