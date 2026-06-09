import { useEffect, useState } from "react";
import CalendarView from "./components/CalendarView";
import Dashboard from "./components/Dashboard";
import DayPlan from "./components/DayPlan";
import { formatLongDate, toISODate } from "./lib/date";

const today = toISODate();

function App() {
  const [screen, setScreen] = useState("dashboard");
  const [selectedDate, setSelectedDate] = useState(today);
  const [theme, setTheme] = useState(() => localStorage.getItem("pd360-theme") || "light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("pd360-theme", theme);
  }, [theme]);

  function openDay(date) {
    setSelectedDate(date);
    setScreen("day");
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Plano Diário 360</p>
          <h1>Organize seu dia com propósito, disciplina e equilíbrio.</h1>
          <span className="today-label">{formatLongDate(today)}</span>
        </div>

        <nav className="top-actions" aria-label="Navegação principal">
          <button
            className={screen === "dashboard" ? "button primary" : "button ghost"}
            onClick={() => setScreen("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={screen === "calendar" ? "button primary" : "button ghost"}
            onClick={() => setScreen("calendar")}
          >
            Calendário
          </button>
          <button className="button accent" onClick={() => openDay(today)}>
            Hoje
          </button>
          <button
            className="button icon-button"
            aria-label="Alternar tema"
            onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
          >
            {theme === "dark" ? "Claro" : "Escuro"}
          </button>
        </nav>
      </header>

      {screen === "dashboard" && (
        <Dashboard
          date={today}
          onOpenCalendar={() => setScreen("calendar")}
          onOpenToday={() => openDay(today)}
        />
      )}

      {screen === "calendar" && <CalendarView onSelectDate={openDay} selectedDate={selectedDate} />}

      {screen === "day" && (
        <DayPlan
          date={selectedDate}
          onBack={() => setScreen("calendar")}
          onOpenToday={() => openDay(today)}
        />
      )}
    </div>
  );
}

export default App;
