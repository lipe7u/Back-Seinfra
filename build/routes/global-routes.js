"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GlobalRoutes;
const register_adm_controller_1 = require("../controllers/register-adm-controller");
const register_controller_1 = require("../controllers/register-controller");
const login_controller_1 = require("../controllers/login-controller");
const solicitacoes_controller_1 = require("../controllers/solicitacoes-controller");
const pdfController_1 = require("../controllers/pdfController");
const orders_list_controller_1 = require("../controllers/orders-list-controller");
const orders_list_controller_2 = require("../controllers/orders-list-controller");
const login_admin_controller_1 = require("../controllers/login-admin-controller");
async function GlobalRoutes(app) {
    app.post("/registro", register_controller_1.register);
    app.post("/login", login_controller_1.login);
    app.post("/registro-admin", register_adm_controller_1.registerAdmin);
    app.post("/novaSolicitacao", solicitacoes_controller_1.CriarSolicitacao);
    app.get("/minhas-solicitacoes", solicitacoes_controller_1.ListarSolicitacoes);
    app.get("/gerarPdfSolicitacoes", pdfController_1.generateRequestsPdf);
    app.get("/solicitarOrdens", orders_list_controller_2.SolicitarOrdersInfo);
    app.post("/cancelarOrdem", orders_list_controller_1.CancelarOrdem);
    app.post("/login-admin", login_admin_controller_1.loginAdmin);
    console.log("Rotas de autenticação e solicitação registradas!");
}
