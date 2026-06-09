# Plano Diário 360

Organize seu dia com propósito, disciplina e equilíbrio.

## Descrição

Plano Diário 360 é um painel web para planejar a rotina completa de qualquer data. O calendário é o centro do sistema: ao clicar em um dia, o usuário acessa agenda por hora, devocional, alimentação, exercício, estudo para concurso, tarefas gerais e revisão diária.

O projeto salva, edita, lista e exclui dados no Firebase Firestore usando a coleção `dailyPlans`, com documentos identificados pela data no formato `YYYY-MM-DD`.

## Tecnologias

- React
- Vite
- Firebase Firestore
- CSS moderno responsivo

## Como instalar

```bash
npm install
npm install firebase
```

## Como rodar localmente

```bash
npm run dev
```

Depois, abra a URL exibida pelo Vite no terminal.

## Configuração Firebase

A configuração pública do Firebase está em `src/lib/firebase.js`:

```js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBa1NqoHWGhALyG2vs4FNPSmU-xts-T1VM",
  authDomain: "plano-diario-360.firebaseapp.com",
  projectId: "plano-diario-360",
  storageBucket: "plano-diario-360.firebasestorage.app",
  messagingSenderId: "1028464282418",
  appId: "1:1028464282418:web:ca6aec1098f238e61ca52b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

Para funcionar em produção, o projeto Firebase precisa ter o Firestore ativado e regras compatíveis com a forma de acesso escolhida.

Para teste local sem autenticação, é possível liberar temporariamente a coleção `dailyPlans` nas regras do Firestore. Use apenas em ambiente de desenvolvimento:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /dailyPlans/{date} {
      allow read, write: if true;
    }
  }
}
```

Em produção, substitua essa regra por autenticação e validações de usuário.

## Estrutura do projeto

```text
src/
  components/
    CalendarView.jsx
    Dashboard.jsx
    DayPlan.jsx
    ScheduleSection.jsx
    DevotionalSection.jsx
    NutritionSection.jsx
    WorkoutSection.jsx
    StudySection.jsx
    TasksSection.jsx
    DailyReviewSection.jsx
    FilterBar.jsx
  lib/
    date.js
    firebase.js
    id.js
  services/
    dailyPlansService.js
  App.jsx
  main.jsx
  styles.css
```

## Firestore

Coleção principal:

```text
dailyPlans
```

Exemplo de documento:

```text
dailyPlans/2026-06-08
```

Campos principais:

- `schedule`
- `devotional`
- `meals`
- `nutritionChecklist`
- `workout`
- `studies`
- `tasks`
- `dailyReview`
- `createdAt`
- `updatedAt`

## Funcionalidades

- Dashboard com saudação, data atual e resumo do dia.
- Calendário mensal com indicadores por categoria.
- Criação e edição de plano para qualquer data.
- Assistente do dia com modelos automáticos de rotina.
- Criação rápida de tarefas por texto, prioridade e área.
- Modelos prontos para tarefas recorrentes.
- CRUD de blocos de horário, refeições, estudos e tarefas.
- Seções editáveis para devocional, treino e revisão do dia.
- Cálculo automático do percentual de acertos nos estudos.
- Filtros por categoria, pendentes e concluídos.
- Modo claro/escuro.
- Animações e microinterações para facilitar a leitura visual.
- Tratamento básico de carregamento e erros.

## Próximos passos sugeridos

- Adicionar autenticação por usuário com Firebase Auth.
- Criar relatórios semanais e mensais.
- Enviar lembretes para blocos importantes do dia.
- Permitir exportação do plano em PDF.
- Criar regras de segurança mais específicas no Firestore.
