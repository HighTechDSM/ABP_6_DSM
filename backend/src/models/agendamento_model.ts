export type StatusAgendamento =
  | "agendado"
  | "confirmado"
  | "realizado"
  | "cancelado"
  | "nao_compareceu";

export interface Agendamento {
  id: number;
  usuario_id: number;
  sessao_id: number;
  data_agendamento: string;
  horario: string;
  status: StatusAgendamento;
  observacoes: string | null;
  criado_em: Date | string;
  atualizado_em: Date | string;
}

export interface CriarAgendamentoDTO {
  usuario_id: number;
  sessao_id: number;
  data_agendamento: string;
  horario: string;
  observacoes?: string | null;
}

export interface AtualizarStatusAgendamentoDTO {
  status: StatusAgendamento;
}
