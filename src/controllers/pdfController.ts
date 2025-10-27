import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const prisma = new PrismaClient();

// !! IMPORTANTE: CASO QUEIRA FAZER TESTES, RETIRAR A LINHA 21(SÓ IRÁ FUNCIONAR CASO O PROGRAMA RECONHEÇA QUE O STATUS DAS OS ESTEJAM FINALIZADAS, E SÓ TEM PENDENTES POR ENQUANTO)
// !! PARA TESTAR O GERADOR, PEGUE O TOKEN JWT, COLOQUE NO HEADER DO POSTMAN, ALTERE A REQUISIÇÃO PARA 'GET' E COLOQUE A ROTA, SEND
// Função para gerar o PDF de cada solicitação finalizada
export const gerarPdfSolicitacoes = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    // Obtém o ID do usuário autenticado
    const { id: id_user } = request.user as { id: number; Admin: boolean };

    // Busca as solicitações do usuário, com status 'FINALIZADA'
    const solicitacoes = await prisma.registro_ordens.findMany({
      where: {
        id_solicitante: id_user, // Somente solicitações do usuário autenticado
        status: 'FINALIZADA',
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
      orderBy: {
        data_criacao: "desc", // Ordenando por data de criação
      },
    });

    if (solicitacoes.length === 0) {
      return reply.status(404).send({ error: "Nenhuma solicitação finalizada encontrada." });
    }

    // Busca as informações do usuário
    const usuario = await prisma.usuarios.findUnique({
      where: {
        id_user: id_user,
      },
      select: {
        nome: true,
        cpf: true,
        telefone: true,
      },
    });

    if (!usuario) {
      return reply.status(404).send({ error: "Usuário não encontrado." });
    }

    // Criar um PDF para cada solicitação
    for (const solicitacao of solicitacoes) {
      const pdfDoc = await PDFDocument.create();
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      let next_pos = 50; // Posição inicial

      // Função auxiliar para desenhar o texto no PDF
      function drawText(texto: string, fontSize: number, color: any, font: any, x: number, y: number) {
        page.drawText(texto, {
          x,
          y,
          size: fontSize,
          font,
          color,
        });
      }


      const corPreta = rgb(0, 0, 0);

      // Título do Relatório
      drawText('Relatório de Solicitação Finalizada', 20, corPreta, timesRomanFont, 30, height - next_pos);
      next_pos += 30;

      // Informações do Usuário
      drawText('Informações do Usuário:', 15, corPreta, timesRomanFont, 30, height - next_pos);
      next_pos += 20;
      drawText(`Nome: ${usuario.nome}`, 12, corPreta, timesRomanFont, 30, height - next_pos);
      next_pos += 15;
      drawText(`CPF: ${usuario.cpf}`, 12, corPreta, timesRomanFont, 30, height - next_pos);
      next_pos += 15;
      drawText(`Telefone: ${usuario.telefone}`, 12, corPreta, timesRomanFont, 30, height - next_pos);
      next_pos += 30;

      // Informações sobre a Ordem de Serviço
      drawText('Informações sobre a Ordem de Serviço:', 15, corPreta, timesRomanFont, 30, height - next_pos);
      next_pos += 20;
      drawText(`ID da Ordem: ${solicitacao.id_ordem}`, 12, corPreta, timesRomanFont, 30, height - next_pos);
      next_pos += 15;
      drawText(`Endereço: ${solicitacao.endereco}`, 12, corPreta, timesRomanFont, 30, height - next_pos);
      next_pos += 15;
      drawText(`Ponto de Referência: ${solicitacao.referencia || 'Não informado'}`, 12, corPreta, timesRomanFont, 30, height - next_pos);
      next_pos += 15;
      drawText(`Descrição: ${solicitacao.descricao}`, 12, corPreta, timesRomanFont, 30, height - next_pos);
      next_pos += 15; 
      drawText(`Status: ${solicitacao.status}`, 12, corPreta, timesRomanFont, 30, height - next_pos);
      next_pos += 15;
      drawText(`Data de Criação: ${solicitacao.data_criacao?.toLocaleDateString('pt-BR')}`, 12, corPreta, timesRomanFont, 30, height - next_pos);
      next_pos += 15;
      drawText(`Data de Conclusão: ${solicitacao.data_conclusao ? solicitacao.data_conclusao.toLocaleDateString('pt-BR') : 'Não concluída'}`, 12, corPreta, timesRomanFont, 30, height - next_pos);
      next_pos += 30;

      // Salva o PDF da solicitação individual
      const pdfBytes = await pdfDoc.save();

      // Nomeando o arquivo com o ID da Ordem
      const nomeArquivo = `solicitacao_${solicitacao.id_ordem}.pdf`;

      // Envia o PDF como resposta (cada solicitação em um arquivo separado)
      reply.header("Content-Type", "application/pdf");
      reply.header("Content-Disposition", `attachment; filename=${nomeArquivo}`);
      reply.send(pdfBytes);
    }

  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    reply.status(500).send({ error: "Erro ao gerar PDF" });
  }
};
