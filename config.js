/**
 * ============================================================================
 * config.js
 * Author: Stuart Cannon Gray
 * Description: Central configuration file for personalizing the timeline's
 *              metadata, default theme/layout, brand colors, and events.
 * ============================================================================
 */

window.DEFAULT_TIMELINE_CONFIG = {
  // 1. Metadata & Author Attribution
  author: "m00tiny",
  eyebrow: "CHRONOLOGY & MILESTONES",
  title: "Systems, Security & Engineering Timeline",
  subtitle:
    "Key architectural deployments, infrastructure milestones, and research initiatives.",

  // 2. Default Visual Preferences
  defaultTheme: "light",        // Options: "light" | "dark"
  defaultLayout: "vertical",    // Options: "vertical" | "horizontal"
  accentColor: "#2563eb",       // Any valid HEX color code
  density: "comfortable",       // Options: "comfortable" | "compact"
  showTags: true,               // Toggle category badges on timeline cards

  // 3. Timeline Events Array (Ordered chronologically or reverse-chronologically)
  events: [
    {
      date: "2022",
      tag: "Infrastructure",
      title: "Hardened Linux & Hybrid Cloud Architecture",
      description:
        "Designed and deployed automated provisioning pipelines, hardened kernel baselines, and zero-trust network segmentation across production Linux clusters.",
      linkText: "View Architecture Notes →",
      linkUrl: "#"
    },
    {
      date: "2023",
      tag: "Application Security",
      title: "Automated Vulnerability Triage & Threat Modeling",
      description:
        "Engineered static and dynamic security analysis workflows, reducing remediation turnaround times and establishing repeatable threat-modeling standards.",
      linkText: "",
      linkUrl: ""
    },
    {
      date: "2024",
      tag: "Systems Engineering",
      title: "High-Availability Distributed Systems Rollout",
      description:
        "Architected fault-tolerant service meshes, automated failover orchestration, and real-time telemetry observability.",
      linkText: "",
      linkUrl: ""
    },
    {
      date: "2025",
      tag: "Security Architecture",
      title: "Enterprise Identity & Cryptographic Key Management",
      description:
        "Implemented hardware-backed signing infrastructure, short-lived certificate issuance, and end-to-end audit logging.",
      linkText: "",
      linkUrl: ""
    },
    {
      date: "2026",
      tag: "Cognitive Systems",
      title: "Belief Revision & Psychological Resilience Research",
      description:
        "Investigating structured cognitive frameworks, emotional granularity, and adaptive decision-making models under high-stress environments.",
      linkText: "",
      linkUrl: ""
    }
  ]
};
