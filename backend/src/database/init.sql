CREATE TABLE IF NOT EXISTS public.usuarios (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    telefone VARCHAR(20) NOT NULL UNIQUE,
    cpf VARCHAR(11) NOT NULL UNIQUE,

    criado_em TIMESTAMP NOT NULL
        DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'),

    atualizado_em TIMESTAMP NOT NULL
        DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'),

    CONSTRAINT chk_usuario_cpf
        CHECK (cpf ~ '^[0-9]{11}$')
);


CREATE TABLE IF NOT EXISTS public.sessoes (
    id BIGSERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL UNIQUE,
    usuario_id BIGINT NOT NULL,
    categoria VARCHAR(100),
    pergunta_atual VARCHAR(100),

    -- Dados temporários durante o fluxo de agendamento
    agendamento_data_temp DATE,
    agendamento_horario_temp TIME,

    finalizada BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(30) NOT NULL DEFAULT 'ativa',

    inicio_sessao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fim_sessao TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_sessao_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES public.usuarios(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_sessao_status
        CHECK (status IN ('ativa', 'finalizada', 'cancelada'))
);


CREATE TABLE IF NOT EXISTS public.mensagens (
    id BIGSERIAL PRIMARY KEY,
    sessao_id BIGINT NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    mensagem TEXT NOT NULL,
    etapa VARCHAR(100),
    enviada_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_mensagem_sessao
        FOREIGN KEY (sessao_id)
        REFERENCES public.sessoes(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_mensagem_tipo
        CHECK (tipo IN ('BOT', 'USUARIO'))
);


CREATE TABLE IF NOT EXISTS public.agendamentos (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    sessao_id BIGINT NOT NULL,
    data_agendamento DATE NOT NULL,
    horario TIME NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'agendado',
    observacoes TEXT,

    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_agendamento_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES public.usuarios(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_agendamento_sessao
        FOREIGN KEY (sessao_id)
        REFERENCES public.sessoes(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_agendamento_status
        CHECK (
            status IN (
                'agendado',
                'confirmado',
                'realizado',
                'cancelado',
                'nao_compareceu'
            )
        )
);


CREATE INDEX IF NOT EXISTS idx_sessoes_usuario_id
    ON public.sessoes(usuario_id);

CREATE INDEX IF NOT EXISTS idx_mensagens_sessao_id
    ON public.mensagens(sessao_id);

CREATE INDEX IF NOT EXISTS idx_agendamentos_usuario_id
    ON public.agendamentos(usuario_id);

CREATE INDEX IF NOT EXISTS idx_agendamentos_sessao_id
    ON public.agendamentos(sessao_id);

CREATE INDEX IF NOT EXISTS idx_agendamentos_data
    ON public.agendamentos(data_agendamento);

-- Impede que o mesmo usuario tenha dois agendamentos ativos.
CREATE UNIQUE INDEX IF NOT EXISTS unique_agendamento_ativo_usuario
    ON public.agendamentos(usuario_id)
    WHERE status IN ('agendado', 'confirmado');


CREATE OR REPLACE FUNCTION public.atualizar_data_modificacao()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_usuarios_atualizado_em
    ON public.usuarios;

CREATE TRIGGER trigger_usuarios_atualizado_em
BEFORE UPDATE ON public.usuarios
FOR EACH ROW
EXECUTE FUNCTION public.atualizar_data_modificacao();

DROP TRIGGER IF EXISTS trigger_sessoes_atualizado_em
    ON public.sessoes;

CREATE TRIGGER trigger_sessoes_atualizado_em
BEFORE UPDATE ON public.sessoes
FOR EACH ROW
EXECUTE FUNCTION public.atualizar_data_modificacao();

DROP TRIGGER IF EXISTS trigger_agendamentos_atualizado_em
    ON public.agendamentos;

CREATE TRIGGER trigger_agendamentos_atualizado_em
BEFORE UPDATE ON public.agendamentos
FOR EACH ROW
EXECUTE FUNCTION public.atualizar_data_modificacao();
