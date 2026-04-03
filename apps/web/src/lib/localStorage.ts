import { FormSubmission, User } from './types';

const SUBMISSIONS_KEY = 'form_submissions';
const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'current_user';

export function getSubmissions(): FormSubmission[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    return raw ? (JSON.parse(raw) as FormSubmission[]) : [];
  } catch {
    return [];
  }
}

export function saveSubmission(data: Record<string, string>): void {
  const submissions = getSubmissions();
  submissions.unshift({ timestamp: new Date().toISOString(), ...data });
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
}

export function clearSubmissions(): void {
  localStorage.removeItem(SUBMISSIONS_KEY);
}

export function getUsers(): User[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as User[]) : [];
  } catch {
    return [];
  }
}

export function saveUser(user: User): void {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User): void {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function clearCurrentUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
}
