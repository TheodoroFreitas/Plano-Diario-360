import { makeId } from "../lib/id";

const presets = [
  {
    key: "balanced",
    title: "Rotina equilibrada",
    subtitle: "Devocional, água, estudo, treino e revisão do dia.",
    accent: "balanced",
    schedule: [
      {
        startTime: "06:30",
        endTime: "07:00",
        title: "Devocional e oração",
        category: "Devocional",
        note: "Começar alinhando prioridades",
        status: "planejado",
      },
      {
        startTime: "12:00",
        endTime: "12:30",
        title: "Almoço dentro do plano",
        category: "Alimentação",
        note: "Refeição simples e consistente",
        status: "planejado",
      },
      {
        startTime: "18:30",
        endTime: "19:20",
        title: "Treino do dia",
        category: "Treino",
        note: "Ajustar intensidade conforme energia",
        status: "planejado",
      },
      {
        startTime: "20:00",
        endTime: "21:15",
        title: "Estudo para concurso",
        category: "Estudo",
        note: "Teoria + questões",
        status: "planejado",
      },
      {
        startTime: "21:30",
        endTime: "21:45",
        title: "Revisão do dia",
        category: "Outros",
        note: "Fechar pendências e ajustar amanhã",
        status: "planejado",
      },
    ],
    tasks: [
      {
        title: "Beber água ao longo do dia",
        description: "Marcar checklist de hidratação.",
        area: "pessoal",
        priority: "média",
        optionalTime: "",
        note: "Criada pelo assistente do dia.",
      },
      {
        title: "Separar 3 prioridades reais",
        description: "Definir o que precisa acontecer hoje.",
        area: "pessoal",
        priority: "alta",
        optionalTime: "",
        note: "Criada pelo assistente do dia.",
      },
      {
        title: "Preparar amanhã antes de dormir",
        description: "Revisar agenda, alimentação e estudo.",
        area: "casa",
        priority: "média",
        optionalTime: "21:45",
        note: "Criada pelo assistente do dia.",
      },
    ],
    study: {
      subject: "Português",
      topic: "Bloco principal do edital",
      type: "questões",
      studiedTime: "1h15",
      questions: 20,
      correctAnswers: 0,
      accuracyPercentage: 0,
      difficulty: "médio",
      status: "planejado",
    },
  },
  {
    key: "study",
    title: "Foco em estudos",
    subtitle: "Monta blocos para teoria, questões e revisão.",
    accent: "study",
    schedule: [
      {
        startTime: "19:00",
        endTime: "19:45",
        title: "Teoria do edital",
        category: "Estudo",
        note: "Ler e resumir pontos-chave",
        status: "planejado",
      },
      {
        startTime: "19:50",
        endTime: "20:40",
        title: "Questões comentadas",
        category: "Estudo",
        note: "Registrar acertos e erros",
        status: "planejado",
      },
      {
        startTime: "20:45",
        endTime: "21:05",
        title: "Revisão rápida",
        category: "Estudo",
        note: "Flashcards ou caderno de erros",
        status: "planejado",
      },
    ],
    tasks: [
      {
        title: "Resolver 20 questões",
        description: "Registrar quantidade de acertos no bloco de estudos.",
        area: "projeto",
        priority: "alta",
        optionalTime: "19:50",
        note: "Criada pelo assistente do dia.",
      },
      {
        title: "Atualizar caderno de erros",
        description: "Anotar o motivo dos erros principais.",
        area: "projeto",
        priority: "média",
        optionalTime: "21:05",
        note: "Criada pelo assistente do dia.",
      },
    ],
    study: {
      subject: "Banco de Dados",
      topic: "Questões do edital",
      type: "questões",
      studiedTime: "1h30",
      questions: 20,
      correctAnswers: 0,
      accuracyPercentage: 0,
      difficulty: "médio",
      status: "planejado",
    },
  },
  {
    key: "light",
    title: "Dia leve",
    subtitle: "Reduz carga e prioriza constância.",
    accent: "light",
    schedule: [
      {
        startTime: "07:00",
        endTime: "07:20",
        title: "Devocional breve",
        category: "Devocional",
        note: "Leitura, oração e gratidão",
        status: "planejado",
      },
      {
        startTime: "18:30",
        endTime: "19:00",
        title: "Alongamento ou caminhada",
        category: "Treino",
        note: "Movimento leve",
        status: "planejado",
      },
      {
        startTime: "21:00",
        endTime: "21:15",
        title: "Revisão simples",
        category: "Outros",
        note: "Fechar o dia sem excesso",
        status: "planejado",
      },
    ],
    tasks: [
      {
        title: "Fazer apenas o essencial",
        description: "Escolher uma tarefa principal e uma secundária.",
        area: "pessoal",
        priority: "alta",
        optionalTime: "",
        note: "Criada pelo assistente do dia.",
      },
      {
        title: "Dormir mais cedo",
        description: "Preparar ambiente e reduzir telas.",
        area: "pessoal",
        priority: "média",
        optionalTime: "22:00",
        note: "Criada pelo assistente do dia.",
      },
    ],
    workout: {
      type: "alongamento",
      exercises: "Alongamento geral ou caminhada leve",
      setsRepsLoad: "20 a 30 minutos em ritmo confortável",
      duration: "30 min",
      energyLevel: 4,
      previousSleep: "médio",
      painOrDiscomfort: "",
      note: "Dia leve criado pelo assistente.",
      done: false,
    },
  },
];

function withIds(items, prefix) {
  return items.map((item) => ({
    ...item,
    id: makeId(prefix),
  }));
}

function mergeUniqueByTitle(currentItems, nextItems) {
  const existingTitles = new Set(currentItems.map((item) => item.title?.trim().toLowerCase()));
  const uniqueItems = nextItems.filter((item) => !existingTitles.has(item.title?.trim().toLowerCase()));
  return [...currentItems, ...uniqueItems];
}

function mergeUniqueStudy(currentItems, nextItems) {
  const existingKeys = new Set(
    currentItems.map((item) => `${item.subject || ""}:${item.topic || ""}`.trim().toLowerCase()),
  );
  const uniqueItems = nextItems.filter(
    (item) => !existingKeys.has(`${item.subject || ""}:${item.topic || ""}`.trim().toLowerCase()),
  );
  return [...currentItems, ...uniqueItems];
}

function sortSchedule(items) {
  return [...items].sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));
}

function SmartPlanner({ plan, onApply }) {
  function applyPreset(preset) {
    const nextSchedule = preset.schedule
      ? sortSchedule(mergeUniqueByTitle(plan.schedule, withIds(preset.schedule, "schedule")))
      : plan.schedule;
    const nextTasks = preset.tasks
      ? mergeUniqueByTitle(
          plan.tasks,
          withIds(
            preset.tasks.map((task) => ({ ...task, status: "a fazer" })),
            "task",
          ),
        )
      : plan.tasks;
    const nextStudies = preset.study
      ? mergeUniqueStudy(plan.studies, withIds([preset.study], "study"))
      : plan.studies;

    onApply({
      ...plan,
      schedule: nextSchedule,
      tasks: nextTasks,
      studies: nextStudies,
      workout: preset.workout ? { ...plan.workout, ...preset.workout } : plan.workout,
    });
  }

  return (
    <article className="smart-planner panel">
      <div className="section-title compact-title">
        <div>
          <p className="eyebrow">Assistente do dia</p>
          <h3>Crie uma rotina inicial em um clique</h3>
        </div>
        <span className="automation-pill">Automático</span>
      </div>

      <div className="preset-grid">
        {presets.map((preset) => (
          <button
            className={`preset-card ${preset.accent}`}
            key={preset.key}
            onClick={() => applyPreset(preset)}
            type="button"
          >
            <span>{preset.title}</span>
            <small>{preset.subtitle}</small>
          </button>
        ))}
      </div>
    </article>
  );
}

export default SmartPlanner;
