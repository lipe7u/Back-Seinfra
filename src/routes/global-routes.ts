import { FastifyInstance } from "fastify";
import { registerAdmin } from "../controllers/register-adm-controller";
import { register } from "../controllers/register-controller";
import { login } from "../controllers/login-controller";
import {
  CriarSolicitacao,
  ListarSolicitacoes,
} from "../controllers/solicitacoes-controller";
import { generateRequestsPdf } from "../controllers/pdfController";
import { CancelarOrdem } from "../controllers/orders-list-controller";
import { SolicitarOrdersInfo } from "../controllers/orders-list-controller";

export default async function GlobalRoutes(app: FastifyInstance) {
  app.post("/registro", register);
  app.post("/login", login);
  app.post("/registro-admin", registerAdmin);
  app.post("/novaSolicitacao", CriarSolicitacao);
  app.get("/minhas-solicitacoes", ListarSolicitacoes);
  app.get("/gerarPdfSolicitacoes", generateRequestsPdf);
  console.log("Rotas de autenticação e solicitação registradas!");
  app.post("/cancelarOrdem", CancelarOrdem);
  app.get("/solicitarOrdens", SolicitarOrdersInfo);
}
