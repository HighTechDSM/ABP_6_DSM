export type StatusSessao =
  | "ativa"
  | "finalizada"
  | "cancelada";

export interface Sessao {
  id: number;
  session_id: string;
  usuario_id: number;
  categoria: string | null;
  pergunta_atual: string | null;
  finalizada: boolean;
  status: StatusSessao;
  inicio_sessao: Date | string;
  fim_sessao: Date | string | null;
  atualizado_em: Date | string;
}

export interface CriarSessaoDTO {
  session_id: string;
  usuario_id: number;
  categoria?: string | null;
}
