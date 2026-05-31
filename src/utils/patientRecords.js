/** Demo contact details keyed by agenda session (until API provides patient id) */
const CONTACT_BY_SESSION = {
  1: { phone: '+20 123 456 7890', gender: 'Female', email: 'sarah.mitchell@example.com' },
  2: { phone: '+20 100 222 3344', gender: 'Male', email: 'james.parker@example.com' },
  3: { phone: '+20 101 333 4455', gender: 'Male', email: 'michael.ross@example.com' },
  4: { phone: '+20 102 444 5566', gender: 'Female', email: 'elena.rodriguez@example.com' },
  5: { phone: '+20 103 555 6677', gender: 'Male', email: 'david.chang@example.com' },
  6: { phone: '+20 104 666 7788', gender: 'Female', email: 'anna.west@example.com' },
};

const DEFAULT_CONTACT = {
  phone: '+20 123 456 7890',
  gender: 'Male',
  email: 'ahmed.ali@example.com',
};

const DEFAULT_PHOTO =
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100';

/**
 * Patient payload passed via router state from agenda (no id in URL yet).
 * @param {object|null} state — location.state from navigate()
 */
export function getPatientFromState(state) {
  if (!state?.name) return null;

  const contact = CONTACT_BY_SESSION[state.sessionId] || DEFAULT_CONTACT;

  return {
    name: state.name,
    photo: state.photo || DEFAULT_PHOTO,
    phone: state.phone || contact.phone,
    gender: state.gender || contact.gender,
    email: state.email || contact.email,
    /** Local key for notes until backend patient id exists */
    notesKey: state.sessionId != null ? `session-${state.sessionId}` : state.name,
  };
}
