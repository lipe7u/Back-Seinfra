import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import authRoutes from "./routes/global-routes";
import { registerJwt } from "./utils/jwt";
import * as dotenv from "dotenv";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "fastify-jwt";

dotenv.config();

export const app = fastify();

export const prisma = new PrismaClient();

if (!process.env.JWT_SECRET) {
  throw new Error("ocorreu um erro no JWT_SECRET");
}

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET,
});

app.register(authRoutes);

app.addHook("preHandler", async (request, reply) => {
  // Libera qualquer GET
  if (request.method === "GET") {
    return;
  }
  ///////////////////////

  if (
    request.url !== "/registro" &&
    request.url !== "/login" &&
    request.url !== "/gerarPDF" &&
    request.url !== "/solicitarOrdens"
  ) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  }
});

app.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
});

const start = async () => {
  try {
    await app.listen({ port: 3000 });
    console.log("Servidor rodando em: http://localhost:3000");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
