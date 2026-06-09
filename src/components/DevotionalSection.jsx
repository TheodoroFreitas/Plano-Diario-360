function DevotionalSection({ devotional, onChange, onSave, saving, statusFilter }) {
  const isHiddenByStatus =
    (statusFilter === "completed" && !devotional.done) ||
    (statusFilter === "pending" && devotional.done);

  if (isHiddenByStatus) {
    return null;
  }

  function updateField(field, value) {
    onChange({ ...devotional, [field]: value });
  }

  return (
    <article className="section-card devotional-section">
      <div className="section-title">
        <div>
          <p className="eyebrow">Devocional</p>
          <h3>Prioridade do dia</h3>
        </div>
        <button className="button primary" onClick={onSave} disabled={saving} type="button">
          {saving ? "Salvando..." : "Salvar devocional"}
        </button>
      </div>

      <div className="priority-note">
        Reserve este espaço para alinhar o dia antes de preencher o restante da rotina.
      </div>

      <div className="form-grid">
        <label>
          Leitura bíblica
          <input
            value={devotional.bibleReading}
            onChange={(event) => updateField("bibleReading", event.target.value)}
            placeholder="Ex.: Salmos 23"
          />
        </label>
        <label>
          Versículo do dia
          <input
            value={devotional.verse}
            onChange={(event) => updateField("verse", event.target.value)}
            placeholder="Texto ou referência"
          />
        </label>
        <label className="wide-field">
          Oração
          <textarea
            rows="3"
            value={devotional.prayer}
            onChange={(event) => updateField("prayer", event.target.value)}
          />
        </label>
        <label className="wide-field">
          Aplicação prática
          <textarea
            rows="3"
            value={devotional.practicalApplication}
            onChange={(event) => updateField("practicalApplication", event.target.value)}
          />
        </label>
        <label>
          Gratidão
          <input
            value={devotional.gratitude}
            onChange={(event) => updateField("gratitude", event.target.value)}
          />
        </label>
        <label>
          Ponto de vigilância espiritual
          <input
            value={devotional.spiritualWatchPoint}
            onChange={(event) => updateField("spiritualWatchPoint", event.target.value)}
          />
        </label>
        <label className="check-row wide-field">
          <input
            type="checkbox"
            checked={devotional.done}
            onChange={(event) => updateField("done", event.target.checked)}
          />
          Devocional feito hoje
        </label>
      </div>
    </article>
  );
}

export default DevotionalSection;
