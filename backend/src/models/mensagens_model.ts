export type TipoMensagem = "BOT" | "USUARIO";

export interface Mensagem {
  id: number;
  sessao_id: number;
  tipo: TipoMensagem;
  mensagem: string;
  etapa: string | null;
  enviada_em: Date | string;
}

export interface CriarMensagemDTO {
  sessao_id: number;
  tipo: TipoMensagem;
  mensagem: string;
  etapa?: string | null;
}
