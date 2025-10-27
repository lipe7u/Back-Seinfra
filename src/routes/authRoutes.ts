import { FastifyInstance } from "fastify";
import { registro, login, registrarAdmin } from "../controllers/authController";
import { criarSolicitacao, listarMinhasSolicitacoes } from "../controllers/solicitacoes";


export default async function authRoutes(fastify: FastifyInstance) {
  console.log("Rotas de autenticação e solicitação registradas!"); 
  fastify.post("/registro", registro); 
  fastify.post("/login", login);   
  fastify.post("/registro-admin", registrarAdmin);   
  fastify.post("/novaSolicitacao", criarSolicitacao);  
  fastify.get("/minhas-solicitacoes", listarMinhasSolicitacoes);   
}
