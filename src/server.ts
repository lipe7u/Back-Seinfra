import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "fastify-jwt";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

import authRoutes from "./routes/global-routes";

dotenv.config();

export const app = fastify();
export const prisma = new PrismaClient();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET não encontrado no .env");
}

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET,
});

app.register(authRoutes);


app.addHook("preHandler", async (request, reply) => {
  console.log("======== ROTA RECEBIDA ========");
  console.log("method:", request.method);
  console.log("url:", request.url);
  console.log("================================");

  const rota = request.url.split("?")[0];

  const rotasPublicas = [
    "/registro",
    "/login",
    "/registro-admin",
    "/login-admin",
  ];

  if (rotasPublicas.includes(rota)) {
    return;
  }

  try {
    await request.jwtVerify();
  } catch {
    return reply.code(401).send({
      statusCode: 401,
      error: "Unauthorized",
      message: "Token inválido ou ausente",
    });
  }
});

app.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
});

const port = Number(process.env.PORT) || 3000;

const start = async () => {
  try {
    await app.listen({ port, host: "0.0.0.0" });
    console.log("Servidor rodando em: http://localhost:${port}");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();