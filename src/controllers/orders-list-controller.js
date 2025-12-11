"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelarOrdem = exports.SolicitarOrdersInfo = void 0;
const server_1 = require("../server");
const orders_query_1 = require("../validators/orders-query");
const SolicitarOrdersInfo = async (request, reply) => {
    const info = orders_query_1.ordersqueryschema.parse(request.query);
    const ordens_e_servicos_bd = await server_1.prisma.registro_ordens.findMany({
        orderBy: {
            data_criacao: 'desc'
        }
    });
    if (info.mensagem == "recente") {
        reply.send(ordens_e_servicos_bd);
    }
    else if (info.mensagem == 'pendente') {
        reply.send(ordens_e_servicos_bd.filter((ordem) => ordem.status === "PENDENTE"));
    }
    else if (info.mensagem == 'concluido') {
        reply.send(ordens_e_servicos_bd.filter((ordem) => ordem.status === "CONCLUIDO"));
    }
    else if (!isNaN(Number(info.mensagem))) {
        reply.send(ordens_e_servicos_bd.filter((ordem) => ordem.id_ordem === Number(info.mensagem)));
    }
};
exports.SolicitarOrdersInfo = SolicitarOrdersInfo;
const CancelarOrdem = async (request, reply) => {
    const body = request.body;
    if (!body.id_ordem) {
        reply.status(400).send('é preciso do ID da ordem para cancelar');
        return;
    }
    if (!body.justificativa) {
        reply.status(400).send('é preciso uma justificativa para cancelar');
        return;
    }
    const ordem = await server_1.prisma.registro_ordens.findUnique({
        where: { id_ordem: Number(body.id_ordem) }
    });
    if (!ordem) {
        reply.status(404).send('Ordem não encontrada');
        return;
    }
    const ordem_cancelada = await server_1.prisma.registro_ordens.update({
        where: { id_ordem: Number(body.id_ordem) },
        data: {
            status: "CANCELADO",
            Justificativa: body.justificativa
        }
    });
    reply.send(`ordem "${ordem_cancelada.id_ordem}" de descrição "${ordem_cancelada.descricao}" foi cancelada. -${ordem_cancelada.Justificativa}`);
};
exports.CancelarOrdem = CancelarOrdem;
