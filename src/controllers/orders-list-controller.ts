import { prisma } from "../server";
import { FastifyReply, FastifyRequest } from 'fastify';
import { ordersqueryschema } from "../validators/orders-query";


export const SolicitarOrdersInfo = async(
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const info = ordersqueryschema.parse(request.query);
  const ordens_e_servicos_bd = await prisma.registro_ordens.findMany({
    orderBy: {
      data_criacao: 'desc'
    }
  });

  if (info.mensagem == "recente") {
    reply.send(ordens_e_servicos_bd);
  }
  else if (info.mensagem == 'pendente') {
    reply.send(ordens_e_servicos_bd.filter(ordem => ordem.status === "PENDENTE"))
  }
  else if (info.mensagem == 'concluido') {
    reply.send(ordens_e_servicos_bd.filter(ordem => ordem.status === "CONCLUIDO"))
  }
  else if (!isNaN(Number(info.mensagem))) {
    reply.send(ordens_e_servicos_bd.filter(ordem => ordem.id_ordem === Number(info.mensagem)))
  }
}
