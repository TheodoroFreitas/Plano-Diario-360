import { useMemo, useState } from "react";
import { makeId } from "../lib/id";

const mealTypes = ["café da manhã", "almoço", "pré-treino", "jantar", "ceia", "lanche"];

const checklistLabels = {
  water: "Bebi água",
  noSweets: "Evitei doce",
  protein: "Bati proteína",
  realFood: "Comi comida de verdade",
  outOfPlan: "Saí da dieta",
};

const emptyMeal = {
  type: "café da manhã",
  plannedFood: "",
  actualFood: "",
  insidePlan: true,
  note: "",
};

function NutritionSection({ meals, checklist, onChange, onSave, saving, statusFilter }) {
  const [form, setForm] = useState(emptyMeal);
  const [editingId, setEditingId] = useState("");

  const visibleMeals = useMemo(() => {
    if (statusFilter === "completed") return meals.filter((meal) => meal.insidePlan);
    if (statusFilter === "pending") return meals.filter((meal) => !meal.actualFood);
    return meals;
  }, [meals, statusFilter]);

  function updateMealField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();
    if (!form.plannedFood.trim() && !form.actualFood.trim()) return;

    const payload = {
      ...form,
      id: editingId || makeId("meal"),
    };

    const nextMeals = editingId
      ? meals.map((meal) => (meal.id === editingId ? payload : meal))
      : [...meals, payload];

    onChange(nextMeals, checklist);
    setForm(emptyMeal);
    setEditingId("");
  }

  function editMeal(meal) {
    setEditingId(meal.id);
    setForm({
      type: meal.type || "café da manhã",
      plannedFood: meal.plannedFood || "",
      actualFood: meal.actualFood || "",
      insidePlan: meal.insidePlan ?? true,
      note: meal.note || "",
    });
  }

  function removeMeal(id) {
    onChange(meals.filter((meal) => meal.id !== id), checklist);
  }

  function updateChecklist(field, checked) {
    onChange(meals, { ...checklist, [field]: checked });
  }

  return (
    <article className="section-card nutrition-section">
      <div className="section-title">
        <div>
          <p className="eyebrow">Alimentação</p>
          <h3>Refeições e checklist diário</h3>
        </div>
        <button className="button primary" onClick={onSave} disabled={saving} type="button">
          {saving ? "Salvando..." : "Salvar alimentação"}
        </button>
      </div>

      <div className="checklist-grid">
        {Object.entries(checklistLabels).map(([field, label]) => (
          <label className={field === "outOfPlan" ? "check-card warning" : "check-card"} key={field}>
            <input
              type="checkbox"
              checked={Boolean(checklist[field])}
              onChange={(event) => updateChecklist(field, event.target.checked)}
            />
            {label}
          </label>
        ))}
      </div>

      <form className="form-grid" onSubmit={submit}>
        <label>
          Tipo da refeição
          <select value={form.type} onChange={(event) => updateMealField("type", event.target.value)}>
            {mealTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>
        <label>
          Dentro do plano
          <select
            value={form.insidePlan ? "sim" : "não"}
            onChange={(event) => updateMealField("insidePlan", event.target.value === "sim")}
          >
            <option value="sim">Sim</option>
            <option value="não">Não</option>
          </select>
        </label>
        <label>
          Alimento planejado
          <input
            value={form.plannedFood}
            onChange={(event) => updateMealField("plannedFood", event.target.value)}
            placeholder="Ex.: arroz, frango e salada"
          />
        </label>
        <label>
          Alimento realizado
          <input
            value={form.actualFood}
            onChange={(event) => updateMealField("actualFood", event.target.value)}
          />
        </label>
        <label className="wide-field">
          Observação
          <textarea rows="2" value={form.note} onChange={(event) => updateMealField("note", event.target.value)} />
        </label>
        <div className="form-actions">
          <button className="button accent" type="submit">
            {editingId ? "Atualizar refeição" : "Adicionar refeição"}
          </button>
          {editingId && (
            <button
              className="button ghost"
              onClick={() => {
                setEditingId("");
                setForm(emptyMeal);
              }}
              type="button"
            >
              Cancelar edição
            </button>
          )}
        </div>
      </form>

      <div className="item-list">
        {visibleMeals.length === 0 && <p className="empty-state">Nenhuma refeição encontrada para este filtro.</p>}
        {visibleMeals.map((meal) => (
          <div className="routine-item" key={meal.id}>
            <div className={meal.insidePlan ? "meal-icon inside" : "meal-icon outside"}>
              {meal.insidePlan ? "OK" : "!"}
            </div>
            <div>
              <h4>{meal.type}</h4>
              <p>Planejado: {meal.plannedFood || "não informado"}</p>
              <p>Realizado: {meal.actualFood || "pendente"} {meal.note ? `- ${meal.note}` : ""}</p>
            </div>
            <div className="item-actions">
              <button className="button tiny ghost" onClick={() => editMeal(meal)} type="button">
                Editar
              </button>
              <button className="button tiny danger" onClick={() => removeMeal(meal.id)} type="button">
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export default NutritionSection;
