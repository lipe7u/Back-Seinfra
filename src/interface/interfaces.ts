export interface RegistroB {
  cpf: string;
  nome: string;
  telefone: string;
  senha: string;
}

export interface LoginB {
  cpf?: string;
  telefone?: string;
  senha: string;
}

export interface RegistroAdminB {
  cpf: string;
  senha: string;
  telefone: string;
}

export interface SolicitacaoInput {
  categoriaId?: string
  endereco: string
  pontoReferencia?: string
  descricao: string
  imagemUrl?: string
}
