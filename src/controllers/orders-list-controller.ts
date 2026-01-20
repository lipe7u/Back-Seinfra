import { prisma } from "../server";
import { FastifyReply, FastifyRequest } from 'fastify';
import { ordersqueryschema } from "../validators/orders-query";
import { number } from "zod";



export const SolicitarOrdersInfo = async(
  request: FastifyRequest,
  reply: FastifyReply,
) => {

  const info = ordersqueryschema.parse(request.query);
  const ordens_e_servicos_bd = await prisma.registro_ordens.findMany({
    orderBy: {
      data_criacao: 'desc'
    },
    include: {
      usuarios: {
        select: {
          nome: true,
          telefone: true,
          cpf: true,
        },
      },
    },
  });

  if (info.mensagem == "recente") {

    reply.send(ordens_e_servicos_bd);
  }
  else if (info.mensagem == 'pendente') {
    reply.send(ordens_e_servicos_bd.filter((ordem: typeof ordens_e_servicos_bd[number]) => ordem.status === "PENDENTE"))
  }
  else if (info.mensagem == 'concluido') {
    reply.send(ordens_e_servicos_bd.filter((ordem:typeof ordens_e_servicos_bd[number]) => ordem.status === "CONCLUIDO"))
  }
  else if (!isNaN(Number(info.mensagem))) {
    reply.send(ordens_e_servicos_bd.filter((ordem: typeof ordens_e_servicos_bd[number]) => ordem.id_ordem === Number(info.mensagem)))
  }
}

export const CancelarOrdem = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as { id_ordem?: number; justificativa?: string };

    if (!body.id_ordem) {
      reply.status(400).send('é preciso do ID da ordem para cancelar');
      return;
    }
    if (!body.justificativa) {
      reply.status(400).send('é preciso uma justificativa para cancelar');
      return;
    }

    const ordem = await prisma.registro_ordens.findUnique({
      where: { id_ordem: Number(body.id_ordem) }
    });

    if (!ordem) {
      reply.status(404).send('Ordem não encontrada');
      return;
    }

    const ordem_cancelada = await prisma.registro_ordens.update({
      where: { id_ordem: Number(body.id_ordem) },
      data: {
        status: "CANCELADO",
        Justificativa: body.justificativa
      }
    });

    reply.send(`ordem "${ordem_cancelada.id_ordem}" de descrição "${ordem_cancelada.descricao}" foi cancelada. -${ordem_cancelada.Justificativa}`);
};

export const AlterarStatusOrdem = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const body = request.body as {
    id_ordem?: number;
    status?: "PENDENTE" | "EM_EXECUCAO" | "CONCLUIDO";
  };

  if (!body.id_ordem || !body.status) {
    return reply.status(400).send("ID da ordem e status são obrigatórios");
  }

  const ordem = await prisma.registro_ordens.findUnique({
    where: { id_ordem: body.id_ordem },
  });

  if (!ordem) {
    return reply.status(404).send("Ordem não encontrada");
  }

  const ordemAtualizada = await prisma.registro_ordens.update({
    where: { id_ordem: body.id_ordem },
    data: {
      status: body.status,
    },
  });

  return reply.send({
    message: "Status atualizado com sucesso",
    ordem: ordemAtualizada,
  });
};

