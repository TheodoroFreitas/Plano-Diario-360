import { useEffect, useMemo, useState } from "react";
import { formatDateBR } from "../lib/date";
import {
  createEmptyDailyPlan,
  createOrUpdateDailyPlan,
  deleteDailyPlan,
  getDailyPlan,
  updateDailyReview,
  updateDevotional,
  updateMeals,
  updateSchedule,
  updateStudies,
  updateTasks,
  updateWorkout,
} from "../services/dailyPlansService";
import DailyReviewSection from "./DailyReviewSection";
import DevotionalSection from "./DevotionalSection";
import FilterBar from "./FilterBar";
import NutritionSection from "./NutritionSection";
import ScheduleSection from "./ScheduleSection";
import SmartPlanner from "./SmartPlanner";
import StudySection from "./StudySection";
import TasksSection from "./TasksSection";
import WorkoutSection from "./WorkoutSection";

const filterToSection = {
  schedule: "schedule",
  devotional: "devotional",
  meals: "meals",
  workout: "workout",
  study: "study",
  tasks: "tasks",
};

function DayPlan({ date, onBack, onOpenToday }) {
  const [plan, setPlan] = useState(() => createEmptyDailyPlan(date));
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPlan() {
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

    loadPlan();
    return () => {
      active = false;
    };
  }, [date]);

  const statusFilter = useMemo(() => {
    if (filter === "pending") return "pending";
    if (filter === "completed") return "completed";
    return "all";
  }, [filter]);

  function patchPlan(fields) {
    setPlan((current) => ({ ...current, ...fields }));
  }

  function applySmartPlan(nextPlan) {
    setPlan(nextPlan);
    setNotice("Rotina criada pelo assistente. Revise e clique em Salvar tudo para gravar no Firebase.");
    setFilter("all");
  }

  function showSection(section) {
    if (filter === "all" || filter === "pending" || filter === "completed") return true;
    return filterToSection[filter] === section;
  }

  async function save(label, action) {
    try {
      setSaving(label);
      setError("");
      setNotice("");
      await action();
      setNotice("Alterações salvas no Firebase.");
    } catch (err) {
      setError(err.message || "Não foi possível salvar.");
    } finally {
      setSaving("");
    }
  }

  async function saveFullPlan() {
    await save("all", async () => {
      const saved = await createOrUpdateDailyPlan(date, plan);
      setPlan(saved);
    });
  }

  async function removeDay() {
    const confirmed = window.confirm("Excluir todo o plano deste dia?");
    if (!confirmed) return;

    await save("delete", async () => {
      await deleteDailyPlan(date);
      setPlan(createEmptyDailyPlan(date));
      setNotice("Plano do dia excluído.");
    });
  }

  if (loading) {
    return <div className="panel muted-panel">Carregando plano do dia...</div>;
  }

  return (
    <section className="day-plan">
      <div className="day-header panel">
        <div>
          <button className="text-button" onClick={onBack} type="button">
            Voltar ao calendário
          </button>
          <p className="eyebrow">Plano do dia</p>
          <h2>Plano do dia - {formatDateBR(date)}</h2>
          <p>Organize a rotina completa em seções rápidas, salvas no Firestore.</p>
        </div>
        <div className="toolbar-actions">
          <button className="button ghost" onClick={onOpenToday} type="button">
            Ir para hoje
          </button>
          <button className="button primary" onClick={saveFullPlan} disabled={saving === "all"} type="button">
            {saving === "all" ? "Salvando..." : "Salvar tudo"}
          </button>
          <button className="button danger" onClick={removeDay} disabled={saving === "delete"} type="button">
            Excluir plano
          </button>
        </div>
      </div>

      {notice && <div className="success-panel">{notice}</div>}
      {error && <div className="error-panel">{error}</div>}

      <FilterBar value={filter} onChange={setFilter} />

      <div className="sections-stack">
        {filter === "all" && <SmartPlanner plan={plan} onApply={applySmartPlan} />}

        {showSection("schedule") && (
          <ScheduleSection
            items={plan.schedule}
            onChange={(schedule) => patchPlan({ schedule })}
            onSave={() => save("schedule", () => updateSchedule(date, plan.schedule))}
            saving={saving === "schedule"}
            statusFilter={statusFilter}
          />
        )}

        {showSection("devotional") && (
          <DevotionalSection
            devotional={plan.devotional}
            onChange={(devotional) => patchPlan({ devotional })}
            onSave={() => save("devotional", () => updateDevotional(date, plan.devotional))}
            saving={saving === "devotional"}
            statusFilter={statusFilter}
          />
        )}

        {showSection("meals") && (
          <NutritionSection
            meals={plan.meals}
            checklist={plan.nutritionChecklist}
            onChange={(meals, nutritionChecklist) =>
              patchPlan({ meals, nutritionChecklist })
            }
            onSave={() =>
              save("meals", () => updateMeals(date, plan.meals, plan.nutritionChecklist))
            }
            saving={saving === "meals"}
            statusFilter={statusFilter}
          />
        )}

        {showSection("workout") && (
          <WorkoutSection
            workout={plan.workout}
            onChange={(workout) => patchPlan({ workout })}
            onSave={() => save("workout", () => updateWorkout(date, plan.workout))}
            saving={saving === "workout"}
            statusFilter={statusFilter}
          />
        )}

        {showSection("study") && (
          <StudySection
            studies={plan.studies}
            onChange={(studies) => patchPlan({ studies })}
            onSave={() => save("studies", () => updateStudies(date, plan.studies))}
            saving={saving === "studies"}
            statusFilter={statusFilter}
          />
        )}

        {showSection("tasks") && (
          <TasksSection
            tasks={plan.tasks}
            onChange={(tasks) => patchPlan({ tasks })}
            onSave={() => save("tasks", () => updateTasks(date, plan.tasks))}
            saving={saving === "tasks"}
            statusFilter={statusFilter}
          />
        )}

        {(filter === "all" || filter === "pending" || filter === "completed") && (
          <DailyReviewSection
            review={plan.dailyReview}
            onChange={(dailyReview) => patchPlan({ dailyReview })}
            onSave={() => save("review", () => updateDailyReview(date, plan.dailyReview))}
            saving={saving === "review"}
            statusFilter={statusFilter}
          />
        )}
      </div>
    </section>
  );
}

export default DayPlan;
