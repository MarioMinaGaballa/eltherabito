export const PATIENT_NOTES_STORAGE_KEY = 'eltherabito-patient-personal-notes';

// Personal notes are a local-only journal; start empty (no seeded mock note).
const DEFAULT_NOTES = [];

export function loadPatientNotes() {
  try {
    const saved = localStorage.getItem(PATIENT_NOTES_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    /* ignore */
  }
  return structuredClone(DEFAULT_NOTES);
}

export function savePatientNotes(notes) {
  localStorage.setItem(PATIENT_NOTES_STORAGE_KEY, JSON.stringify(notes));
}

export function addPatientNote(text) {
  const trimmed = text.trim();
  if (!trimmed) return loadPatientNotes();

  const note = {
    id: String(Date.now()),
    date: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    author: 'You',
    text: trimmed,
    latest: true,
  };

  const updated = [note, ...loadPatientNotes().map((n) => ({ ...n, latest: false }))];
  savePatientNotes(updated);
  return updated;
}
