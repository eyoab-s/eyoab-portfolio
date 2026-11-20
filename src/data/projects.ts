
export type Project = {
  number: string;
  name: string;
  category: string;
  description: string;
  technologies: string[];
  status: string;
  year: string;
  link?: string;
};

export const projects: Project[] = [
  {
    number: "01",
    name: "Cathedral Academic System",
    category: "EDUCATION / FULL-STACK",
    description:
      "An academic management platform designed to digitize student records, assessments, grades, and school administration.",
    technologies: ["TypeScript", "Express", "PostgreSQL", "Prisma"],
    status: "IN DEVELOPMENT",
    year: "2026",
  },
  {
    number: "02",
    name: "Buldak Doro",
    category: "RESTAURANT / WEB",
    description:
      "A digital restaurant menu experience that lets customers explore menu items through a QR-accessible interface.",
    technologies: ["React", "TypeScript", "Vite"],
    status: "LIVE",
    year: "2026",
    link: "https://buldak-doro-menu.vercel.app/",
  },
  {
    number: "03",
    name: "E-Gebeya",
    category: "E-COMMERCE / FRONTEND",
    description:
      "An e-commerce application featuring product browsing, product details, category filtering, and persistent shopping data.",
    technologies: ["React", "JavaScript", "CSS"],
    status: "COMPLETED",
    year: "2026",
  },
  {
    number: "04",
    name: "ServiceHub",
    category: "BACKEND / API",
    description:
      "A backend API project built with Express, structured around service-related functionality.",
    technologies: ["Node.js", "Express", "JavaScript"],
    status: "IN DEVELOPMENT",
    year: "2026",
  },
];
