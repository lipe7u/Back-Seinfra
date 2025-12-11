"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRequestsPdf = void 0;
const pdf_lib_1 = require("pdf-lib");
const server_1 = require("../server");
const generateRequestsPdf = async (request, reply) => {
    var _a;
    try {
        const { id: id_user } = request.user;
        const solicitacoes = await server_1.prisma.registro_ordens.findMany({
            where: {
                id_solicitante: id_user,
                status: "FINALIZADA",
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
                data_criacao: "desc",
            },
        });
        if (solicitacoes.length === 0) {
            return reply
                .status(404)
                .send({ error: "Nenhuma solicitação finalizada encontrada." });
        }
        const usuario = await server_1.prisma.usuarios.findUnique({
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
        for (const solicitacao of solicitacoes) {
            const pdfDoc = await pdf_lib_1.PDFDocument.create();
            const timesRomanFont = await pdfDoc.embedFont(pdf_lib_1.StandardFonts.TimesRoman);
            const page = pdfDoc.addPage();
            const { width, height } = page.getSize();
            let next_pos = 50;
            function drawText(texto, fontSize, color, font, x, y) {
                page.drawText(texto, {
                    x,
                    y,
                    size: fontSize,
                    font,
                    color,
                });
            }
            const corPreta = (0, pdf_lib_1.rgb)(0, 0, 0);
            drawText("Relatório de Solicitação Finalizada", 20, corPreta, timesRomanFont, 30, height - next_pos);
            next_pos += 30;
            drawText("Informações do Usuário:", 15, corPreta, timesRomanFont, 30, height - next_pos);
            next_pos += 20;
            drawText(`Nome: ${usuario.nome}`, 12, corPreta, timesRomanFont, 30, height - next_pos);
            next_pos += 15;
            drawText(`CPF: ${usuario.cpf}`, 12, corPreta, timesRomanFont, 30, height - next_pos);
            next_pos += 15;
            drawText(`Telefone: ${usuario.telefone}`, 12, corPreta, timesRomanFont, 30, height - next_pos);
            next_pos += 30;
            drawText("Informações sobre a Ordem de Serviço:", 15, corPreta, timesRomanFont, 30, height - next_pos);
            next_pos += 20;
            drawText(`ID da Ordem: ${solicitacao.id_ordem}`, 12, corPreta, timesRomanFont, 30, height - next_pos);
            next_pos += 15;
            drawText(`Endereço: ${solicitacao.endereco}`, 12, corPreta, timesRomanFont, 30, height - next_pos);
            next_pos += 15;
            drawText(`Ponto de Referência: ${solicitacao.referencia || "Não informado"}`, 12, corPreta, timesRomanFont, 30, height - next_pos);
            next_pos += 15;
            drawText(`Descrição: ${solicitacao.descricao}`, 12, corPreta, timesRomanFont, 30, height - next_pos);
            next_pos += 15;
            drawText(`Status: ${solicitacao.status}`, 12, corPreta, timesRomanFont, 30, height - next_pos);
            next_pos += 15;
            drawText(`Data de Criação: ${(_a = solicitacao.data_criacao) === null || _a === void 0 ? void 0 : _a.toLocaleDateString("pt-BR")}`, 12, corPreta, timesRomanFont, 30, height - next_pos);
            next_pos += 15;
            drawText(`Data de Conclusão: ${solicitacao.data_conclusao
                ? solicitacao.data_conclusao.toLocaleDateString("pt-BR")
                : "Não concluída"}`, 12, corPreta, timesRomanFont, 30, height - next_pos);
            next_pos += 30;
            const pdfBytes = await pdfDoc.save();
            const nomeArquivo = `solicitacao_${solicitacao.id_ordem}.pdf`;
            reply.header("Content-Type", "application/pdf");
            reply.header("Content-Disposition", `attachment; filename=${nomeArquivo}`);
            reply.send(pdfBytes);
        }
    }
    catch (error) {
        console.error("Erro ao gerar PDF:", error);
        reply.status(500).send({ error: "Erro ao gerar PDF" });
    }
};
exports.generateRequestsPdf = generateRequestsPdf;
