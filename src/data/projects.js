import hema1 from "../assets/project-hema-1.jpg";
import hema2 from "../assets/project-hema-2.jpg";
// import bookon1 from "../assets/project-bookon-1.jpg"; // optional

export const projects = [
  {
    id: "hema-ml",
    title: "Detecting Hematological Disorders Using Machine Learning",
    subtitle: "Thesis Project • Computer Vision",
    category: "Research",
    tags: ["Python", "OpenCV", "TensorFlow", "CNN", "Image Processing"],
    summary:
      "A diagnostic support system to assist in detecting hematological disorders (especially anemia) using automated blood smear image analysis.",
    role: "Thesis Researcher & Software Developer",
    highlights: [
      "Preprocessing and enhancement pipeline for blood smear images",
      "RBC segmentation and isolation strategies",
      "Automated RBC counting with hemocytometer images",
      "CNN-based classification and evaluation workflow",
    ],
    images: [hema1, hema2].filter(Boolean),
    links: [
      { label: "Case Study", href: "#" },
      { label: "Repo", href: "#" },
    ],
  },
  {
    id: "school-banking",
    title: "School Banking Application System",
    subtitle: "Academic Project • Desktop App",
    category: "Academic",
    tags: ["C#", "SQL", "OOP", "Authentication"],
    summary:
      "A desktop banking simulation system with secure authentication, account management, and protected transactions.",
    role: "Software Developer",
    highlights: [
      "User registration and secure login",
      "Cash-in / cash-out transaction flows",
      "Balance validation and safety checks",
      "Parent & child account linking",
    ],
    images: [],
    links: [{ label: "Overview", href: "#" }],
  },
  {
    id: "bookon",
    title: "BookOn – Full-Stack Appointment Booking System",
    subtitle: "Internship Project • Web App",
    category: "Internship",
    tags: ["Vue.js", "Spring Boot", "REST API", "MySQL", "Playwright"],
    summary:
      "A full-stack appointment booking system built during internship, streamlining scheduling and appointment management.",
    role: "Software Engineer Intern (Frontend & Backend)",
    highlights: [
      "User registration and login flows",
      "Appointment booking and status lifecycle",
      "Backend API integration",
      "Automation testing and regression validation",
    ],
    images: [],
    links: [
      { label: "Walkthrough", href: "#" },
      { label: "Repo", href: "#" },
    ],
  },
];
