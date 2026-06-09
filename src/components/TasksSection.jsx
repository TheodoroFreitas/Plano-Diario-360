import { useMemo, useState } from "react";
import { makeId } from "../lib/id";

const emptyTask = {
  title: "",
  description: "",
  area: "pessoal",
  priority: "média",
  status: "a fazer",
  optionalTime: "",
  note: "",
};

function matchesExternalStatus(task, statusFilter) {
  if (statusFilter === "completed") return task.status === "concluído";
  if (statusFilter === "pending") return task.status !== "concluído";
  return true;
}

function TasksSection({ tasks, onChange, onSave, saving, statusFilter }) {
  const [form, setForm] = useState(emptyTask);
  const [editingId, setEditingId] = useState("");
  const [statusLocalFilter, setStatusLocalFilter] = useState("todos");
  const [priorityFilter, setPriorityFilter] = useState("todas");

  const visibleTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatusFilter =
        statusLocalFilter === "todos" || task.status === statusLocalFilter;
      const matchesPriority =
        priorityFilter === "todas" || task.priority === priorityFilter;

      return matchesExternalStatus(task, statusFilter) && matchesStatusFilter && matchesPriority;
    });
  }, [tasks, statusFilter, statusLocalFilter, priorityFilter]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();
    if (!form.title.trim()) return;

    const payload = {
      ...form,
      title: form.title.trim(),
      id: editingId || makeId("task"),
    };

    const next = editingId
      ? tasks.map((task) => (task.id === editingId ? payload : task))
      : [...tasks, payload];

    onChange(next);
    setForm(emptyTask);
    setEditingId("");
  }

  function editTask(task) {
    setEditingId(task.id);
    setForm({
      title: task.title || "",
      description: task.description || "",
      area: task.area || "pessoal",
      priority: task.priority || "média",
      status: task.status || "a fazer",
      optionalTime: task.optionalTime || "",
      note: task.note || "",
    });
  }

  function removeTask(id) {
    onChange(tasks.filter((task) => task.id !== id));
  }

  function completeTask(id) {
    onChange(tasks.map((task) => (task.id === id ? { ...task, status: "concluído" } : task)));
  }

  return (
    <article className="section-card tasks-section">
      <div className="section-title">
        <div>
          <p className="eyebrow">Outras tarefas</p>
          <h3>Demandas gerais do dia</h3>
        </div>
        <button className="button primary" onClick={onSave} disabled={saving} type="button">
          {saving ? "Salvando..." : "Salvar tarefas"}
        </button>
      </div>

      <form className="form-grid" onSubmit={submit}>
        <label className="wide-field">
          Título
          <input
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="Ex.: Pagar boleto"
          />
        </label>
        <label>
          Área
          <select value={form.area} onChange={(event) => updateField("area", event.target.value)}>
            <option value="trabalho">Trabalho</option>
            <option value="casa">Casa</option>
            <option value="financeiro">Financeiro</option>
            <option value="pessoal">Pessoal</option>
            <option value="projeto">Projeto</option>
            <option value="igreja">Igreja</option>
            <option value="outros">Outros</option>
          </select>
        </label>
        <label>
          Prioridade
          <select value={form.priority} onChange={(event) => updateField("priority", event.target.value)}>
            <option value="baixa">Baixa</option>
            <option value="média">Média</option>
            <option value="alta">Alta</option>
          </select>
        </label>
        <label>
          Status
          <select value={form.status} onChange={(event) => updateField("status", event.target.value)}>
            <option value="a fazer">A fazer</option>
            <option value="em andamento">Em andamento</option>
            <option value="aguardando">Aguardando</option>
            <option value="concluído">Concluído</option>
          </select>
        </label>
        <label>
          Horário opcional
          <input
            type="time"
            value={form.optionalTime}
            onChange={(event) => updateField("optionalTime", event.target.value)}
          />
        </label>
        <label className="wide-field">
          Descrição
          <textarea
            rows="2"
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
          />
        </label>
        <label className="wide-field">
          Observação
          <textarea rows="2" value={form.note} onChange={(event) => updateField("note", event.target.value)} />
        </label>
        <div className="form-actions">
          <button className="button accent" type="submit">
            {editingId ? "Atualizar tarefa" : "Adicionar tarefa"}
          </button>
          {editingId && (
            <button
              className="button ghost"
              onClick={() => {
                setEditingId("");
                setForm(emptyTask);
              }}
              type="button"
            >
              Cancelar edição
            </button>
          )}
        </div>
      </form>

      <div className="inline-filters">
        <select value={statusLocalFilter} onChange={(event) => setStatusLocalFilter(event.target.value)}>
          <option value="todos">Todos os status</option>
          <option value="a fazer">A fazer</option>
          <option value="em andamento">Em andamento</option>
          <option value="aguardando">Aguardando</option>
          <option value="concluído">Concluído</option>
        </select>
        <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
          <option value="todas">Todas as prioridades</option>
          <option value="baixa">Baixa</option>
          <option value="média">Média</option>
          <option value="alta">Alta</option>
        </select>
      </div>

      <div className="item-list">
        {visibleTasks.length === 0 && <p className="empty-state">Nenhuma tarefa encontrada para este filtro.</p>}
        {visibleTasks.map((task) => (
          <div className={`routine-item priority-${task.priority}`} key={task.id}>
            <div className="task-area">{task.area}</div>
            <div>
              <h4>{task.title}</h4>
              <p>
                {task.optionalTime ? `${task.optionalTime} - ` : ""}
                {task.description || "Sem descrição"}
              </p>
              <span className={`status-chip ${task.status.replace(" ", "-")}`}>{task.status}</span>
            </div>
            <div className="item-actions">
              <button className="button tiny" onClick={() => completeTask(task.id)} type="button">
                Concluir
              </button>
              <button className="button tiny ghost" onClick={() => editTask(task)} type="button">
                Editar
              </button>
              <button className="button tiny danger" onClick={() => removeTask(task.id)} type="button">
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export default TasksSection;
