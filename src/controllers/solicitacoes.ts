import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";
import { criarSolicitacaoSchema } from "../validators/zodsolicitacoes";
import { SolicitacaoInput } from "../interface/interfaces";
import { z } from "zod";


const prisma = new PrismaClient();

// Função para criar uma nova solicitação
export const criarSolicitacao = async (
  request: FastifyRequest<{ Body: SolicitacaoInput }>, // Tipagem da requisição para incluir o corpo da solicitação
  reply: FastifyReply // Tipagem da resposta
) => {
  try {
    // Valida o corpo da requisição usando o esquema Zod e o transforma em SolicitacaoInput
    const body = criarSolicitacaoSchema.parse(request.body) as SolicitacaoInput;

    // Obtém o ID do usuário a partir do token JWT
    const { id: id_user } = request.user as { id: number; Admin: boolean };
    const setorResponsavel = 2;

    // Cria uma nova solicitação no banco de dados
    const solicitacao = await prisma.registro_ordens.create({
      data: {
        id_solicitante: id_user,
        setor_resp: setorResponsavel, 
        endereco: body.endereco, 
        referencia: body.pontoReferencia, // (opcional)
        descricao: body.descricao, 
        status: "PENDENTE",
        data_criacao: new Date(), 
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
  } catch (error) {
    // Se ocorrer um erro, formata a mensagem de erro
    const MensagemDeError =
      error instanceof z.ZodError ? error.format() : "Erro ao criar solicitação";
    return reply.status(400).send({ error: MensagemDeError }); // Retorna um erro 400 com a mensagem
  }
};

// Função para listar as solicitações do usuário autenticado
export const listarMinhasSolicitacoes = async (
  request: FastifyRequest, // Tipagem da requisição
  reply: FastifyReply // Tipagem da resposta
) => {
  try {
    const { id: id_user } = request.user as { id: number; Admin: boolean };     // Obtém o ID do usuário a partir do token JWT

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
    const solicitacoesFormatadas = solicitacoes.map((s: any) => ({
      id: s.id_ordem, // ID da solicitação
      endereco: s.endereco, // Endereço da solicitação
      referencia: s.referencia, // Ponto de referência
      problema: s.descricao.slice(0, 200) + (s.descricao.length > 200 ? "..." : ""), // Descrição truncada
      status:
        s.status === "FINALIZADA"
          ? "Finalizada"
          : s.status === "EM_EXECUCAO"
          ? "Em execução"
          : "Pendente", // Formatação do status
      dataSolicitacao: s.data_criacao ? s.data_criacao.toLocaleDateString("pt-BR") : null, // Formatação da data de criação
      dataConclusao: s.data_conclusao?.toLocaleDateString("pt-BR") ?? null, // Formatação da data de conclusão
    }));

    // Retorna as solicitações formatadas
    return reply.send(solicitacoesFormatadas);
  } catch (error) {
    // Se ocorrer um erro, formata a mensagem de erro
    const MensagemDeError =
      error instanceof Error ? error.message : "Erro ao listar solicitações";
    return reply.status(500).send({ error: MensagemDeError }); // Retorna um erro 500 com a mensagem
  }
};
