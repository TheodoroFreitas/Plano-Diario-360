function DailyReviewSection({ review, onChange, onSave, saving, statusFilter }) {
  if (statusFilter === "pending" || statusFilter === "completed") {
    return null;
  }

  function updateField(field, value) {
    onChange({ ...review, [field]: value });
  }

  return (
    <article className="section-card review-section">
      <div className="section-title">
        <div>
          <p className="eyebrow">Revisão do dia</p>
          <h3>Fechamento e ajustes para amanhã</h3>
        </div>
        <button className="button primary" onClick={onSave} disabled={saving} type="button">
          {saving ? "Salvando..." : "Salvar revisão"}
        </button>
      </div>

      <div className="form-grid">
        <label className="wide-field">
          O que funcionou hoje?
          <textarea
            rows="3"
            value={review.whatWorked}
            onChange={(event) => updateField("whatWorked", event.target.value)}
          />
        </label>
        <label className="wide-field">
          O que falhou?
          <textarea
            rows="3"
            value={review.whatFailed}
            onChange={(event) => updateField("whatFailed", event.target.value)}
          />
        </label>
        <label className="wide-field">
          O que preciso ajustar amanhã?
          <textarea
            rows="3"
            value={review.tomorrowAdjustment}
            onChange={(event) => updateField("tomorrowAdjustment", event.target.value)}
          />
        </label>
        <label>
          Nota do dia: {review.dayScore}
          <input
            type="range"
            min="0"
            max="10"
            value={review.dayScore}
            onChange={(event) => updateField("dayScore", Number(event.target.value))}
          />
        </label>
        <label className="check-row">
          <input
            type="checkbox"
            checked={review.wasGodPriority}
            onChange={(event) => updateField("wasGodPriority", event.target.checked)}
          />
          Deus foi prioridade hoje?
        </label>
        <label className="wide-field">
          Observação final
          <textarea
            rows="3"
            value={review.finalNote}
            onChange={(event) => updateField("finalNote", event.target.value)}
          />
        </label>
      </div>
    </article>
  );
}

export default DailyReviewSection;
