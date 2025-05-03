import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";
import { criarSolicitacaoSchema } from "../validators/zodsolicitacoes";
import { SolicitacaoInput } from "../interface/interfaces";
import { z } from "zod";

const prisma = new PrismaClient();

export const criarSolicitacao = async (
  request: FastifyRequest<{ Body: SolicitacaoInput }>,
  reply: FastifyReply
) => {
  try {
    const body = criarSolicitacaoSchema.parse(request.body) as SolicitacaoInput;
    const setorResponsavel = 1;

    const solicitacao = await prisma.registro_ordens.create({
      data: {
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
  } catch (error) {
    const MensagemDeError =
      error instanceof z.ZodError ? error.format() : "Erro ao criar solicitação";
    return reply.status(400).send({ error: MensagemDeError });
  }
};

export const listarMinhasSolicitacoes = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id: id_user } = request.user as { id: number; Admin: boolean };
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

    const solicitacoesFormatadas = solicitacoes.map((s: any) => ({
      id: s.id_ordem,
      endereco: s.endereco,
      referencia: s.referencia,
      problema: s.descricao.slice(0, 200) + (s.descricao.length > 200 ? "..." : ""),
      status:
        s.status === "FINALIZADA"
          ? "Finalizada"
          : s.status === "EM_EXECUCAO"
          ? "Em execução"
          : "Pendente",
      dataSolicitacao: s.data_criacao ? s.data_criacao.toLocaleDateString("pt-BR") : null,
      dataConclusao: s.data_conclusao?.toLocaleDateString("pt-BR") ?? null,
    }));

    return reply.send(solicitacoesFormatadas);
  } catch (error) {
    const MensagemDeError =
      error instanceof Error ? error.message : "Erro ao listar solicitações";
    return reply.status(500).send({ error: MensagemDeError });
  }
};
