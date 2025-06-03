"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarMinhasSolicitacoes = exports.criarSolicitacao = void 0;
const client_1 = require("@prisma/client");
const zodsolicitacoes_1 = require("../validators/zodsolicitacoes");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const criarSolicitacao = async (request, reply) => {
    try {
        const body = zodsolicitacoes_1.criarSolicitacaoSchema.parse(request.body);
        const id_user = 36
        const setorResponsavel = 2;
        
        const solicitacao = await prisma.registro_ordens.create({
            data: {
                id_solicitante: id_user,
                setor_resp: setorResponsavel,
                endereco: body.endereco,
                referencia: body.pontoReferencia,
                descricao: body.descricao,
                status: "PENDENTE",
                data_criacao: new Date(),
            },
        });
        if (body.imagemUrl) {
            await prisma.imagens_ordens.create({
                data: {
                    id_os: solicitacao.id_ordem,
                    caminho_arquivo: body.imagemUrl,
                },
            });
        }
        return reply.status(201).send({
            id: solicitacao.id_ordem,
            mensagem: "Solicitação criada com sucesso",
            solicitacao,
        });
    }
    catch (error) {
        console.log(error)

        const MensagemDeError = error instanceof zod_1.z.ZodError ? error.format() : "Erro ao criar solicitação";
        return reply.status(400).send({ error: MensagemDeError });
    }
};
exports.criarSolicitacao = criarSolicitacao;
const listarMinhasSolicitacoes = async (request, reply) => {
    try {
        const { id: id_user } = request.user;
        const solicitacoes = await prisma.registro_ordens.findMany({
            where: {
                id_solicitante: id_user,
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
                status: s.status === "FINALIZADA"
                    ? "Finalizada"
                    : s.status === "EM_EXECUCAO"
                        ? "Em execução"
                        : "Pendente",
                dataSolicitacao: s.data_criacao ? s.data_criacao.toLocaleDateString("pt-BR") : null,
                dataConclusao: (_b = (_a = s.data_conclusao) === null || _a === void 0 ? void 0 : _a.toLocaleDateString("pt-BR")) !== null && _b !== void 0 ? _b : null,
            });
        });
        return reply.send(solicitacoesFormatadas);
    }
    catch (error) {
        const MensagemDeError = error instanceof Error ? error.message : "Erro ao listar solicitações";
        return reply.status(500).send({ error: MensagemDeError });
    }
};
exports.listarMinhasSolicitacoes = listarMinhasSolicitacoes;
