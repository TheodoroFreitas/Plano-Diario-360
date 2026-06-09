const workoutTypes = ["full body", "superiores", "inferiores", "cardio", "descanso", "alongamento"];

function WorkoutSection({ workout, onChange, onSave, saving, statusFilter }) {
  const isHiddenByStatus =
    (statusFilter === "completed" && !workout.done) || (statusFilter === "pending" && workout.done);
  const needsRestWarning = workout.previousSleep === "ruim" && Number(workout.energyLevel) <= 4;

  if (isHiddenByStatus) {
    return null;
  }

  function updateField(field, value) {
    onChange({ ...workout, [field]: value });
  }

  return (
    <article className="section-card workout-section">
      <div className="section-title">
        <div>
          <p className="eyebrow">Exercício</p>
          <h3>Treino, energia e recuperação</h3>
        </div>
        <button className="button primary" onClick={onSave} disabled={saving} type="button">
          {saving ? "Salvando..." : "Salvar treino"}
        </button>
      </div>

      {needsRestWarning && (
        <div className="warning-panel">
          Sono ruim e energia baixa. Considere descanso, alongamento ou treino leve hoje.
        </div>
      )}

      <div className="form-grid">
        <label>
          Tipo de treino
          <select value={workout.type} onChange={(event) => updateField("type", event.target.value)}>
            {workoutTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>
        <label>
          Duração
          <input
            value={workout.duration}
            onChange={(event) => updateField("duration", event.target.value)}
            placeholder="Ex.: 45 min"
          />
        </label>
        <label>
          Energia do dia: {workout.energyLevel}
          <input
            type="range"
            min="0"
            max="10"
            value={workout.energyLevel}
            onChange={(event) => updateField("energyLevel", Number(event.target.value))}
          />
        </label>
        <label>
          Sono anterior
          <select value={workout.previousSleep} onChange={(event) => updateField("previousSleep", event.target.value)}>
            <option value="bom">Bom</option>
            <option value="médio">Médio</option>
            <option value="ruim">Ruim</option>
          </select>
        </label>
        <label className="wide-field">
          Exercícios
          <textarea
            rows="3"
            value={workout.exercises}
            onChange={(event) => updateField("exercises", event.target.value)}
            placeholder="Liste os exercícios do treino"
          />
        </label>
        <label className="wide-field">
          Séries, repetições e carga
          <textarea
            rows="2"
            value={workout.setsRepsLoad}
            onChange={(event) => updateField("setsRepsLoad", event.target.value)}
          />
        </label>
        <label>
          Dor ou desconforto
          <input
            value={workout.painOrDiscomfort}
            onChange={(event) => updateField("painOrDiscomfort", event.target.value)}
          />
        </label>
        <label className="wide-field">
          Observação
          <textarea rows="2" value={workout.note} onChange={(event) => updateField("note", event.target.value)} />
        </label>
        <label className="check-row wide-field">
          <input
            type="checkbox"
            checked={workout.done}
            onChange={(event) => updateField("done", event.target.checked)}
          />
          Treino feito
        </label>
      </div>
    </article>
  );
}

export default WorkoutSection;
