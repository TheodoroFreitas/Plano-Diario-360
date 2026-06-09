import { useEffect, useMemo, useState } from "react";
import { formatDateBR } from "../lib/date";
import { getDailyPlan } from "../services/dailyPlansService";

function hasDevotionalContent(devotional) {
  return Boolean(
    devotional.done ||
      devotional.bibleReading ||
      devotional.prayer ||
      devotional.verse ||
      devotional.practicalApplication,
  );
}

function hasWorkoutContent(workout) {
  return Boolean(workout.done || workout.exercises || workout.duration || workout.type !== "descanso");
}

function LoadingCard() {
  return <div className="panel muted-panel">Carregando resumo do dia...</div>;
}

function ErrorCard({ message }) {
  return <div className="panel error-panel">Não foi possível carregar o dia: {message}</div>;
}

function Dashboard({ date, onOpenCalendar, onOpenToday }) {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadToday() {
      try {
        setLoading(true);
        setError("");
        const data = await getDailyPlan(date);
        if (active) setPlan(data);
      } catch (err) {
        if (active) setError(err.message || "erro desconhecido");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadToday();
    return () => {
      active = false;
    };
  }, [date]);

  const summary = useMemo(() => {
    if (!plan) return null;

    const pendingTasks = plan.tasks.filter((task) => task.status !== "concluído").length;
    const doneTasks = plan.tasks.filter((task) => task.status === "concluído").length;
    const doneStudies = plan.studies.filter((study) => study.status === "feito").length;
    const pendingStudies = plan.studies.filter((study) => study.status !== "feito").length;
    const nextSchedule = [...plan.schedule]
      .filter((item) => item.status !== "feito" && item.status !== "cancelado")
      .sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""))[0];

    return {
      pendingTasks,
      doneTasks,
      plannedMeals: plan.meals.length,
      workout: hasWorkoutContent(plan.workout)
        ? plan.workout.done
          ? "Treino feito"
          : plan.workout.type
        : "Não planejado",
      devotional: hasDevotionalContent(plan.devotional)
        ? plan.devotional.done
          ? "Feito"
          : "Pendente"
        : "Não iniciado",
      studies: `${doneStudies} feitos / ${pendingStudies} pendentes`,
      nextSchedule,
      completion:
        plan.tasks.length + plan.studies.length === 0
          ? 0
          : Math.round(((doneTasks + doneStudies) / (plan.tasks.length + plan.studies.length)) * 100),
    };
  }, [plan]);

  if (loading) return <LoadingCard />;
  if (error) return <ErrorCard message={error} />;

  return (
    <section className="dashboard-grid">
      <article className="hero-panel">
        <div>
          <p className="eyebrow">Bom dia</p>
          <h2>Seu plano para {formatDateBR(date)}</h2>
          <p>
            Comece pelo essencial, veja o calendário e ajuste o dia em poucos minutos.
          </p>
        </div>
        <div className="hero-actions">
          <button className="button primary" onClick={onOpenCalendar}>
            Abrir calendário
          </button>
          <button className="button accent" onClick={onOpenToday}>
            Criar ou editar hoje
          </button>
        </div>
      </article>

      <div className="summary-card devotional">
        <span>Devocional</span>
        <strong>{summary.devotional}</strong>
        <small>Prioridade espiritual do dia</small>
      </div>
      <div className="summary-card meals">
        <span>Refeições planejadas</span>
        <strong>{summary.plannedMeals}</strong>
        <small>Registros de alimentação</small>
      </div>
      <div className="summary-card workout">
        <span>Treino do dia</span>
        <strong>{summary.workout}</strong>
        <small>Exercício e energia</small>
      </div>
      <div className="summary-card study">
        <span>Estudo concurso</span>
        <strong>{summary.studies}</strong>
        <small>Teoria, questões e revisão</small>
      </div>
      <div className="summary-card tasks">
        <span>Tarefas pendentes</span>
        <strong>{summary.pendingTasks}</strong>
        <small>{summary.doneTasks} concluídas</small>
      </div>

      <article className="panel dashboard-side">
        <div className="section-title">
          <div>
            <p className="eyebrow">Resumo do dia</p>
            <h3>Progresso geral</h3>
          </div>
          <span className="score-pill">{summary.completion}%</span>
        </div>
        <div className="progress-track">
          <span style={{ width: `${summary.completion}%` }} />
        </div>
        {summary.nextSchedule ? (
          <p className="next-item">
            Próximo bloco: <strong>{summary.nextSchedule.startTime}</strong> -{" "}
            {summary.nextSchedule.title}
          </p>
        ) : (
          <p className="next-item">Nenhum bloco pendente na agenda por hora.</p>
        )}
      </article>
    </section>
  );
}

export default Dashboard;
