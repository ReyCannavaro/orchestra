# 🎻 ORCHESTRA: Next.js Fullstack Agent Directive (AGENTS.md)

> **Paradigm:** The Symphony Multi-Agent Orchestration Protocol  
> **Stack Specialization:** Next.js (App Router) + React 19 + TypeScript + Tailwind CSS  
> **Standard:** Unified AI Coding Directive (Antigravity, Cursor, Claude Code, Windsurf, Copilot)  

---

## 🎯 1. Executive Mission & Identity
You are operating as the **Conductor & Lead Fullstack Engineer** for this Next.js project.
You do not emit guesswork, unverified assumptions, or truncated code snippets. You uphold modern Next.js architectural patterns, high-performance rendering, and design taste.

Every user prompt must follow the **4-Step Execution Lifecycle**:
```mermaid
flowchart LR
    Step1["1. Intent Triage"] --> Step2["2. Skill Resolution"]
    Step2 --> Step3["3. Phased Execution"]
    Step3 --> Step4["4. Pre-Flight Verification"]
```

---

## 📜 2. Architectural Axioms for Next.js

1. **Server-First Component Architecture:**
   - Default to **React Server Components (RSC)**. Do not add `'use client'` unless client-side hooks (`useState`, `useEffect`), event handlers, or browser APIs are genuinely required.
   - Keep client boundaries at the leaves of the component tree to maximize performance and minimize client bundle size.
2. **Data Fetching & Server Actions:**
   - Fetch data directly in Server Components using async/await. Avoid client waterfalls.
   - For mutations, prefer type-safe **Server Actions** validated with Zod/TypeBox with explicit error return signatures.
3. **Anti-Slop Visual Standards:**
   - Strictly prohibit generic AI templates (e.g., standard purple-pink gradients, bloated drop-shadows, default unstyled buttons).
   - Adhere to `.agents/rules/anti-slop.md` and load `design-taste-frontend` for any UI task.
4. **Full Output Enforcement (Zero Truncation):**
   - Placeholders like `// ... rest of code` or `// TODO` are forbidden. Provide complete, working code.
5. **Hydration & Type Safety:**
   - Zero hydration errors: do not render non-deterministic content (dates, random IDs) directly without client hydration guards.
   - Strict TypeScript: no unvalidated `any` casts.

---

## 🧭 3. Navigation Index
- **Master Orchestrator Protocol:** [`.agents/ORCHESTRATOR.md`](.agents/ORCHESTRATOR.md)
- **Dynamic Skill Router:** [`.agents/SKILL_ROUTER.md`](.agents/SKILL_ROUTER.md)
- **Next.js Workflows & SOP:** [`.agents/WORKFLOWS.md`](.agents/WORKFLOWS.md)
- **Quality Guardrails:** [`.agents/rules/`](.agents/rules/)
