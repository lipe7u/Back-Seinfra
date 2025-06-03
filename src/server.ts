import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import authRoutes from "./routes/authRoutes";
console.log("Tipo de authRoutes:", typeof authRoutes);
import { registroJwt } from "./utils/jwt";
import * as dotenv from "dotenv";
import fastifyCors from "@fastify/cors";



dotenv.config();

const app = fastify();

const prisma =  new PrismaClient();

if (!process.env.JWT_SECRET) {
  throw new Error("ocorreu um erro no JWT_SECRET");
}

registroJwt(app);

app.register(authRoutes);

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
