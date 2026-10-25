import { demoUsers, initialRequests, skillCatalog } from '../data/initialData.js';

const KEYS = {
  users: 'skillswap_registeredUsers',
  currentUser: 'skillswap_currentUser',
  skills: 'skillswap_skills',
  requests: 'skillswap_requests',
  favourites: 'skillswap_favourites',
  progress: 'skillswap_learningProgress',
};

export function getData(key, fallback = []) {
  try {
    const value = localStorage.getItem(KEYS[key] || key);
    return value === null ? fallback : JSON.parse(value);
  } catch (error) {
    console.error(`Unable to read ${key} from localStorage.`, error);
    return fallback;
  }
}

export function saveData(key, value) {
  try {
    localStorage.setItem(KEYS[key] || key, JSON.stringify(value));
    return value;
  } catch (error) {
    console.error(`Unable to save ${key} to localStorage.`, error);
    throw new Error('Your changes could not be saved. Please check available browser storage.');
  }
}

export function updateData(key, updater, fallback = []) {
  const nextValue = updater(getData(key, fallback));
  return saveData(key, nextValue);
}

export function removeData(key) {
  localStorage.removeItem(KEYS[key] || key);
}

export function initializeStorage() {
  const storedUsers = getData('users', demoUsers);
  const currentDemoIds = new Set(demoUsers.map((user) => user.id));
  const oldDemoIds = new Set(storedUsers.map((user) => user.id).filter((id) => id?.startsWith('demo-') && !currentDemoIds.has(id)));
  const registeredUsers = storedUsers.filter((user) => !user.id?.startsWith('demo-'));
  saveData('users', [...demoUsers, ...registeredUsers]);
  if (!localStorage.getItem(KEYS.skills)) saveData('skills', skillCatalog);
  const requests = getData('requests', initialRequests);
  const validUserIds = new Set([...demoUsers, ...registeredUsers].map((user) => user.id));
  const validRequests = requests.filter((request) =>
    !['request-demo-1', 'request-demo-2'].includes(request.id) &&
    !oldDemoIds.has(request.from) &&
    !oldDemoIds.has(request.to) &&
    validUserIds.has(request.from) &&
    validUserIds.has(request.to));
  saveData('requests', validRequests.length ? validRequests : initialRequests);
  if (!localStorage.getItem(KEYS.favourites)) saveData('favourites', {});
  if (!localStorage.getItem(KEYS.progress)) saveData('progress', {});
  const current = getData('currentUser', null);
  if (current && !validUserIds.has(current.id)) removeData('currentUser');
  const favourites = getData('favourites', {});
  const removedIds = oldDemoIds;
  const cleanFavourites = Object.fromEntries(Object.entries(favourites).map(([userId, ids]) => [
    userId,
    (Array.isArray(ids) ? ids : []).filter((id) => !removedIds.has(id) && validUserIds.has(id)),
  ]).filter(([userId]) => validUserIds.has(userId)));
  saveData('favourites', cleanFavourites);
  const progress = getData('progress', {});
  const cleanProgress = Object.fromEntries(Object.entries(progress).filter(([userId]) => !removedIds.has(userId) && validUserIds.has(userId)));
  saveData('progress', cleanProgress);
}

export function addSkillsToCatalog(skills) {
  const catalog = getData('skills', skillCatalog);
  const known = new Set(catalog.map((skill) => skill.name.toLowerCase()));
  const additions = skills
    .filter((name) => name && !known.has(name.toLowerCase()))
    .map((name) => ({ name, category: 'Other', icon: '✦' }));
  if (additions.length) saveData('skills', [...catalog, ...additions]);
}

export function getCurrentUser() {
  const current = getData('currentUser', null);
  if (!current?.id) return null;
  return getData('users', []).find((user) => user.id === current.id) || null;
}

export function setCurrentUser(user) {
  return saveData('currentUser', user ? { id: user.id } : null);
}

export function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'SS';
}

export function getMatchPercentage(user, candidate) {
  const wanted = (user?.wants || []).map((skill) => skill.toLowerCase());
  const taught = (candidate?.teaches || []).map((skill) => skill.toLowerCase());
  const offered = (user?.teaches || []).map((skill) => skill.toLowerCase());
  const candidateWants = (candidate?.wants || []).map((skill) => skill.toLowerCase());
  const learnOverlap = wanted.filter((skill) => taught.includes(skill)).length;
  const teachOverlap = offered.filter((skill) => candidateWants.includes(skill)).length;
  if (!wanted.length || !learnOverlap) return 0;
  const learningFit = learnOverlap / wanted.length;
  const teachingFit = offered.length ? teachOverlap / offered.length : 0;
  return Math.round(learningFit * 70 + teachingFit * 30);
}
