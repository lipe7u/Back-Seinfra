export interface RegisterB {
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

export interface LoginAdminB {
  cpf: string;
  senha: string;
}

export interface RegisterAdminB {
  cpf: string; 
  senha: string; 
  telefone: string;
}


