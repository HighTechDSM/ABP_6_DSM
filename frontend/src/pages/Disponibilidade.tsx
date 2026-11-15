
import { useCallback, useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import MonthCalendar from "../components/MonthCalendar";
import PageHeader from "../components/PageHeader";
import { backend } from "../services/backend";

type Agendamento = {
  id: number | string;
  usuarioId: number;
  sessaoId?: number;
  name: string;
  phone?: string;
  cpf?: string;
  date: string;
  time: string;
  status: string;
  criadoEm?: string;
};

const DIAS_DISPONIVEIS = [
  "2026-10-26",
  "2026-10-27",
  "2026-10-28",
  "2026-10-29",
  "2026-10-30",
];

const gerarHorarios = (inicio: number, fim: number) => {
  const horarios: string[] = [];

  for (let minutos = inicio; minutos <= fim; minutos += 15) {
    const hora = Math.floor(minutos / 60);
    const minuto = minutos % 60;

    horarios.push(
      `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`,
    );
  }

  return horarios;
};

const HORARIOS_MANHA = gerarHorarios(8 * 60, 11 * 60 + 45);
const HORARIOS_TARDE = gerarHorarios(12 * 60, 15 * 60 + 15);

const statusAtivo = (status: string) =>
  status === "agendado" || status === "confirmado";

const formatarData = (date: string) => {
  if (!date) return "";

  const [ano, mes, dia] = date.split("-");
  return `${dia}/${mes}/${ano}`;
};

const apenasNumeros = (valor: string) => valor.replace(/\D/g, "");

function Disponibilidade() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [cancelandoId, setCancelandoId] = useState<string | number | null>(
    null,
  );

  const [erro, setErro] = useState("");
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const [agendamentoConcluido, setAgendamentoConcluido] =
    useState<Agendamento | null>(null);

  const pessoaIdentificada =
    name.trim().length > 0 &&
    apenasNumeros(phone).length >= 10 &&
    apenasNumeros(cpf).length === 11;

  const carregarAgendamentos = useCallback(async () => {
    setCarregando(true);

    try {
      const resposta = await backend.agendamentos.list();
      const lista = Array.isArray(resposta) ? resposta : [];

      setAgendamentos(lista);
      setErro("");
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os agendamentos.",
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregarAgendamentos();
  }, [carregarAgendamentos]);

  const agendamentosAtivos = agendamentos.filter((item) =>
    statusAtivo(item.status),
  );

  const horariosOcupados = agendamentosAtivos
    .filter((item) => item.date === selectedDate)
    .map((item) => item.time.slice(0, 5));

  const selecionarHorario = async (time: string) => {
    if (!selectedDate || !pessoaIdentificada || salvando) return;

    if (horariosOcupados.includes(time)) {
      setErro("Este horário já está ocupado. Escolha outro.");
      await carregarAgendamentos();
      return;
    }

    setSalvando(true);
    setErro("");

    try {
      const resposta = (await backend.agendamentos.create({
        name: name.trim(),
        phone: apenasNumeros(phone),
        cpf: apenasNumeros(cpf),
        date: selectedDate,
        time,
      })) as Agendamento;

      setAgendamentoConcluido(resposta);
      await carregarAgendamentos();

      // Limpa os campos para o funcionário cadastrar outro cidadão.
      setName("");
      setPhone("");
      setCpf("");
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível realizar o agendamento.",
      );

      // Outro funcionário pode ter ocupado o horário simultaneamente.
      await carregarAgendamentos();
    } finally {
      setSalvando(false);
    }
  };

  const cancelarAgendamento = async (agendamento: Agendamento) => {
    const confirmado = window.confirm(
      `Deseja cancelar o atendimento de ${agendamento.name} em ${formatarData(
        agendamento.date,
      )}, às ${agendamento.time.slice(0, 5)}?`,
    );

    if (!confirmado) return;

    setCancelandoId(agendamento.id);
    setErro("");

    try {
      await backend.agendamentos.cancel(
        agendamento.id,
        agendamento.usuarioId,
      );

      await carregarAgendamentos();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível cancelar o agendamento.",
      );
    } finally {
      setCancelandoId(null);
    }
  };

  const renderHorarios = (horarios: string[]) => (
    <div className="availability-times">
      {horarios.map((time) => {
        const ocupado = horariosOcupados.includes(time);

        return (
          <button
            key={time}
            type="button"
            className={`availability-time ${
              ocupado ? "availability-time--selected" : ""
            }`}
            disabled={
              !pessoaIdentificada ||
              ocupado ||
              salvando ||
              carregando
            }
            title={
              ocupado
                ? "Horário já ocupado"
                : !pessoaIdentificada
                  ? "Preencha nome, telefone e CPF"
                  : "Agendar neste horário"
            }
            onClick={() => void selecionarHorario(time)}
          >
            {time}
            {ocupado ? " · Ocupado" : ""}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Agendamento de atendimento presencial"
        title="Agendamentos"
        description="Área de uso dos funcionários do PROCON para cadastrar cidadãos e marcar atendimentos presenciais."
      />

      {erro && (
        <div className="availability-warning" role="alert">
          {erro}
          <button
            type="button"
            className="button button--secondary"
            onClick={() => setErro("")}
          >
            Fechar aviso
          </button>
        </div>
      )}

      <section className="panel">
        <div className="panel__heading">
          <div>
            <span className="section-kicker">Identificação</span>
            <h2>Dados do cidadão</h2>
          </div>
        </div>

        <div className="field-grid">
          <label className="field-label">
            <span>Nome completo</span>
            <input
              type="text"
              value={name}
              maxLength={150}
              placeholder="Digite o nome completo"
              onChange={(event) => setName(event.target.value)}
            />
          </label>

          <label className="field-label">
            <span>Telefone com DDD</span>
            <input
              type="tel"
              value={phone}
              maxLength={20}
              placeholder="Ex.: (12) 99999-9999"
              onChange={(event) => setPhone(event.target.value)}
            />
          </label>

          <label className="field-label">
            <span>CPF</span>
            <input
              type="text"
              value={cpf}
              inputMode="numeric"
              maxLength={14}
              placeholder="Digite o CPF"
              onChange={(event) => setCpf(event.target.value)}
            />
          </label>
        </div>

        {!pessoaIdentificada && (
          <p className="availability-identification-hint">
            Preencha o nome, um telefone com DDD e os 11 números do CPF para
            liberar a seleção de horários.
          </p>
        )}
      </section>

      <section className="panel">
        <div className="panel__heading">
          <div>
            <span className="section-kicker">26 a 30 de outubro de 2026</span>
            <h2>Calendário de disponibilidade</h2>
          </div>

          <button
            type="button"
            className="button button--secondary"
            onClick={() => void carregarAgendamentos()}
            disabled={carregando}
          >
            {carregando ? "Atualizando..." : "Atualizar agenda"}
          </button>
        </div>

        <MonthCalendar
          compact
          selectionMode="single"
          selectedDate={selectedDate}
          bookedDates={[]}
          availableDates={DIAS_DISPONIVEIS}
          onDateChange={(date) => {
            setSelectedDate(date);
            setErro("");
          }}
          onUnavailableDate={() => setShowUnavailableModal(true)}
        />

        {showUnavailableModal && (
          <div className="availability-modal-overlay">
            <div
              className="availability-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="availability-modal-title"
            >
              <span className="section-kicker">Atenção</span>
              <h3 id="availability-modal-title">
                Dia indisponível para atendimento
              </h3>
              <p>
                Selecione uma data entre 26 e 30 de outubro de 2026.
              </p>
              <button
                type="button"
                className="button button--primary availability-modal__button"
                onClick={() => setShowUnavailableModal(false)}
              >
                OK
              </button>
            </div>
          </div>
        )}

        {selectedDate && (
          <div className="availability-schedule">
            <div className="availability-schedule__header">
              <div>
                <span className="section-kicker">Horários</span>
                <h3>{formatarData(selectedDate)}</h3>
              </div>
              <span className="availability-schedule__hint">
                {carregando
                  ? "Carregando horários..."
                  : "Horários ocupados aparecem desabilitados"}
              </span>
            </div>

            <div className="availability-schedule__columns">
              <div className="availability-period">
                <div className="availability-period__header">
                  <strong>Manhã</strong>
                  <span>08:00 às 11:45</span>
                </div>
                {renderHorarios(HORARIOS_MANHA)}
              </div>

              <div className="availability-period">
                <div className="availability-period__header">
                  <strong>Tarde</strong>
                  <span>12:00 às 15:15</span>
                </div>
                {renderHorarios(HORARIOS_TARDE)}
              </div>
            </div>
          </div>
        )}

        <p className="availability-identification-hint">
          {agendamentosAtivos.length} atendimento(s) ativo(s) na agenda.
          Cancelamentos liberam o horário correspondente.
        </p>
      </section>

      <section className="panel panel--table">
        <div className="panel__heading">
          <div>
            <span className="section-kicker">Atendimentos registrados</span>
            <h2>Agenda</h2>
          </div>
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Cidadão</th>
                <th>Telefone</th>
                <th>CPF</th>
                <th>Data</th>
                <th>Horário</th>
                <th>Situação</th>
                <th>Ação</th>
              </tr>
            </thead>

            <tbody>
              {agendamentos.length > 0 ? (
                agendamentos.map((agendamento) => (
                  <tr key={agendamento.id}>
                    <td>{agendamento.name}</td>
                    <td>{agendamento.phone || "—"}</td>
                    <td>{agendamento.cpf || "—"}</td>
                    <td>{formatarData(agendamento.date)}</td>
                    <td>{agendamento.time.slice(0, 5)}</td>
                    <td>{agendamento.status}</td>
                    <td>
                      {statusAtivo(agendamento.status) ? (
                        <button
                          type="button"
                          className="button button--secondary"
                          disabled={cancelandoId === agendamento.id}
                          onClick={() =>
                            void cancelarAgendamento(agendamento)
                          }
                        >
                          {cancelandoId === agendamento.id
                            ? "Cancelando..."
                            : "Cancelar"}
                        </button>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="table-empty-row">
                  <td colSpan={7}>
                    <EmptyState
                      compact
                      title={
                        carregando
                          ? "Carregando agendamentos..."
                          : "Nenhum atendimento registrado"
                      }
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {agendamentoConcluido && (
        <div className="home-success-modal-overlay">
          <div
            className="home-success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="home-success-modal-title"
          >
            <div className="home-success-modal__image">
              <img src="/chatbot_happy.png" alt="Chatbot" />
            </div>

            <div className="home-success-modal__content">
              <span className="section-kicker">
                Agendamento concluído
              </span>

              <h3 id="home-success-modal-title">
                Atendimento agendado com sucesso!
              </h3>

              <p>
                Cidadão: <strong>{agendamentoConcluido.name}</strong>
                <br />
                Data:{" "}
                <strong>{formatarData(agendamentoConcluido.date)}</strong>
                <br />
                Horário:{" "}
                <strong>{agendamentoConcluido.time.slice(0, 5)}</strong>
              </p>

              <button
                type="button"
                className="button button--primary home-success-modal__button"
                onClick={() => setAgendamentoConcluido(null)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Disponibilidade;
