import { FastifyRequest, FastifyReply } from "fastify";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { prisma } from "../server";

export const generateRequestsPdf = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id: id_user } = request.user as { id: number; Admin: boolean };

    // 🔹 Datas obrigatórias (input type="date")
    const { dataInicio, dataFim } = request.query as {
      dataInicio: string;
      dataFim: string;
    };

    if (!dataInicio || !dataFim) {
      return reply.status(400).send({
        error: "dataInicio e dataFim são obrigatórios.",
      });
    }

    // 🔹 Ajuste correto para DateTime do PostgreSQL
    const inicio = new Date(`${dataInicio}T00:00:00`);
    const fim = new Date(`${dataFim}T23:59:59.999`);

    // 🔹 Consulta alinhada ao schema registro_ordens
    const solicitacoes = await prisma.registro_ordens.findMany({
      where: {
        id_solicitante: id_user,
        status: "FINALIZADA",
        data_criacao: {
          gte: inicio,
          lte: fim,
        },
      },
      orderBy: {
        data_criacao: "asc",
      },
      select: {
        id_ordem: true,
        endereco: true,
        referencia: true,
        descricao: true,
        status: true,
        data_criacao: true,
        data_conclusao: true,
      },
    });

    if (solicitacoes.length === 0) {
      return reply.status(404).send({
        error: "Nenhuma solicitação encontrada no período informado.",
      });
    }

    const usuario = await prisma.usuarios.findUnique({
      where: { id_user },
      select: {
        nome: true,
        cpf: true,
        telefone: true,
      },
    });

    if (!usuario) {
      return reply.status(404).send({ error: "Usuário não encontrado." });
    }

    // ================= PDF =================
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const corPreta = rgb(0, 0, 0);

    for (const solicitacao of solicitacoes) {
      const page = pdfDoc.addPage();
      const { height } = page.getSize();
      let y = height - 50;

      const drawText = (text: string, size = 12) => {
        page.drawText(text, {
          x: 30,
          y,
          size,
          font,
          color: corPreta,
        });
        y -= size + 6;
      };

      drawText("Relatório de Solicitação Finalizada", 18);
      y -= 10;

      drawText(`Nome: ${usuario.nome ?? "Não informado"}`);
      drawText(`CPF: ${usuario.cpf}`);
      drawText(`Telefone: ${usuario.telefone}`);
      y -= 10;

      drawText(`ID da Ordem: ${solicitacao.id_ordem}`);
      drawText(`Endereço: ${solicitacao.endereco}`);
      drawText(`Referência: ${solicitacao.referencia ?? "Não informado"}`);
      drawText(`Descrição: ${solicitacao.descricao}`);
      drawText(`Status: ${solicitacao.status}`);
      drawText(
        `Data de Criação: ${
          solicitacao.data_criacao
            ? solicitacao.data_criacao.toLocaleDateString("pt-BR")
            : "-"
        }`
      );
      drawText(
        `Data de Conclusão: ${
          solicitacao.data_conclusao
            ? solicitacao.data_conclusao.toLocaleDateString("pt-BR")
            : "Não concluída"
        }`
      );
    }

    const pdfBytes = await pdfDoc.save();

    reply.header("Content-Type", "application/pdf");
    reply.header(
      "Content-Disposition",
      "attachment; filename=relatorio_solicitacoes.pdf"
    );

    return reply.send(pdfBytes);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return reply.status(500).send({ error: "Erro ao gerar PDF" });
  }
};
