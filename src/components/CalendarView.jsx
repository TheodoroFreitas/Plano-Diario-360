import { useEffect, useMemo, useState } from "react";
import { formatDateBR, monthBounds, parseISODate, toISODate } from "../lib/date";
import { getDailyPlansInRange } from "../services/dailyPlansService";

const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

function indicatorList(plan) {
  if (!plan) return [];

  return [
    plan.schedule?.length ? { label: "Agenda", className: "dot schedule" } : null,
    plan.devotional?.done || plan.devotional?.verse
      ? { label: "Devocional", className: "dot devotional" }
      : null,
    plan.meals?.length ? { label: "Alimentação", className: "dot meals" } : null,
    plan.workout?.done || plan.workout?.exercises ? { label: "Treino", className: "dot workout" } : null,
    plan.studies?.length ? { label: "Estudo", className: "dot study" } : null,
    plan.tasks?.length ? { label: "Tarefas", className: "dot tasks" } : null,
  ].filter(Boolean);
}

function buildCalendarDays(monthDate) {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const firstWeekday = (firstDay.getDay() + 6) % 7;
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - firstWeekday);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

function CalendarView({ onSelectDate, selectedDate }) {
  const [visibleMonth, setVisibleMonth] = useState(() => parseISODate(selectedDate));
  const [plans, setPlans] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const days = useMemo(() => buildCalendarDays(visibleMonth), [visibleMonth]);
  const currentMonthName = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(visibleMonth);

  useEffect(() => {
    let active = true;
    const { start, end } = monthBounds(visibleMonth);

    async function loadMonth() {
      try {
        setLoading(true);
        setError("");
        const data = await getDailyPlansInRange(start, end);
        if (!active) return;

        setPlans(
          data.reduce((acc, plan) => {
            acc[plan.date] = plan;
            return acc;
          }, {}),
        );
      } catch (err) {
        if (active) setError(err.message || "erro desconhecido");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadMonth();
    return () => {
      active = false;
    };
  }, [visibleMonth]);

  function moveMonth(direction) {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1));
  }

  function goToday() {
    setVisibleMonth(new Date());
  }

  return (
    <section className="panel calendar-panel">
      <div className="calendar-toolbar">
        <div>
          <p className="eyebrow">Calendário central</p>
          <h2>{currentMonthName}</h2>
          <p>Escolha uma data para organizar agenda, rotina, estudos e revisão.</p>
        </div>
        <div className="toolbar-actions">
          <button className="button ghost" onClick={() => moveMonth(-1)}>
            Anterior
          </button>
          <button className="button ghost" onClick={goToday}>
            Mês atual
          </button>
          <button className="button ghost" onClick={() => moveMonth(1)}>
            Próximo
          </button>
        </div>
      </div>

      {error && <div className="error-panel">Erro ao carregar calendário: {error}</div>}
      {loading && <div className="muted-panel">Buscando registros do mês...</div>}

      <div className="calendar-grid week-row" aria-hidden="true">
        {weekDays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((day) => {
          const iso = toISODate(day);
          const isCurrentMonth = day.getMonth() === visibleMonth.getMonth();
          const isToday = iso === toISODate();
          const isSelected = iso === selectedDate;
          const indicators = indicatorList(plans[iso]);

          return (
            <button
              className={[
                "calendar-day",
                isCurrentMonth ? "" : "muted-day",
                isToday ? "today-day" : "",
                isSelected ? "selected-day" : "",
              ].join(" ")}
              key={iso}
              onClick={() => onSelectDate(iso)}
              title={`Abrir plano de ${formatDateBR(iso)}`}
            >
              <span>{day.getDate()}</span>
              <div className="day-indicators" aria-label={`${indicators.length} indicadores`}>
                {indicators.map((indicator) => (
                  <i className={indicator.className} key={indicator.label} title={indicator.label} />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <footer className="legend">
        <span><i className="dot schedule" /> Agenda</span>
        <span><i className="dot devotional" /> Devocional</span>
        <span><i className="dot meals" /> Alimentação</span>
        <span><i className="dot workout" /> Treino</span>
        <span><i className="dot study" /> Estudo</span>
        <span><i className="dot tasks" /> Tarefas</span>
      </footer>
    </section>
  );
}

export default CalendarView;
