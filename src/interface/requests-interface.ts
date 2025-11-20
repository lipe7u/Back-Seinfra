export interface SolicitacaoInput {
  endereco: string;
  pontoReferencia?: string;
  descricao: string;
  imagemUrl?: string;
}

export interface CriarSolicitacaoData {
  body: SolicitacaoInput;
  userId: number;
}

export interface SolicitacaoFormatada {
  id: number;
  endereco: string;
  referencia: string | null;
  problema: string;
  status: string;
  dataSolicitacao: string | null;
  dataConclusao: string | null;
}
