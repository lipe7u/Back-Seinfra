-- CreateTable
CREATE TABLE "atribuicoes" (
    "id_atribuicoes" SERIAL NOT NULL,
    "ordem" INTEGER,
    "id_resp" INTEGER,
    "data_atribuicao" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "atribuicoes_pkey" PRIMARY KEY ("id_atribuicoes")
);

-- CreateTable
CREATE TABLE "cadastro_colaborador" (
    "id_colab" SERIAL NOT NULL,
    "nome_colab" VARCHAR(200),
    "telefone" VARCHAR(20) NOT NULL,
    "senha_colab" VARCHAR(60),
    "cargo" TEXT NOT NULL,
    "setor_id" INTEGER,

    CONSTRAINT "cadastro_colaborador_pkey" PRIMARY KEY ("id_colab")
);

-- CreateTable
CREATE TABLE "imagens_ordens" (
    "id_imagem" SERIAL NOT NULL,
    "id_os" INTEGER,
    "caminho_arquivo" VARCHAR(255) NOT NULL,

    CONSTRAINT "imagens_ordens_pkey" PRIMARY KEY ("id_imagem")
);

-- CreateTable
CREATE TABLE "registro_ordens" (
    "id_ordem" SERIAL NOT NULL,
    "id_solicitante" INTEGER,
    "setor_resp" INTEGER NOT NULL,
    "endereco" TEXT NOT NULL,
    "referencia" TEXT,
    "descricao" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "data_criacao" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registro_ordens_pkey" PRIMARY KEY ("id_ordem")
);

-- CreateTable
CREATE TABLE "setores" (
    "id_setor" SERIAL NOT NULL,
    "nome_setor" TEXT NOT NULL,

    CONSTRAINT "setores_pkey" PRIMARY KEY ("id_setor")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id_user" SERIAL NOT NULL,
    "nome" VARCHAR(200),
    "telefone" VARCHAR(20) NOT NULL,
    "cpf" CHAR(14) NOT NULL,
    "senha_hash" VARCHAR(60),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_user")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_cpf_key" ON "usuarios"("cpf");

-- AddForeignKey
ALTER TABLE "atribuicoes" ADD CONSTRAINT "atribuicoes_id_resp_fkey" FOREIGN KEY ("id_resp") REFERENCES "cadastro_colaborador"("id_colab") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "atribuicoes" ADD CONSTRAINT "atribuicoes_ordem_fkey" FOREIGN KEY ("ordem") REFERENCES "registro_ordens"("id_ordem") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cadastro_colaborador" ADD CONSTRAINT "cadastro_colaborador_setor_id_fkey" FOREIGN KEY ("setor_id") REFERENCES "setores"("id_setor") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "imagens_ordens" ADD CONSTRAINT "imagens_ordens_id_os_fkey" FOREIGN KEY ("id_os") REFERENCES "registro_ordens"("id_ordem") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "registro_ordens" ADD CONSTRAINT "registro_ordens_id_solicitante_fkey" FOREIGN KEY ("id_solicitante") REFERENCES "usuarios"("id_user") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "registro_ordens" ADD CONSTRAINT "registro_ordens_setor_resp_fkey" FOREIGN KEY ("setor_resp") REFERENCES "setores"("id_setor") ON DELETE NO ACTION ON UPDATE NO ACTION;
