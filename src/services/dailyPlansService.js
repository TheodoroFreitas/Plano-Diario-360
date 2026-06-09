import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export function createEmptyDailyPlan(date) {
  return {
    date,
    schedule: [],
    devotional: {
      bibleReading: "",
      prayer: "",
      verse: "",
      practicalApplication: "",
      gratitude: "",
      spiritualWatchPoint: "",
      done: false,
    },
    meals: [],
    nutritionChecklist: {
      water: false,
      noSweets: false,
      protein: false,
      realFood: false,
      outOfPlan: false,
    },
    workout: {
      type: "descanso",
      exercises: "",
      setsRepsLoad: "",
      duration: "",
      energyLevel: 5,
      previousSleep: "médio",
      painOrDiscomfort: "",
      note: "",
      done: false,
    },
    studies: [],
    tasks: [],
    dailyReview: {
      whatWorked: "",
      whatFailed: "",
      tomorrowAdjustment: "",
      wasGodPriority: false,
      dayScore: 0,
      finalNote: "",
    },
  };
}

function normalizeBoolean(value) {
  return Boolean(value);
}

export function normalizeDailyPlan(date, data = {}) {
  const empty = createEmptyDailyPlan(date);

  return {
    ...empty,
    ...data,
    date,
    schedule: Array.isArray(data.schedule) ? data.schedule : empty.schedule,
    devotional: {
      ...empty.devotional,
      ...(data.devotional || {}),
      done: normalizeBoolean(data.devotional?.done),
    },
    meals: Array.isArray(data.meals) ? data.meals : empty.meals,
    nutritionChecklist: {
      ...empty.nutritionChecklist,
      ...(data.nutritionChecklist || {}),
    },
    workout: {
      ...empty.workout,
      ...(data.workout || {}),
      done: normalizeBoolean(data.workout?.done),
      energyLevel: Number(data.workout?.energyLevel ?? empty.workout.energyLevel),
    },
    studies: Array.isArray(data.studies) ? data.studies : empty.studies,
    tasks: Array.isArray(data.tasks) ? data.tasks : empty.tasks,
    dailyReview: {
      ...empty.dailyReview,
      ...(data.dailyReview || {}),
      wasGodPriority: normalizeBoolean(data.dailyReview?.wasGodPriority),
      dayScore: Number(data.dailyReview?.dayScore ?? empty.dailyReview.dayScore),
    },
  };
}

function planRef(date) {
  return doc(db, "dailyPlans", date);
}

async function upsertPlanFields(date, fields) {
  const ref = planRef(date);
  const snapshot = await getDoc(ref);
  const timestamps = snapshot.exists()
    ? { createdAt: snapshot.data().createdAt || serverTimestamp(), updatedAt: serverTimestamp() }
    : { createdAt: serverTimestamp(), updatedAt: serverTimestamp() };

  await setDoc(ref, { date, ...fields, ...timestamps }, { merge: true });
}

export async function getDailyPlan(date) {
  const snapshot = await getDoc(planRef(date));

  if (!snapshot.exists()) {
    return createEmptyDailyPlan(date);
  }

  return normalizeDailyPlan(date, snapshot.data());
}

export async function createOrUpdateDailyPlan(date, data) {
  const normalized = normalizeDailyPlan(date, data);
  await upsertPlanFields(date, normalized);
  return normalized;
}

export async function deleteDailyPlan(date) {
  await deleteDoc(planRef(date));
}

export async function getDailyPlansInRange(startDate, endDate) {
  const plansQuery = query(
    collection(db, "dailyPlans"),
    where("date", ">=", startDate),
    where("date", "<=", endDate),
    orderBy("date", "asc"),
  );

  const snapshot = await getDocs(plansQuery);
  return snapshot.docs.map((item) => normalizeDailyPlan(item.id, item.data()));
}

export async function updateSchedule(date, schedule) {
  await upsertPlanFields(date, { schedule });
}

export async function updateDevotional(date, devotional) {
  await upsertPlanFields(date, { devotional });
}

export async function updateMeals(date, meals, nutritionChecklist) {
  const fields = { meals };
  if (nutritionChecklist) {
    fields.nutritionChecklist = nutritionChecklist;
  }

  await upsertPlanFields(date, fields);
}

export async function updateWorkout(date, workout) {
  await upsertPlanFields(date, { workout });
}

export async function updateStudies(date, studies) {
  await upsertPlanFields(date, { studies });
}

export async function updateTasks(date, tasks) {
  await upsertPlanFields(date, { tasks });
}

export async function updateDailyReview(date, dailyReview) {
  await upsertPlanFields(date, { dailyReview });
}
