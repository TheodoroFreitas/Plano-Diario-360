import { useMemo, useState } from "react";
import { makeId } from "../lib/id";

const categories = [
  "Devocional",
  "Trabalho",
  "Estudo",
  "Treino",
  "Alimentação",
  "Família",
  "Casa",
  "Descanso",
  "Outros",
];

const emptyForm = {
  startTime: "",
  endTime: "",
  title: "",
  category: "Outros",
  note: "",
  status: "planejado",
};

function sortSchedule(items) {
  return [...items].sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));
}

function matchesStatus(item, statusFilter) {
  if (statusFilter === "completed") return item.status === "feito";
  if (statusFilter === "pending") return item.status !== "feito" && item.status !== "cancelado";
  return true;
}

function ScheduleSection({ items, onChange, onSave, saving, statusFilter }) {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");

  const visibleItems = useMemo(
    () => sortSchedule(items).filter((item) => matchesStatus(item, statusFilter)),
    [items, statusFilter],
  );

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId("");
  }

  function submit(event) {
    event.preventDefault();
    if (!form.title.trim()) return;

    const payload = {
      ...form,
      title: form.title.trim(),
      id: editingId || makeId("schedule"),
    };

    const next = editingId
      ? items.map((item) => (item.id === editingId ? payload : item))
      : [...items, payload];

    onChange(sortSchedule(next));
    resetForm();
  }

  function editItem(item) {
    setEditingId(item.id);
    setForm({
      startTime: item.startTime || "",
      endTime: item.endTime || "",
      title: item.title || "",
      category: item.category || "Outros",
      note: item.note || "",
      status: item.status || "planejado",
    });
  }

  function removeItem(id) {
    onChange(items.filter((item) => item.id !== id));
  }

  function markDone(id) {
    onChange(items.map((item) => (item.id === id ? { ...item, status: "feito" } : item)));
  }

  return (
    <article className="section-card schedule-section">
      <div className="section-title">
        <div>
          <p className="eyebrow">Agenda por hora</p>
          <h3>Blocos de horário</h3>
        </div>
        <button className="button primary" onClick={onSave} disabled={saving} type="button">
          {saving ? "Salvando..." : "Salvar agenda"}
        </button>
      </div>

      <form className="form-grid" onSubmit={submit}>
        <label>
          Horário inicial
          <input
            type="time"
            value={form.startTime}
            onChange={(event) => updateField("startTime", event.target.value)}
          />
        </label>
        <label>
          Horário final
          <input
            type="time"
            value={form.endTime}
            onChange={(event) => updateField("endTime", event.target.value)}
          />
        </label>
        <label className="wide-field">
          Título da atividade
          <input
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="Ex.: Revisar matemática"
          />
        </label>
        <label>
          Categoria
          <select value={form.category} onChange={(event) => updateField("category", event.target.value)}>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select value={form.status} onChange={(event) => updateField("status", event.target.value)}>
            <option value="planejado">Planejado</option>
            <option value="feito">Feito</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </label>
        <label className="wide-field">
          Observação
          <textarea
            rows="2"
            value={form.note}
            onChange={(event) => updateField("note", event.target.value)}
            placeholder="Detalhes rápidos para executar bem"
          />
        </label>
        <div className="form-actions">
          <button className="button accent" type="submit">
            {editingId ? "Atualizar bloco" : "Adicionar bloco"}
          </button>
          {editingId && (
            <button className="button ghost" onClick={resetForm} type="button">
              Cancelar edição
            </button>
          )}
        </div>
      </form>

      <div className="item-list">
        {visibleItems.length === 0 && <p className="empty-state">Nenhum bloco encontrado para este filtro.</p>}
        {visibleItems.map((item) => (
          <div className="routine-item" key={item.id}>
            <div className="time-badge">
              <strong>{item.startTime || "--:--"}</strong>
              <span>{item.endTime || "--:--"}</span>
            </div>
            <div>
              <h4>{item.title}</h4>
              <p>{item.category} {item.note ? `- ${item.note}` : ""}</p>
              <span className={`status-chip ${item.status}`}>{item.status}</span>
            </div>
            <div className="item-actions">
              <button className="button tiny" onClick={() => markDone(item.id)} type="button">
                Feito
              </button>
              <button className="button tiny ghost" onClick={() => editItem(item)} type="button">
                Editar
              </button>
              <button className="button tiny danger" onClick={() => removeItem(item.id)} type="button">
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export default ScheduleSection;
