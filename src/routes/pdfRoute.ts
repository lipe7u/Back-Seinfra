import { FastifyInstance } from "fastify";
import { gerarPdfSolicitacoes } from "../controllers/pdfController";

export default async function pdfRoute(fastify: FastifyInstance) {
  fastify.get("/gerarPdfSolicitacoes", gerarPdfSolicitacoes); 
}
