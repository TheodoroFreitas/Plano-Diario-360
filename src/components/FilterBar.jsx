const filters = [
  { value: "all", label: "Ver tudo" },
  { value: "tasks", label: "Tarefas" },
  { value: "schedule", label: "Agenda por hora" },
  { value: "meals", label: "Alimentação" },
  { value: "workout", label: "Exercício" },
  { value: "devotional", label: "Devocional" },
  { value: "study", label: "Estudo concurso" },
  { value: "pending", label: "Pendentes" },
  { value: "completed", label: "Concluídos" },
];

function FilterBar({ value, onChange }) {
  return (
    <div className="filter-bar" aria-label="Filtros do plano diário">
      {filters.map((filter) => (
        <button
          className={value === filter.value ? "filter-button active" : "filter-button"}
          key={filter.value}
          onClick={() => onChange(filter.value)}
          type="button"
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;
