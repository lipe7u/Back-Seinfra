import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import authRoutes from "./routes/authRoutes";
import { registroJwt } from "./utils/jwt";
import * as dotenv from "dotenv";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "fastify-jwt";
import pdfRoute from "./routes/pdfRoute";

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Cria uma instância do servidor Fastify
const app = fastify();
// Cria uma instância do cliente Prisma para interagir com o banco de dados
const prisma = new PrismaClient();

// Verifica se a variável de ambiente JWT_SECRET está definida
if (!process.env.JWT_SECRET) {
  throw new Error("ocorreu um erro no JWT_SECRET"); // Lança um erro se a variável não estiver definida
}

// Registra o plugin fastify-jwt com a chave secreta para assinar os tokens
app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET,
});

// Registra as rotas de autenticação
app.register(authRoutes);

// Registra as rotas do gerador de pdf
app.register(pdfRoute)

// Middleware que verifica o token JWT apenas nas rotas que precisam de autenticação
app.addHook("preHandler", async (request, reply) => {
  // Verifica se a rota é uma que requer autenticação
  if (request.url !== "/registro" && request.url !== "/login" && request.url !== "/gerarPDF") {
    try {
      await request.jwtVerify(); // Verifica o token JWT
    } catch (err) {
      reply.send(err); // Se o token não for válido, retorna o erro
    }
  }
});

// Registra o plugin CORS para permitir requisições de diferentes origens
app.register(fastifyCors, {
  origin: "*", // Permite requisições de qualquer origem
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos HTTP permitidos
  allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"], // Cabeçalhos permitidos
});

// Função para iniciar o servidor
const start = async () => {
  try {
    // Inicia o servidor na porta 3000
    await app.listen({ port: 3000 });
    console.log("Servidor rodando em: http://localhost:3000"); // Log de confirmação
  } catch (err) {
    console.error(err); // Log de erro se a inicialização falhar
    process.exit(1); // Encerra o processo com erro
  }
};

// Chama a função para iniciar o servidor
start();
