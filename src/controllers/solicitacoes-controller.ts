import { FastifyRequest, FastifyReply } from "fastify";
import { CriarSolicitacaoSchema } from "../validators/validations";
import { SolicitacaoInput } from "../interface/requests-interface";
import { SolicitacoesService } from "../services/solicitacoes-service";
import { z } from "zod";
import { prisma } from "../server";

export const CriarSolicitacao = async (
  request: FastifyRequest<{ Body: SolicitacaoInput }>,
  reply: FastifyReply
) => {
  try {
    const body = CriarSolicitacaoSchema.parse(request.body);
    const { id: userId } = request.user as { id: number; Admin: boolean };
    
    const resultado = await SolicitacoesService.CriarSolicitacao({
      body,
      userId
    })
    
    return reply.status(201).send(resultado);
          
    } catch (error) {
  if (error instanceof z.ZodError) {
    return reply.status(400).send({
      codigo: "VALIDATION_ERROR",
      mensagem: "Os dados enviados não estão no formato esperado.",
      detalhes: error.errors.map(e => ({
        campo: e.path.join("."),
        mensagem: e.message,
        tipoErro: e.code
      }))
    });
  }

  return reply.status(500).send({
    codigo: "INTERNAL_SERVER_ERROR",
    mensagem: "Ocorreu um erro inesperado ao processar sua solicitação.",
    detalhes: error instanceof Error ? error.message : String(error),
    sugestao: "Tente novamente mais tarde ou entre em contato com o suporte."
  });
}

};

export const ListarSolicitacoes = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id: id_user } = request.user as { id: number; Admin: boolean };
    const solicitacoes = await SolicitacoesService.ListarSolicitacoes(id_user);
    return reply.send(solicitacoes)

  } catch (error) {
    const MensagemDeError = error instanceof Error
      ? error.message
      : "Erro ao listar solicitaçôes"

    return reply.status(500).send({ error: MensagemDeError });
  }
};
