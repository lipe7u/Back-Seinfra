import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import authRoutes from "./routes/global-routes";
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
  if (request.method === "GET" && 
    request.url.split("?")[0] === "/solicitarOrdens"
  ) {
    return;
  }

  if (
    request.url !== "/registro" &&
    request.url !== "/login" &&
    request.url !== "/gerarPDF" &&
    request.url !== "/cancelarOrdem" &&
    request.url !== "/login-admin" &&
    request.url !== "/registro-admin"
    

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

const port = process.env.PORT ? parseInt(process.env.PORT): 3000;
const start = async () => {
  try {
    await app.listen({ port, host: "0.0.0.0" });
    console.log("Servidor rodando em: http://localhost:3000");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
