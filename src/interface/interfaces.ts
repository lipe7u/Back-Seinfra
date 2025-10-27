// Define a interface RegistroB que representa os dados necessários para registrar um novo usuário
export interface RegistroB {
  cpf: string; // CPF do usuário, deve ser uma string
  nome: string; // Nome do usuário, deve ser uma string
  telefone: string; // Telefone do usuário, deve ser uma string
  senha: string; // Senha do usuário, deve ser uma string
}

// Define a interface LoginB que representa os dados necessários para o login de um usuário
export interface LoginB {
  cpf?: string; // CPF do usuário, opcional, deve ser uma string se fornecido
  telefone?: string; // Telefone do usuário, opcional, deve ser uma string se fornecido
  senha: string; // Senha do usuário, deve ser uma string
}

// Define a interface RegistroAdminB que representa os dados necessários para registrar um novo administrador
export interface RegistroAdminB {
  cpf: string; // CPF do administrador, deve ser uma string
  senha: string; // Senha do administrador, deve ser uma string
  telefone: string; // Telefone do administrador, deve ser uma string
}

// Define a interface SolicitacaoInput que representa os dados necessários para criar uma nova solicitação
export interface SolicitacaoInput {
  endereco: string; // Endereço da solicitação, deve ser uma string
  pontoReferencia?: string; // Ponto de referência, opcional, deve ser uma string se fornecido
  descricao: string; // Descrição da solicitação, deve ser uma string
  imagemUrl?: string; // URL da imagem, opcional, deve ser uma string se fornecido
}
