
import express from 'express';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Prisma } from '@prisma/client';
import { prisma } from "../server";
import * as bcrypt from "bcryptjs";
import { number } from 'zod';


export const SolicitarOrdersInfo = async(
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const info = request.query as { mensagem?: string, id_ordem? : number, justificativa?: string };
  const ordens_e_servicos_bd = await prisma.registro_ordens.findMany();

  if (info.mensagem == "recente") {
    ordens_e_servicos_bd.sort((a, b) =>
      new Date(b.data_criacao || 0).getTime() -
      new Date(a.data_criacao || 0).getTime()
    );

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
