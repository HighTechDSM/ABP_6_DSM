export interface Usuario {
  id: number;
  nome: string;
  telefone: string;
  criado_em: Date | string;
  atualizado_em: Date | string;
}

export interface CriarUsuarioDTO {
  nome: string;
  telefone: string;
}

export type AtualizarUsuarioDTO = Partial<CriarUsuarioDTO>;
