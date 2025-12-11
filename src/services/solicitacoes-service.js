"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolicitacoesService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class SolicitacoesService {
    static async CriarSolicitacao({ body, userId }) {
        const setorResponsavel = 2;
        const solicitacao = await prisma.registro_ordens.create({
            data: {
                id_solicitante: userId,
                setor_resp: setorResponsavel,
                endereco: body.endereco,
                referencia: body.pontoReferencia,
                descricao: body.descricao,
                status: "PENDENTE",
                data_criacao: new Date(),
            },
        });
        if (body.imagemUrl && body.imagemUrl.trim() !== "") {
            await prisma.imagens_ordens.create({
                data: {
                    id_os: solicitacao.id_ordem,
                    caminho_arquivo: body.imagemUrl,
                },
            });
        }
        return {
            id: solicitacao.id_ordem,
            mensagem: "Solicitação criada com sucesso",
            solicitacao,
        };
    }
    static async ListarSolicitacoes(userId) {
        const solicitacoes = await prisma.registro_ordens.findMany({
            where: {
                id_solicitante: userId,
            },
            select: {
                id_ordem: true,
                endereco: true,
                referencia: true,
                descricao: true,
                imagens_ordens: true,
                status: true,
                data_criacao: true,
                data_conclusao: true,
            },
            orderBy: {
                data_criacao: "desc",
            },
        });
        const solicitacoesFormatadas = solicitacoes.map((s) => {
            var _a, _b;
            return ({
                id: s.id_ordem,
                endereco: s.endereco,
                referencia: s.referencia,
                problema: s.descricao.slice(0, 200) + (s.descricao.length > 200 ? "..." : ""),
                status: this.formatarStatus(s.status),
                dataSolicitacao: s.data_criacao ? s.data_criacao.toLocaleDateString("pt-BR") : null,
                dataConclusao: (_b = (_a = s.data_conclusao) === null || _a === void 0 ? void 0 : _a.toLocaleDateString("pt-BR")) !== null && _b !== void 0 ? _b : null,
            });
        });
        return solicitacoesFormatadas;
    }
    static formatarStatus(status) {
        const statusMap = {
            FINALIZADA: "Finalizada",
            EM_EXECUCAO: "Em execução",
            PENDENTE: "Pendente",
        };
        return statusMap[status] || status;
    }
}
exports.SolicitacoesService = SolicitacoesService;
