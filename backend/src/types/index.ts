export interface Usuario {
  id: number;
  nome: string;
  telefone: string;
  criado_em?: string;
  atualizado_em?: string;
}

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
  inicio_sessao?: string;
  fim_sessao?: string | null;
}

export type TipoMensagem = "BOT" | "USUARIO";

export interface Mensagem {
  id: number;
  sessao_id: number;
  tipo: TipoMensagem;
  mensagem: string;
  etapa?: string | null;
  enviada_em?: string;
}

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
  observacoes?: string | null;
  criado_em?: string;
  atualizado_em?: string;
}

/**
 * Formato esperado pelo backend TypeScript ao receber
 * a resposta da API do chatbot Python.
 */
export interface RespostaChatbot {
  resposta: string;
  perguntaAtual: string | null;
  categoria: string | null;
  finalizada: boolean;
  necessitaAgendamento: boolean;
}

export interface ErroApi {
  erro: string;
  detalhes?: string;
}
