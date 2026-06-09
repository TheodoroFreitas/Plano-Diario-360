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

const taskTemplates = [
  {
    title: "Fazer devocional",
    description: "Leitura, oração e aplicação prática.",
    area: "igreja",
    priority: "alta",
    optionalTime: "06:30",
  },
  {
    title: "Beber água",
    description: "Manter hidratação e marcar o checklist.",
    area: "pessoal",
    priority: "média",
    optionalTime: "",
  },
  {
    title: "Resolver questões do concurso",
    description: "Criar ou atualizar bloco em Estudo Concurso.",
    area: "projeto",
    priority: "alta",
    optionalTime: "20:00",
  },
  {
    title: "Preparar refeição do plano",
    description: "Deixar comida simples pronta para evitar improviso.",
    area: "casa",
    priority: "média",
    optionalTime: "",
  },
  {
    title: "Treinar ou fazer alongamento",
    description: "Ajustar intensidade conforme sono e energia.",
    area: "pessoal",
    priority: "média",
    optionalTime: "18:30",
  },
  {
    title: "Revisar o dia",
    description: "Registrar o que funcionou, falhou e o ajuste de amanhã.",
    area: "pessoal",
    priority: "baixa",
    optionalTime: "21:30",
  },
];

function matchesExternalStatus(task, statusFilter) {
  if (statusFilter === "completed") return task.status === "concluído";
  if (statusFilter === "pending") return task.status !== "concluído";
  return true;
}

function TasksSection({ tasks, onChange, onSave, saving, statusFilter }) {
  const [form, setForm] = useState(emptyTask);
  const [editingId, setEditingId] = useState("");
  const [quickTitle, setQuickTitle] = useState("");
  const [quickPriority, setQuickPriority] = useState("média");
  const [quickArea, setQuickArea] = useState("pessoal");
  const [statusLocalFilter, setStatusLocalFilter] = useState("todos");
  const [priorityFilter, setPriorityFilter] = useState("todas");

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.status === "concluído").length;
    const highPriority = tasks.filter(
      (task) => task.priority === "alta" && task.status !== "concluído",
    ).length;
    const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

    return {
      total: tasks.length,
      completed,
      pending: tasks.length - completed,
      highPriority,
      progress,
    };
  }, [tasks]);

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

  function createTask(data) {
    const payload = {
      ...emptyTask,
      ...data,
      id: makeId("task"),
      title: data.title.trim(),
      status: data.status || "a fazer",
    };

    onChange([...tasks, payload]);
  }

  function addQuickTask(event) {
    event.preventDefault();
    if (!quickTitle.trim()) return;

    createTask({
      title: quickTitle,
      description: "Criada pela entrada rápida.",
      area: quickArea,
      priority: quickPriority,
    });
    setQuickTitle("");
  }

  function addTemplate(template) {
    const exists = tasks.some(
      (task) => task.title.trim().toLowerCase() === template.title.trim().toLowerCase(),
    );

    if (exists) return;

    createTask({
      ...template,
      note: "Criada por modelo rápido.",
    });
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

      <div className="task-command-center">
        <div className="task-stat-card">
          <span>{stats.progress}%</span>
          <small>concluído</small>
        </div>
        <div className="task-stat-card">
          <span>{stats.pending}</span>
          <small>pendentes</small>
        </div>
        <div className="task-stat-card warning">
          <span>{stats.highPriority}</span>
          <small>alta prioridade</small>
        </div>
      </div>

      <form className="quick-task-form" onSubmit={addQuickTask}>
        <label className="quick-input-label">
          Criar tarefa rápida
          <input
            value={quickTitle}
            onChange={(event) => setQuickTitle(event.target.value)}
            placeholder="Digite uma tarefa e aperte Enter"
          />
        </label>
        <select value={quickArea} onChange={(event) => setQuickArea(event.target.value)}>
          <option value="pessoal">Pessoal</option>
          <option value="trabalho">Trabalho</option>
          <option value="casa">Casa</option>
          <option value="financeiro">Financeiro</option>
          <option value="projeto">Projeto</option>
          <option value="igreja">Igreja</option>
          <option value="outros">Outros</option>
        </select>
        <div className="priority-switch" aria-label="Prioridade da tarefa rápida">
          {["baixa", "média", "alta"].map((priority) => (
            <button
              className={quickPriority === priority ? "priority-button active" : "priority-button"}
              key={priority}
              onClick={() => setQuickPriority(priority)}
              type="button"
            >
              {priority}
            </button>
          ))}
        </div>
        <button className="button accent" type="submit">
          Criar
        </button>
      </form>

      <div className="template-strip" aria-label="Modelos rápidos de tarefas">
        {taskTemplates.map((template) => {
          const alreadyAdded = tasks.some(
            (task) => task.title.trim().toLowerCase() === template.title.trim().toLowerCase(),
          );

          return (
            <button
              className={alreadyAdded ? "template-chip added" : "template-chip"}
              disabled={alreadyAdded}
              key={template.title}
              onClick={() => addTemplate(template)}
              type="button"
            >
              {alreadyAdded ? "Adicionado" : template.title}
            </button>
          );
        })}
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
