"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListarSolicitacoes = exports.CriarSolicitacao = void 0;
const validations_1 = require("../validators/validations");
const solicitacoes_service_1 = require("../services/solicitacoes-service");
const zod_1 = require("zod");
const CriarSolicitacao = async (request, reply) => {
    try {
        const body = validations_1.CriarSolicitacaoSchema.parse(request.body);
        const { id: userId } = request.user;
        const resultado = await solicitacoes_service_1.SolicitacoesService.CriarSolicitacao({
            body,
            userId
        });
        return reply.status(201).send(resultado);
    }
    catch (error) {
        const MensagemDeError = error instanceof zod_1.z.ZodError
            ? error.format()
            : "Erro ao criar solicitação";
        return reply.status(400).send({ error: MensagemDeError });
    }
};
exports.CriarSolicitacao = CriarSolicitacao;
const ListarSolicitacoes = async (request, reply) => {
    try {
        const { id: id_user } = request.user;
        const solicitacoes = await solicitacoes_service_1.SolicitacoesService.ListarSolicitacoes(id_user);
        return reply.send(solicitacoes);
    }
    catch (error) {
        const MensagemDeError = error instanceof Error
            ? error.message
            : "Erro ao listar solicitaçôes";
        return reply.status(500).send({ error: MensagemDeError });
    }
};
exports.ListarSolicitacoes = ListarSolicitacoes;
