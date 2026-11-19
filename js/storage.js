export const $ = id => document.getElementById(id);

export const get = (key, fallback = null) => {
    try {
        const v = localStorage.getItem(key);
        return v === null ? fallback : JSON.parse(v);
    } catch {
        return fallback;
    }
};

export const set = (key, value) =>
    localStorage.setItem(key, JSON.stringify(value));

export const uid = () =>
    Date.now().toString(36) +
    Math.random().toString(36).slice(2);

export const today = () =>
    new Date().toISOString().slice(0, 10);

export const esc = value =>
    String(value ?? "").replace(/[&<>"']/g, c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    }[c]));

export const dateText = value =>
    new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

export function initStorage() {
    [
        "subjects",
        "questions",
        "tasks",
        "exams",
        "tests",
        "resources",
        "planner",
        "pyqs",
        "portals"
    ].forEach(key => {
        if (localStorage.getItem(key) === null) {
            set(key, []);
        }
    });
}