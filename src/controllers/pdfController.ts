import { FastifyRequest, FastifyReply } from "fastify";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { prisma } from "../server";

export const generateRequestsPdf = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { dataInicio, dataFim } = request.query as {
      dataInicio: string;
      dataFim: string;
    };

    if (!dataInicio || !dataFim) {
      return reply.status(400).send({
        error: "dataInicio e dataFim são obrigatórios.",
      });
    }

    const inicio = new Date(`${dataInicio}T00:00:00.000Z`);
    const fim = new Date(`${dataFim}T23:59:59.999Z`);

    const solicitacoes = await prisma.registro_ordens.findMany({
      where: {
        status: "CONCLUIDO",
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
        usuarios: {
          select: {
            nome: true,
            cpf: true,
            telefone: true,
          },
        },
      },
    });

    if (solicitacoes.length === 0) {
      return reply.status(404).send({
        error: "Nenhuma solicitação encontrada no período informado.",
      });
    }

    // ================= PDF =================
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const corPreta = rgb(0, 0, 0);

    let page = pdfDoc.addPage();
    let { height } = page.getSize();
    let y = height - 50;

    const margemInferior = 50;

    const drawText = (text: string, size = 12) => {
      if (y < margemInferior) {
        page = pdfDoc.addPage();
        ({ height } = page.getSize());
        y = height - 50;
      }

      page.drawText(text, {
        x: 30,
        y,
        size,
        font,
        color: corPreta,
      });

      y -= size + 6;
    };

    for (const solicitacao of solicitacoes) {
      drawText("Relatório de Ordem de Serviço Finalizada", 16);
      y -= 8;

      drawText(`Nome: ${solicitacao.usuarios?.nome ?? "Não informado"}`);
      drawText(`CPF: ${solicitacao.usuarios?.cpf ?? "Não informado"}`);
      drawText(
        `Telefone: ${solicitacao.usuarios?.telefone ?? "Não informado"}`
      );
      y -= 6;

      drawText(`ID da OS: ${solicitacao.id_ordem}`);
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

      y -= 15;
    }

    const pdfBytes = await pdfDoc.save();

    reply.header("Content-Type", "application/pdf");
    reply.header(
      "Content-Disposition",
      "attachment; filename=relatorio_os_finalizadas.pdf"
    );

    return reply.send(pdfBytes);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return reply.status(500).send({ error: "Erro ao gerar PDF" });
  }
};
