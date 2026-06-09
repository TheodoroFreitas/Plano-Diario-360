import { useMemo, useState } from "react";
import { makeId } from "../lib/id";

const subjects = [
  "Português",
  "Matemática",
  "Raciocínio Lógico",
  "Banco de Dados",
  "Redes",
  "Segurança da Informação",
  "Programação",
  "Sistemas Operacionais",
  "Engenharia de Software",
  "Conhecimentos Bancários",
  "Administração Pública",
];

const emptyStudy = {
  subject: "Português",
  topic: "",
  type: "teoria",
  studiedTime: "",
  questions: 0,
  correctAnswers: 0,
  accuracyPercentage: 0,
  difficulty: "médio",
  status: "planejado",
};

function calculateAccuracy(questions, correctAnswers) {
  const total = Number(questions);
  const correct = Number(correctAnswers);

  if (!total || total < 1) return 0;
  return Math.min(100, Math.round((correct / total) * 100));
}

function matchesStatus(study, statusFilter) {
  if (statusFilter === "completed") return study.status === "feito";
  if (statusFilter === "pending") return study.status !== "feito";
  return true;
}

function StudySection({ studies, onChange, onSave, saving, statusFilter }) {
  const [form, setForm] = useState(emptyStudy);
  const [editingId, setEditingId] = useState("");

  const visibleStudies = useMemo(
    () => studies.filter((study) => matchesStatus(study, statusFilter)),
    [studies, statusFilter],
  );

  function updateField(field, value) {
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === "questions" || field === "correctAnswers") {
        next.accuracyPercentage = calculateAccuracy(next.questions, next.correctAnswers);
      }
      return next;
    });
  }

  function submit(event) {
    event.preventDefault();
    if (!form.topic.trim()) return;

    const payload = {
      ...form,
      id: editingId || makeId("study"),
      questions: Number(form.questions),
      correctAnswers: Number(form.correctAnswers),
      accuracyPercentage: calculateAccuracy(form.questions, form.correctAnswers),
    };

    const next = editingId
      ? studies.map((study) => (study.id === editingId ? payload : study))
      : [...studies, payload];

    onChange(next);
    setForm(emptyStudy);
    setEditingId("");
  }

  function editStudy(study) {
    setEditingId(study.id);
    setForm({
      subject: study.subject || "Português",
      topic: study.topic || "",
      type: study.type || "teoria",
      studiedTime: study.studiedTime || "",
      questions: Number(study.questions || 0),
      correctAnswers: Number(study.correctAnswers || 0),
      accuracyPercentage: Number(study.accuracyPercentage || 0),
      difficulty: study.difficulty || "médio",
      status: study.status || "planejado",
    });
  }

  function removeStudy(id) {
    onChange(studies.filter((study) => study.id !== id));
  }

  function markDone(id) {
    onChange(studies.map((study) => (study.id === id ? { ...study, status: "feito" } : study)));
  }

  return (
    <article className="section-card study-section">
      <div className="section-title">
        <div>
          <p className="eyebrow">Estudo Concurso</p>
          <h3>Sessões de estudo e desempenho</h3>
        </div>
        <button className="button primary" onClick={onSave} disabled={saving} type="button">
          {saving ? "Salvando..." : "Salvar estudos"}
        </button>
      </div>

      <form className="form-grid" onSubmit={submit}>
        <label>
          Matéria
          <select value={form.subject} onChange={(event) => updateField("subject", event.target.value)}>
            {subjects.map((subject) => (
              <option key={subject}>{subject}</option>
            ))}
          </select>
        </label>
        <label>
          Tipo
          <select value={form.type} onChange={(event) => updateField("type", event.target.value)}>
            <option value="teoria">Teoria</option>
            <option value="questões">Questões</option>
            <option value="revisão">Revisão</option>
            <option value="simulado">Simulado</option>
          </select>
        </label>
        <label className="wide-field">
          Assunto
          <input
            value={form.topic}
            onChange={(event) => updateField("topic", event.target.value)}
            placeholder="Ex.: Normalização de banco de dados"
          />
        </label>
        <label>
          Tempo estudado
          <input
            value={form.studiedTime}
            onChange={(event) => updateField("studiedTime", event.target.value)}
            placeholder="Ex.: 1h30"
          />
        </label>
        <label>
          Dificuldade
          <select value={form.difficulty} onChange={(event) => updateField("difficulty", event.target.value)}>
            <option value="fácil">Fácil</option>
            <option value="médio">Médio</option>
            <option value="difícil">Difícil</option>
          </select>
        </label>
        <label>
          Questões
          <input
            min="0"
            type="number"
            value={form.questions}
            onChange={(event) => updateField("questions", event.target.value)}
          />
        </label>
        <label>
          Acertos
          <input
            min="0"
            type="number"
            value={form.correctAnswers}
            onChange={(event) => updateField("correctAnswers", event.target.value)}
          />
        </label>
        <label>
          Percentual automático
          <input readOnly value={`${form.accuracyPercentage}%`} />
        </label>
        <label>
          Status
          <select value={form.status} onChange={(event) => updateField("status", event.target.value)}>
            <option value="planejado">Planejado</option>
            <option value="feito">Feito</option>
            <option value="pendente">Pendente</option>
          </select>
        </label>
        <div className="form-actions">
          <button className="button accent" type="submit">
            {editingId ? "Atualizar estudo" : "Adicionar estudo"}
          </button>
          {editingId && (
            <button
              className="button ghost"
              onClick={() => {
                setEditingId("");
                setForm(emptyStudy);
              }}
              type="button"
            >
              Cancelar edição
            </button>
          )}
        </div>
      </form>

      <div className="item-list">
        {visibleStudies.length === 0 && <p className="empty-state">Nenhum estudo encontrado para este filtro.</p>}
        {visibleStudies.map((study) => (
          <div className="routine-item" key={study.id}>
            <div className="accuracy-badge">{study.accuracyPercentage || 0}%</div>
            <div>
              <h4>{study.subject}</h4>
              <p>
                {study.topic} - {study.type} - {study.studiedTime || "sem tempo registrado"}
              </p>
              <span className={`status-chip ${study.status}`}>{study.status}</span>
            </div>
            <div className="item-actions">
              <button className="button tiny" onClick={() => markDone(study.id)} type="button">
                Feito
              </button>
              <button className="button tiny ghost" onClick={() => editStudy(study)} type="button">
                Editar
              </button>
              <button className="button tiny danger" onClick={() => removeStudy(study.id)} type="button">
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export default StudySection;
