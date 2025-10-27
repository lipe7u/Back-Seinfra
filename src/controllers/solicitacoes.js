"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarMinhasSolicitacoes = exports.criarSolicitacao = void 0;
const client_1 = require("@prisma/client");
const zodsolicitacoes_1 = require("../validators/zodsolicitacoes");
const zod_1 = require("zod");
// Cria uma instância do cliente Prisma para interagir com o banco de dados
const prisma = new client_1.PrismaClient();
// Função para criar uma nova solicitação
const criarSolicitacao = async (request, // Tipagem da requisição para incluir o corpo da solicitação
reply // Tipagem da resposta
) => {
    try {
        // Valida o corpo da requisição usando o esquema Zod e o transforma em SolicitacaoInput
        const body = zodsolicitacoes_1.criarSolicitacaoSchema.parse(request.body);
        // Obtém o ID do usuário a partir do token JWT
        const { id: id_user } = request.user;
        const setorResponsavel = 2;
        // Cria uma nova solicitação no banco de dados
        const solicitacao = await prisma.registro_ordens.create({
            data: {
                id_solicitante: id_user, // ID do solicitante
                setor_resp: setorResponsavel, // Setor responsável
                endereco: body.endereco, // Endereço da solicitação
                referencia: body.pontoReferencia, // Ponto de referência (opcional)
                descricao: body.descricao, // Descrição da solicitação
                status: "PENDENTE", // Status inicial da solicitação
                data_criacao: new Date(), // Data de criação da solicitação
            },
        });
        // Se uma URL de imagem for fornecida, cria uma entrada na tabela de imagens
        if (body.imagemUrl) {
            await prisma.imagens_ordens.create({
                data: {
                    id_os: solicitacao.id_ordem, // ID da ordem da solicitação
                    caminho_arquivo: body.imagemUrl, // URL da imagem
                },
            });
        }
        // Retorna uma resposta de sucesso com o ID da solicitação e uma mensagem
        return reply.status(201).send({
            id: solicitacao.id_ordem,
            mensagem: "Solicitação criada com sucesso",
            solicitacao,
        });
    }
    catch (error) {
        // Se ocorrer um erro, formata a mensagem de erro
        const MensagemDeError = error instanceof zod_1.z.ZodError ? error.format() : "Erro ao criar solicitação";
        return reply.status(400).send({ error: MensagemDeError }); // Retorna um erro 400 com a mensagem
    }
};
exports.criarSolicitacao = criarSolicitacao;
// Função para listar as solicitações do usuário autenticado
const listarMinhasSolicitacoes = async (request, // Tipagem da requisição
reply // Tipagem da resposta
) => {
    try {
        const { id: id_user } = request.user; // Obtém o ID do usuário a partir do token JWT
        // Busca as solicitações do usuário no banco de dados
        const solicitacoes = await prisma.registro_ordens.findMany({
            where: {
                id_solicitante: id_user, // Filtra as solicitações pelo ID do solicitante
            },
            select: {
                id_ordem: true, // Seleciona o ID da ordem
                endereco: true, // Seleciona o endereço
                referencia: true, // Seleciona o ponto de referência
                descricao: true, // Seleciona a descrição
                imagens_ordens: true, // Seleciona as imagens associadas
                status: true, // Seleciona o status
                data_criacao: true, // Seleciona a data de criação
                data_conclusao: true, // Seleciona a data de conclusão
            },
            orderBy: {
                data_criacao: "desc", // Ordena as solicitações pela data de criação em ordem decrescente
            },
        });
        // Formata as solicitações para uma resposta mais amigável
        const solicitacoesFormatadas = solicitacoes.map((s) => {
            var _a, _b;
            return ({
                id: s.id_ordem, // ID da solicitação
                endereco: s.endereco, // Endereço da solicitação
                referencia: s.referencia, // Ponto de referência
                problema: s.descricao.slice(0, 200) + (s.descricao.length > 200 ? "..." : ""), // Descrição truncada
                status: s.status === "FINALIZADA"
                    ? "Finalizada"
                    : s.status === "EM_EXECUCAO"
                        ? "Em execução"
                        : "Pendente", // Formatação do status
                dataSolicitacao: s.data_criacao ? s.data_criacao.toLocaleDateString("pt-BR") : null, // Formatação da data de criação
                dataConclusao: (_b = (_a = s.data_conclusao) === null || _a === void 0 ? void 0 : _a.toLocaleDateString("pt-BR")) !== null && _b !== void 0 ? _b : null, // Formatação da data de conclusão
            });
        });
        // Retorna as solicitações formatadas
        return reply.send(solicitacoesFormatadas);
    }
    catch (error) {
        // Se ocorrer um erro, formata a mensagem de erro
        const MensagemDeError = error instanceof Error ? error.message : "Erro ao listar solicitações";
        return reply.status(500).send({ error: MensagemDeError }); // Retorna um erro 500 com a mensagem
    }
};
exports.listarMinhasSolicitacoes = listarMinhasSolicitacoes;
