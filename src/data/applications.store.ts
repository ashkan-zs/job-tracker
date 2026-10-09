import type { Application } from "../schemas/application.schema.js";

const initialApplications: Application[] = [
  {
    id: 1,
    company: "flex",
    position: "frontend",
    status: "applied",
  },
  {
    id: 2,
    company: "strong",
    position: "frontend",
    status: "applied",
  },
  {
    id: 3,
    company: "blue",
    position: "frontend",
    status: "applied",
  },
];

export const applications: Application[] = [...initialApplications];

export const resetApplications = () => {
  applications.slice(0);
  applications.push(...initialApplications);
};
