# Thinker — Product Requirements Document

**Version:** 1.1  
**Date:** 21 September 2026  
**Stage:** MVP  
**Status:** Aligned with Thinker System Design v1.1  
**Product type:** Engineering reasoning and system-design learning platform

---

## 1. Executive Summary

Thinker is a hands-on engineering learning platform for developers who already know how to build basic CRUD applications but want to learn how to reason about real software-engineering problems.

Thinker does **not** primarily teach tools such as Redis, Kafka, queues, indexes, or load balancers. It creates realistic engineering situations in working repositories, exposes measurable evidence, asks the learner to form and defend a hypothesis, lets the learner implement a solution, measures the consequences, deliberately introduces failure conditions, and then guides the learner through trade-off analysis.

The core product outcome is not “the learner knows Redis.” The desired outcome is:

> The learner can identify a problem from evidence, reason about alternatives, implement a change, validate whether it helped, understand how it can fail, and explain the trade-offs they accepted.

The first MVP uses a Thinker-controlled Product API and a Redis caching scenario. Learners sign in with GitHub, work locally in VS Code, push their own code to a GitHub fork, submit an exact commit for evaluation, and receive evidence-first feedback.

---

## 2. Product Vision

In the AI era, producing syntax and boilerplate is increasingly easy. The more durable engineering skill is knowing how to think about a system:

- What is happening?
- Why is it happening?
- What evidence supports that conclusion?
- What assumptions are we making?
- What happens under load?
- What happens when a dependency fails?
- What options are available?
- What are we optimizing for?
- What do we gain and lose by introducing a new component?
- How can we prove the change improved the system?

Thinker exists to train this reasoning habit repeatedly until it becomes natural.

---

## 3. Core Product Philosophy

Thinker follows this sequence:

> **Problem before concept. Concept before syntax. Syntax before implementation. Implementation before measurement. Measurement before trade-off analysis. Evidence before AI interpretation.**

Traditional learning often looks like:

```text
Learn Redis
→ Learn GET/SET
→ Learn caching patterns
→ Maybe use them later
```

Thinker should instead feel like:

```text
Observe a system problem
→ Investigate evidence
→ Form a hypothesis
→ Explore possible approaches
→ Discover caching as one option
→ Learn only the Redis concepts needed
→ Implement the change
→ Measure it
→ Break it
→ Understand the trade-offs
```

Technology is a tool used during the learning journey, not the learning objective itself.

---

## 4. Target User

### 4.1 Primary User

The first Thinker user is a developer who:

- Can build a basic backend CRUD application.
- Understands HTTP requests and common REST operations.
- Has basic familiarity with routes, controllers/handlers, services, and databases.
- Can read and modify an existing codebase.
- Can use Git and a local code editor such as VS Code.
- Wants to move beyond “I can build an API” toward “I can reason about how this API behaves.”

The user does **not** need prior experience with:

- Redis or caching strategies.
- Queues or Kafka.
- Distributed systems.
- Advanced database optimization.
- Failure engineering.
- Production-scale system design.

Experienced engineers may also use Thinker to learn unfamiliar technologies or practice reasoning, but they are not the primary MVP persona.

---

## 5. User Problem

Many developers can build:

```text
Client
  ↓
API
  ↓
Controller
  ↓
Service
  ↓
Database
```

but struggle to answer questions such as:

- Why is this endpoint slow?
- Which part of the request path is doing repeated work?
- Should this response be cached?
- When would Redis be unnecessary?
- What happens if Redis becomes unavailable?
- What happens when cached information becomes stale?
- Should this work happen synchronously or asynchronously?
- What happens when traffic or concurrency increases?
- Which metric should we improve, and why?
- Did our architectural change actually solve the original problem?

Current learning resources often teach technologies independently. A learner may know Redis commands without knowing when a cache is justified. Thinker closes that gap by connecting architecture decisions to observable system behavior.

---

## 6. Product Goals

### 6.1 Primary Goal

Develop the learner's engineering reasoning through real implementation and measurable consequences.

### 6.2 MVP Goals

The MVP must prove that a learner can:

1. Observe a controlled backend system and its evidence.
2. Identify a meaningful engineering problem without being immediately told the solution.
3. Explain a hypothesis before coding.
4. Propose a design and reason about its expected consequences.
5. Implement the solution themselves in a real Git repository.
6. Submit an exact Git commit for deterministic evaluation.
7. Preserve functional correctness.
8. Measure whether the implementation improved the target behavior.
9. Experience at least one failure mode introduced by the new design.
10. Explain the trade-offs after seeing the evidence.
11. Build a persistent record of their reasoning and improvement.

---

## 7. Non-Goals

Thinker MVP is not intended to be:

- An AI code generator.
- A Copilot replacement.
- A browser IDE.
- A video-course platform.
- A LeetCode-style algorithm platform.
- A system-design interview memorization platform.
- A production code-review product.
- A platform that supports every programming language and framework.
- A platform that automatically rewrites architecture or creates implementation PRs.
- A production-grade arbitrary-code sandbox service on day one.

The learner writes the architectural changes. Thinker guides, tests, measures, challenges, and explains.

---

## 8. Product Modes

Thinker has two product modes. Only the first is required for the initial MVP.

### 8.1 Mode A — Thinker Projects (MVP)

Thinker provides controlled repositories with known behavior and intentionally teachable engineering opportunities.

Examples over time may include:

- Product/E-commerce API.
- Notes API.
- Photo-sharing backend.
- URL shortener.
- Food-ordering backend.

Thinker controls:

- Runtime and framework.
- Database schema.
- Seed data.
- Dependencies.
- Tests.
- Workload generator.
- Baseline code version.
- Known scenarios.
- Failure injection.
- Hidden evaluation checks.

This mode is the MVP priority because it validates the learning loop without first solving arbitrary repository analysis.

### 8.2 Mode B — My Repository (Post-MVP)

The learner connects an existing GitHub repository. Thinker eventually:

```text
Connect repository
→ Analyze codebase
→ Build architecture understanding
→ Validate/run application
→ Establish runtime evidence
→ Detect genuine engineering opportunities
→ Generate or select relevant scenarios
```

This mode must reuse the same scenario, learning, evidence, and evaluation concepts as Thinker Projects rather than becoming a separate product.

---

## 9. Authentication and Repository Model

### 9.1 Sign-In

Thinker uses **GitHub sign-in** as the primary authentication experience through Better Auth.

This aligns onboarding with the developer audience.

### 9.2 Identity Is Separate From Repository Permission

Signing in with GitHub proves who the learner is. It does **not** automatically grant Thinker broad repository access.

Repository access is a separate capability.

### 9.3 MVP Repository Workflow

For the first controlled project:

1. The learner signs in with GitHub.
2. Thinker presents a public starter repository.
3. The learner forks it to their GitHub account.
4. The learner binds that public fork URL to the Thinker project.
5. The learner clones the fork locally and works in VS Code.
6. The learner pushes changes to their fork.
7. The learner submits an exact commit SHA for evaluation.
8. Thinker checks out that exact commit and evaluates it.

The initial MVP does not require broad GitHub repository permissions to perform this flow.

### 9.4 Later GitHub App Flow

A later phase adds a GitHub App with least-privilege, selected-repository access for:

- Private repositories.
- Commit discovery.
- Push webhooks.
- Existing user repositories.
- Repository metadata and analysis.

---

## 10. Learning Intent

A user may enter Thinker with a technology or concept they want to understand, for example:

- Redis.
- Kafka.
- Database indexing.
- Queues.
- Caching.
- Load balancing.

Thinker treats this as **learning intent**, not as proof that the technology belongs in the architecture.

Example:

```text
User: “I want to learn Redis.”

Thinker:
“Let’s first investigate a problem where Redis might actually be useful.”
```

Thinker must be allowed to conclude that a selected technology is not justified by the current evidence.

For MVP, the available learning intent is Redis/caching and is mapped to the controlled Product API scenario.

---

## 11. Core Learning Loop

Every scenario should follow the same learning loop:

```text
OBSERVE
  ↓
QUESTION
  ↓
HYPOTHESIS
  ↓
DESIGN
  ↓
IMPLEMENT
  ↓
EVALUATE / MEASURE
  ↓
BREAK
  ↓
TRADE-OFF
  ↓
REFLECT
```

### 11.1 Observe

Thinker presents evidence without immediately naming the solution.

Example:

```text
Requests: 1,000
Unique product IDs: 43
PostgreSQL reads: 998
p95 latency: 420 ms
```

### 11.2 Question

Thinker asks a Socratic question such as:

> We made 1,000 requests but requested only 43 unique products. What work appears to be repeating?

### 11.3 Hypothesis

The learner records what they believe is happening and what evidence supports that conclusion.

### 11.4 Design

Before coding, the learner proposes how the system should change and predicts the consequences.

### 11.5 Implement

The learner edits the repository locally. Thinker does not make the architectural change for them.

### 11.6 Evaluate / Measure

Thinker checks correctness and runs a controlled workload against the submitted commit.

### 11.7 Break

Thinker introduces a controlled failure or stress condition.

Examples:

- Redis unavailable.
- Stale cached data after a product update.
- Concurrent requests for an uncached product.

### 11.8 Trade-Off

The learner explains what improved and what new complexity or failure modes were introduced.

### 11.9 Reflect

The learner records how their mental model changed.

---

## 12. Stage Progression Rules

The experience should be structured enough that the learner cannot skip all reasoning and jump directly to implementation.

For the MVP:

- A hypothesis must be submitted before the design stage completes.
- A design proposal must be submitted before the implementation attempt is evaluated.
- Correctness must be evaluated before performance improvement is treated as valid.
- A scenario is not complete until the required failure/trade-off reflection is finished.
- Hints may reduce difficulty but should not bypass the learner's required reasoning input.

Thinker may allow the learner to revise earlier answers after new evidence appears.

---

## 13. Socratic AI Mentor

The AI mentor should:

- Ask questions.
- Interpret learner explanations.
- Challenge assumptions.
- Reveal relevant evidence gradually.
- Explain concepts when they become necessary.
- Review proposed designs.
- Explain deterministic evaluation results.
- Ask reflection questions.

The AI mentor should not immediately:

- Reveal the intended technology.
- Generate the finished architecture.
- Write the complete implementation.
- Declare a solution correct without deterministic evidence.

### 13.1 AI as Explanation Layer

Tests, benchmarks, and controlled failure checks establish what happened. The AI explains and teaches from that evidence.

### 13.2 AI Availability

The MVP is free-first and uses OpenRouter with a configurable free model. Thinker must continue functioning when the model is rate-limited or temporarily unavailable.

Known questions, hints, and deterministic evaluation results should remain usable without AI.

---

## 14. Hint Ladder

Each challenge supports progressive hints.

| Level | Intent | Example |
|---|---|---|
| 0 | No help | Learner investigates independently. |
| 1 | Observation | “Compare request count with unique product count.” |
| 2 | Problem area | “Look at repeated database reads.” |
| 3 | Conceptual direction | “Could repeated results live temporarily closer to the API?” |
| 4 | Pattern | “Research the cache-aside pattern.” |
| 5 | Implementation direction | “Consider a cache lookup before PostgreSQL and cache population after a miss.” |

Hint usage is part of the learner's progress evidence.

The final hint level may teach syntax or implementation direction, but Thinker should still avoid producing the entire finished solution by default.

---

## 15. Engineering Journal

Thinker captures reasoning before and after implementation.

### Before Implementation

- What do you think the bottleneck is?
- What evidence supports your theory?
- What solution would you try?
- Why?
- What do you predict will improve?
- What new problem could your solution introduce?

### After Evaluation

- What actually changed?
- Was your prediction correct?
- What unexpected behavior appeared?
- What did you gain?
- What complexity did you introduce?
- Under what conditions would you avoid this design?

The journal is used to show growth in reasoning, not merely course completion.

---

## 16. Scenario Model

Thinker's curriculum is built around **Scenarios**, not ordinary lessons.

A scenario is a versioned engineering situation containing:

- Project/runtime version.
- Baseline commit.
- Seed dataset.
- Workload definition.
- Observable evidence.
- Learning stages.
- Deterministic questions.
- Hint ladder.
- Correctness checks.
- Performance checks.
- Failure checks.
- Expected evidence types.
- Skill evidence mapping.
- Completion requirements.

Old learning sessions remain associated with the exact scenario version they experienced.

---

## 17. First MVP Scenario — Product Read Overload

### 17.1 Project

A Thinker-owned Node.js + Express + TypeScript Product API backed by PostgreSQL.

Redis is available in the controlled environment but is not initially used by the application.

### 17.2 Baseline Situation

Example scenario evidence:

```text
GET /products/:id

Requests: 1,000
Unique product IDs: 43
PostgreSQL reads: ~998
p95 latency: scenario baseline
```

### 17.3 Learning Journey

1. Observe repeated PostgreSQL reads.
2. Explain why repeated work may be unnecessary.
3. Design a cache-aside strategy before coding.
4. Learn the Redis operations needed for that implementation.
5. Implement the caching change.
6. Preserve functional correctness.
7. Measure database-read reduction and latency behavior.
8. Update a product and discover stale-cache behavior.
9. Implement appropriate invalidation/freshness handling.
10. Make Redis unavailable and observe system behavior.
11. Reason about graceful degradation and hard dependencies.
12. Optionally introduce concurrent cache misses to demonstrate stampede behavior.
13. Complete trade-off reflection.

### 17.4 Protected Project Files

For the first MVP, Thinker owns and protects dependency and execution configuration such as:

- `package.json` / lockfile.
- Docker definitions.
- Evaluation scripts.
- Hidden tests.

The learner changes application code, not the sandbox or dependency-installation mechanism.

---

## 18. Functional Requirements

### FR-1 — GitHub Authentication

The learner can create/sign into a Thinker account using GitHub through Better Auth.

### FR-2 — Scenario Discovery

The learner can view available scenarios and their learning intent, prerequisites, and expected difficulty.

### FR-3 — Start Learning Session

The learner can start a new learning session for a supported project/scenario version.

### FR-4 — Starter Repository Workflow

Thinker provides the starter repository and instructions for fork, clone, and local development.

### FR-5 — Repository Binding

The learner can bind their public GitHub fork to the Thinker project for the MVP.

### FR-6 — Baseline Evidence

Thinker establishes or loads a versioned baseline using deterministic seed data and a controlled workload.

### FR-7 — Structured Stage State

Thinker tracks the learner's current Observe/Question/Hypothesis/Design/Implement/Evaluate/Break/Trade-off/Reflect stage.

### FR-8 — Reasoning Capture

Thinker persists hypotheses, design proposals, predictions, and reflections.

### FR-9 — Progressive Hints

The learner can request progressively stronger hints, and hint usage is recorded.

### FR-10 — Commit-Based Attempts

The learner can submit an exact commit SHA from the bound repository as an implementation attempt.

### FR-11 — Explicit Evaluation

Evaluation starts only after the learner explicitly requests it. A Git push alone must not automatically consume a full evaluation run in the MVP.

### FR-12 — Correctness Evaluation

Thinker runs deterministic and hidden correctness tests against the submitted commit.

### FR-13 — Benchmark Evaluation

If correctness gates pass, Thinker runs the scenario workload and collects evidence such as query count, latency, throughput, and cache behavior.

### FR-14 — Failure Evaluation

Thinker can run scenario-specific failure checks such as Redis outage and stale cache behavior.

### FR-15 — Evidence-First Feedback

Thinker presents structured evidence before or alongside AI interpretation.

### FR-16 — AI Mentor

The AI mentor can interpret learner input and evaluation evidence while respecting scenario stage and hint level.

### FR-17 — AI Fallback

If AI is unavailable, deterministic questions, hints, stored evidence, and evaluation results remain usable.

### FR-18 — Progress Evidence

Thinker stores evidence such as independent problem identification, hints used, successful design revision, correctness, failure reasoning, and reflection quality.

### FR-19 — Evaluation History

The learner can review previous attempts and their exact commit SHAs, results, and reasoning.

### FR-20 — Safe Failure Classification

Thinker distinguishes learner-code failure from platform/infrastructure failure so the learner is not incorrectly blamed for worker, sandbox, or AI outages.

### FR-21 — Stage-Aware Evaluation

Thinker runs and reveals only the checks appropriate to the learner's current stage. A first cache-aside attempt should not immediately expose later lessons such as cache invalidation, Redis outage resilience, or cache stampede. The scenario progressively unlocks those experiments.

### FR-22 — Same-Commit Experiments

Thinker may run multiple evaluation profiles against the same implementation commit. For example, one commit may first receive a correctness/performance run and later be used in a Redis-outage experiment without requiring an artificial new commit.

---

## 19. Evaluation Principles

Thinker must not reduce evaluation to “the LLM thinks your code looks correct.”

Evaluation combines:

```text
User implementation
    ↓
Submission validation
    ↓
Correctness tests
    ↓
Controlled benchmark
    ↓
Failure checks
    ↓
Structured evidence
    ↓
AI educational interpretation
```

### 19.1 Correctness First

Performance improvements do not count as success if functional behavior is broken.

### 19.2 Reproducibility

Every evaluation is tied to:

- Exact commit SHA.
- Scenario version.
- Baseline version.
- Seed dataset version.
- Workload version.

### 19.3 Anti-Gaming

Hidden tests and variable workload inputs should prevent trivial hard-coded solutions that only satisfy visible examples.

### 19.4 Progressive Evidence Release

Evaluation evidence is part of the teaching experience. Thinker should reveal only the evidence needed for the current stage rather than dumping all future failure modes at once. Scenario configuration determines which checks are active and which results are visible.

---

## 20. Progress Model

Thinker should avoid generic scores such as “System Design: 87%” unless they are backed by concrete evidence.

Progress dimensions may include:

- Problem identification.
- Measurement and evidence use.
- Trade-off reasoning.
- Failure analysis.
- Performance reasoning.
- Consistency reasoning.
- Architecture design.

Example evidence:

```text
Redis Caching

✓ Identified repeated reads without help
✓ Proposed cache-aside before coding
✓ Preserved correctness
✓ Measured database-read reduction
✓ Handled invalidation
△ Needed Level-3 hint for graceful degradation
△ Needed help identifying cache stampede
```

---

## 21. User Experience Requirements

The MVP should combine structured stages with a persistent mentor experience.

Recommended layout:

```text
┌───────────────────────────────────────────────────────────┐
│ Thinker                                                   │
├────────────────────┬──────────────────────────────────────┤
│ Scenario / Stages  │ AI Engineering Mentor               │
│                    │                                      │
│ Observe            │ Socratic discussion                  │
│ Hypothesis         │                                      │
│ Design             │                                      │
│ Implement          │                                      │
│ Evaluate           │                                      │
│ Reflect            │                                      │
├────────────────────┴──────────────────────────────────────┤
│ Evidence: tests | DB queries | latency | cache | failures │
└───────────────────────────────────────────────────────────┘
```

The learner writes code locally in VS Code rather than inside a browser editor.

---

## 22. Security and Privacy Product Requirements

Even in the controlled MVP, Thinker should operate with security boundaries that can evolve safely.

Product requirements include:

- GitHub identity does not imply broad repository permission.
- MVP evaluations accept only a bound Thinker-project fork and exact commit SHA.
- Protected configuration files are validated before execution.
- Source code is checked out only for evaluation and should not be permanently stored in the product database.
- Production secrets are never exposed to the learning sandbox.
- Raw repository content is not sent to the AI provider during the controlled MVP.
- Learner answers and structured evidence sent to an external AI provider should be limited to what the learning interaction requires.
- Evaluation logs should be bounded and sanitized before long-term storage/display.
- Users should be able to disconnect repository bindings and eventually delete their project/account data.

---

## 23. Free-First Product Constraint

The MVP should prefer free/open-source components and free service tiers where practical.

However:

> **Free-first must not mean unsafe-first.**

The product should not weaken sandbox isolation or expose secrets merely to fit a free hosting limitation.

The architecture must also tolerate free AI model rate limits by using deterministic scenario content and graceful fallback.

---

## 24. MVP Success Criteria

The MVP is considered product-valid when a target learner can complete the Redis scenario and demonstrate that they understand:

- Why repeated database reads were a problem.
- Why caching was considered.
- Why Redis was useful in this scenario.
- How cache-aside changes the request path.
- Why TTL/invalidation matter.
- How stale data appears.
- Why Redis failure should not necessarily take down the core API.
- What caching improved.
- What caching made more complex.
- When they would avoid introducing a cache.

Operationally, the product must also prove that it can:

1. Track a learning session end-to-end.
2. Evaluate an exact Git commit reproducibly.
3. Separate platform failures from learner failures.
4. Produce structured before/after evidence.
5. Continue showing deterministic learning content if AI is temporarily unavailable.

---

## 25. Product Metrics

Useful early metrics include:

- Scenario completion rate.
- Time to first meaningful hypothesis.
- Percentage of users identifying the bottleneck without hints.
- Average hint level used by stage.
- Design revisions before successful implementation.
- Correctness pass rate by attempt.
- Performance/evidence improvement when technically valid.
- Failure-scenario recovery rate.
- Reflection completion rate.
- Return rate for the next scenario.
- Reduction in hints required across later scenarios.

These metrics should measure learning behavior, not merely time spent in the application.

---

## 26. MVP Scope

### Included

- React + Vite frontend.
- Node.js + Express + TypeScript backend.
- PostgreSQL control-plane database.
- Better Auth with GitHub sign-in.
- Thinker-controlled Product API starter project.
- Public fork + local VS Code workflow.
- Exact commit-SHA attempts.
- Redis caching scenario.
- Correctness tests and hidden checks.
- Controlled benchmark/evidence collection.
- Redis invalidation/failure checks.
- Progressive hints.
- Engineering journal.
- OpenRouter AI provider abstraction using a free model when available.
- Evidence-based progress history.

### Not Included in First MVP

- Arbitrary private user repositories.
- GitHub App automation as a hard dependency.
- Multi-language code analysis.
- Browser IDE.
- Automated code generation or PR creation.
- Production-grade untrusted-code multi-tenancy.
- Kubernetes or distributed sandbox scheduler.
- Billing/subscriptions.

---

## 27. Post-MVP Expansion Areas

### Performance

- Database indexing.
- Query optimization.
- Pagination.
- Batching.
- Advanced caching.

### Asynchronous Processing

- Background jobs.
- Queues.
- Kafka/RabbitMQ/SQS concepts.
- Delivery semantics.
- Idempotency.

### Reliability

- Timeout.
- Retry.
- Exponential backoff.
- Circuit breaker.
- Graceful degradation.

### Data and Distributed Systems

- Replication.
- Read replicas.
- Partitioning.
- Sharding.
- Eventual consistency.
- Distributed locking.

### Scale

- Horizontal scaling.
- Load balancing.
- Stateless services.
- Connection pools.

### Observability

- Structured logging.
- Metrics.
- Tracing.
- Alerts.

---

## 28. Core Product Statement

> **Thinker does not teach developers what technology to use. It teaches them how to discover whether they need it, why they need it, how to validate it, how it can fail, and what they sacrifice by introducing it.**

This statement should guide product design, AI behavior, scenario design, evaluation, UX, and future architecture.
