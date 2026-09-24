# Thinker MVP — Database Design

## 1. Database Choice

**Primary Database:** PostgreSQL

PostgreSQL will store:

* Users
* Projects
* Project versions
* Scenarios
* Scenario versions
* Learning sessions
* User reasoning
* Design submissions
* Implementation attempts
* Evaluations
* Metrics
* Hint usage
* Reflections
* AI mentor conversations
* Execution metadata

Large artifacts should not be stored directly inside PostgreSQL.

Examples:

* Repository snapshots
* Benchmark logs
* Sandbox logs
* Large execution traces
* Generated reports

These should eventually be stored in object storage.

```text
PostgreSQL
    ↓
Metadata
Relationships
Learning state
Evaluation results

Object Storage
    ↓
Logs
Repository snapshots
Benchmark traces
Execution artifacts
```

---

# 2. Core Database Philosophy

Thinker is not a traditional course platform.

A normal learning platform might store:

```text
User
 ↓
Course
 ↓
Lesson
 ↓
Completed = true
```

Thinker needs to preserve the entire engineering reasoning process:

```text
User
 ↓
Scenario
 ↓
Observation
 ↓
Hypothesis
 ↓
Design
 ↓
Implementation
 ↓
Evaluation
 ↓
Failure
 ↓
Revision
 ↓
Reflection
```

This reasoning history is one of the most important parts of the product.

---

# 3. Main Entity Relationship

```text
User
 │
 │ 1:N
 ▼
LearningSession
 │
 ├───────────────┐
 │               │
 ▼               ▼
SessionResponse  MentorMessage
 │
 ▼
DesignSubmission
 │
 ▼
ImplementationAttempt
 │
 ▼
EvaluationRun
 │
 ├───────────────┬────────────────┐
 ▼               ▼                ▼
TestResult     MetricRun     EvaluationFinding
                  │
                  ▼
              MetricValue
```

Curriculum side:

```text
Project
 │
 ├──────────────► ProjectVersion
 │
 ▼
Scenario
 │
 ▼
ScenarioVersion
 │
 ▼
ScenarioStage
 │
 ▼
Challenge
 │
 ▼
Hint
```

The most important relationship is:

```text
LearningSession
      │
      ├── ProjectVersion
      │
      └── ScenarioVersion
```

This allows old learning sessions to remain reproducible even if Thinker updates a project or scenario later.

---

# 4. General Database Rules

Use:

* UUID for primary keys
* `TIMESTAMPTZ` for timestamps
* Foreign keys for important relationships
* `JSONB` for flexible scenario configuration
* Immutable historical attempts
* Immutable published scenario versions

Avoid overwriting historical learner data.

For example:

```text
Attempt 1
↓
Attempt 2
↓
Attempt 3
```

Do not update Attempt 1 into Attempt 2.

Store all three.

---

# 5. Users

## Table

```text
users
```

## Purpose

Stores Thinker users.

## Fields

| Column           | Type        | Description      |
| ---------------- | ----------- | ---------------- |
| `id`             | UUID PK     | Internal user ID |
| `github_user_id` | BIGINT NULL | GitHub user ID   |
| `username`       | TEXT        | Display username |
| `email`          | TEXT NULL   | Email            |
| `avatar_url`     | TEXT NULL   | Profile image    |
| `created_at`     | TIMESTAMPTZ | Created time     |
| `updated_at`     | TIMESTAMPTZ | Updated time     |

## Important Constraint

```sql
UNIQUE(github_user_id)
```

GitHub username should not be used as the permanent identifier because usernames can change.

---

# 6. Projects

## Table

```text
projects
```

## Purpose

Represents an application that can be used inside Thinker.

Examples:

* Thinker Product API
* Thinker Notes App
* User GitHub repository

## Fields

| Column        | Type        | Description                   |
| ------------- | ----------- | ----------------------------- |
| `id`          | UUID PK     | Project ID                    |
| `slug`        | TEXT UNIQUE | URL-friendly identifier       |
| `name`        | TEXT        | Project name                  |
| `description` | TEXT        | Description                   |
| `source_type` | TEXT        | `thinker` or `github`         |
| `status`      | TEXT        | `draft`, `active`, `archived` |
| `created_at`  | TIMESTAMPTZ |                               |
| `updated_at`  | TIMESTAMPTZ |                               |

Example:

```text
name = Thinker Product API

source_type = thinker
```

A project can have multiple versions.

---

# 7. Project Versions

## Table

```text
project_versions
```

## Purpose

Represents an exact runnable version of a project.

Example:

```text
Product API
Version 1
Commit: 93acd742...
```

## Fields

| Column            | Type        | Description             |
| ----------------- | ----------- | ----------------------- |
| `id`              | UUID PK     |                         |
| `project_id`      | UUID FK     | References project      |
| `version`         | INTEGER     | Version number          |
| `commit_sha`      | TEXT        | Exact repository commit |
| `runtime`         | TEXT        | Example: `node`         |
| `runtime_version` | TEXT        | Example: `22`           |
| `configuration`   | JSONB       | Runtime configuration   |
| `created_at`      | TIMESTAMPTZ |                         |

## Constraint

```sql
UNIQUE(project_id, version)
```

Example configuration:

```json
{
  "installCommand": "npm ci",
  "startCommand": "npm start",
  "testCommand": "npm test",
  "seedCommand": "npm run seed",
  "healthcheck": "/health"
}
```

---

# 8. Scenarios

## Table

```text
scenarios
```

## Purpose

Represents an engineering problem.

A Scenario should describe the **problem**, not the technology.

Good:

```text
Product Read Overload
```

Avoid:

```text
Redis Lesson 1
```

## Fields

| Column        | Type        |
| ------------- | ----------- |
| `id`          | UUID PK     |
| `project_id`  | UUID FK     |
| `slug`        | TEXT        |
| `title`       | TEXT        |
| `description` | TEXT        |
| `difficulty`  | TEXT        |
| `status`      | TEXT        |
| `created_at`  | TIMESTAMPTZ |
| `updated_at`  | TIMESTAMPTZ |

Example:

```text
Title:
Product Read Overload

Description:
Repeated product requests create unnecessary
database pressure.
```

---

# 9. Scenario Versions

## Table

```text
scenario_versions
```

## Purpose

Allows Thinker to improve scenarios without breaking existing learner sessions.

For example:

```text
Scenario
   │
   ├── Version 1
   │
   └── Version 2
```

Suppose version 1 uses:

```text
1,000 requests
```

Later Thinker changes it to:

```text
5,000 requests
```

Do not modify version 1.

Create version 2.

## Fields

| Column                | Type             |
| --------------------- | ---------------- |
| `id`                  | UUID PK          |
| `scenario_id`         | UUID FK          |
| `project_version_id`  | UUID FK          |
| `version`             | INTEGER          |
| `baseline_config`     | JSONB            |
| `workload_config`     | JSONB            |
| `learning_objectives` | JSONB            |
| `published_at`        | TIMESTAMPTZ NULL |
| `created_at`          | TIMESTAMPTZ      |

Example workload:

```json
{
  "endpoint": "/products/:id",
  "totalRequests": 1000,
  "concurrency": 50,
  "uniqueProductIds": 43,
  "distribution": "weighted"
}
```

---

# 10. Scenario Stages

## Table

```text
scenario_stages
```

## Purpose

Stores the stages of the Thinker learning loop.

```text
Observe
 ↓
Question
 ↓
Hypothesis
 ↓
Design
 ↓
Implement
 ↓
Measure
 ↓
Break
 ↓
Trade-Off
 ↓
Reflect
```

## Fields

| Column                | Type        |
| --------------------- | ----------- |
| `id`                  | UUID PK     |
| `scenario_version_id` | UUID FK     |
| `stage_type`          | TEXT        |
| `title`               | TEXT        |
| `position`            | INTEGER     |
| `configuration`       | JSONB       |
| `created_at`          | TIMESTAMPTZ |

Example:

```text
stage_type = observe
position = 1
```

Constraint:

```sql
UNIQUE(scenario_version_id, position)
```

---

# 11. Challenges

## Table

```text
challenges
```

## Purpose

Stores questions or tasks inside a scenario stage.

Example:

```text
We sent 1,000 requests,
but only 43 unique products were requested.

What do you notice?
```

## Fields

| Column              | Type        |
| ------------------- | ----------- |
| `id`                | UUID PK     |
| `stage_id`          | UUID FK     |
| `challenge_type`    | TEXT        |
| `prompt`            | TEXT        |
| `response_type`     | TEXT        |
| `evaluation_config` | JSONB       |
| `position`          | INTEGER     |
| `created_at`        | TIMESTAMPTZ |

Possible response types:

```text
text
multiple_choice
architecture
prediction
implementation
reflection
```

---

# 12. Hints

## Table

```text
hints
```

## Purpose

Stores progressive hints.

## Fields

| Column         | Type        |
| -------------- | ----------- |
| `id`           | UUID PK     |
| `challenge_id` | UUID FK     |
| `hint_level`   | INTEGER     |
| `content`      | TEXT        |
| `created_at`   | TIMESTAMPTZ |

Example:

```text
Level 1

Compare the total number of requests
with the number of unique products.
```

```text
Level 2

Look at repeated database reads.
```

```text
Level 3

Could some repeated results temporarily
live outside PostgreSQL?
```

Constraint:

```sql
UNIQUE(challenge_id, hint_level)
```

---

# 13. Learning Sessions

## Table

```text
learning_sessions
```

## Purpose

Represents one learner working through one engineering scenario.

This becomes one of Thinker's most important tables.

## Fields

| Column                | Type             |
| --------------------- | ---------------- |
| `id`                  | UUID PK          |
| `user_id`             | UUID FK          |
| `project_id`          | UUID FK          |
| `project_version_id`  | UUID FK          |
| `scenario_id`         | UUID FK          |
| `scenario_version_id` | UUID FK          |
| `learning_intent`     | TEXT NULL        |
| `status`              | TEXT             |
| `current_stage_id`    | UUID NULL        |
| `started_at`          | TIMESTAMPTZ      |
| `completed_at`        | TIMESTAMPTZ NULL |
| `updated_at`          | TIMESTAMPTZ      |

Example:

```text
Project:
Thinker Product API

Scenario:
Product Read Overload

Learning Intent:
Redis

Status:
in_progress
```

Possible status values:

```text
not_started
in_progress
completed
abandoned
```

---

# 14. Session Responses

## Table

```text
session_responses
```

## Purpose

Stores learner answers to Thinker questions.

## Fields

| Column           | Type        |
| ---------------- | ----------- |
| `id`             | UUID PK     |
| `session_id`     | UUID FK     |
| `challenge_id`   | UUID FK     |
| `response_text`  | TEXT NULL   |
| `response_data`  | JSONB NULL  |
| `attempt_number` | INTEGER     |
| `created_at`     | TIMESTAMPTZ |

Example:

```text
Challenge:

What do you think the bottleneck is?
```

User response:

```text
The same products are repeatedly
being fetched from PostgreSQL.
```

For structured architecture answers:

```json
{
  "components": [
    "API",
    "Redis",
    "PostgreSQL"
  ],
  "flow": [
    "API -> Redis",
    "Redis miss -> PostgreSQL",
    "PostgreSQL -> Redis"
  ]
}
```

---

# 15. Design Submissions

## Table

```text
design_submissions
```

## Purpose

Stores the learner's proposed architecture before implementation.

## Fields

| Column        | Type        |
| ------------- | ----------- |
| `id`          | UUID PK     |
| `session_id`  | UUID FK     |
| `version`     | INTEGER     |
| `explanation` | TEXT        |
| `design_data` | JSONB       |
| `created_at`  | TIMESTAMPTZ |

Example:

```text
Design v1
↓
AI asks questions
↓
User improves design
↓
Design v2
```

Never overwrite previous design versions.

---

# 16. Implementation Attempts

## Table

```text
implementation_attempts
```

## Purpose

Stores every learner implementation attempt.

## Fields

| Column           | Type             |
| ---------------- | ---------------- |
| `id`             | UUID PK          |
| `session_id`     | UUID FK          |
| `attempt_number` | INTEGER          |
| `source_type`    | TEXT             |
| `commit_sha`     | TEXT NULL        |
| `snapshot_uri`   | TEXT NULL        |
| `status`         | TEXT             |
| `submitted_at`   | TIMESTAMPTZ      |
| `completed_at`   | TIMESTAMPTZ NULL |

Possible source types:

```text
workspace
github
```

Example:

```text
Attempt 1

Caching works
Invalidation broken
```

```text
Attempt 2

Cache invalidation fixed
```

```text
Attempt 3

Redis failure fallback implemented
```

Constraint:

```sql
UNIQUE(session_id, attempt_number)
```

---

# 17. Evaluation Runs

## Table

```text
evaluation_runs
```

## Purpose

Represents an evaluation performed against a baseline or implementation.

## Fields

| Column                      | Type             |
| --------------------------- | ---------------- |
| `id`                        | UUID PK          |
| `session_id`                | UUID FK          |
| `implementation_attempt_id` | UUID FK NULL     |
| `evaluation_type`           | TEXT             |
| `status`                    | TEXT             |
| `evaluator_version`         | TEXT             |
| `started_at`                | TIMESTAMPTZ      |
| `completed_at`              | TIMESTAMPTZ NULL |
| `summary`                   | JSONB            |

Possible evaluation types:

```text
baseline
correctness
performance
failure
architecture
```

`implementation_attempt_id` can be `NULL` for baseline evaluation.

---

# 18. Test Results

## Table

```text
test_results
```

## Purpose

Stores deterministic test results.

## Fields

| Column              | Type        |
| ------------------- | ----------- |
| `id`                | UUID PK     |
| `evaluation_run_id` | UUID FK     |
| `suite_name`        | TEXT        |
| `test_name`         | TEXT        |
| `status`            | TEXT        |
| `duration_ms`       | INTEGER     |
| `details`           | JSONB       |
| `created_at`        | TIMESTAMPTZ |

Example:

```text
✓ GET /products/:id works

✓ Missing product returns 404

✗ Updating product invalidates cached result
```

---

# 19. Metric Runs

## Table

```text
metric_runs
```

## Purpose

Represents one benchmark or performance measurement run.

## Fields

| Column              | Type        |
| ------------------- | ----------- |
| `id`                | UUID PK     |
| `evaluation_run_id` | UUID FK     |
| `workload_name`     | TEXT        |
| `started_at`        | TIMESTAMPTZ |
| `completed_at`      | TIMESTAMPTZ |
| `metadata`          | JSONB       |

---

# 20. Metric Values

## Table

```text
metric_values
```

## Purpose

Stores individual metrics so Thinker can query and compare them later.

## Fields

| Column          | Type             |
| --------------- | ---------------- |
| `id`            | UUID PK          |
| `metric_run_id` | UUID FK          |
| `metric_name`   | TEXT             |
| `value`         | DOUBLE PRECISION |
| `unit`          | TEXT             |
| `labels`        | JSONB            |

Example:

| Metric             | Value | Unit    |
| ------------------ | ----: | ------- |
| `http.p95_latency` |   420 | ms      |
| `http.p50_latency` |   190 | ms      |
| `db.query_count`   |   998 | count   |
| `cache.hit_rate`   |  0.81 | ratio   |
| `cpu.avg`          |    42 | percent |
| `memory.max`       |   350 | MB      |

This allows Thinker to compare:

```text
Before
vs
After
```

without parsing large JSON documents.

---

# 21. Evaluation Findings

## Table

```text
evaluation_findings
```

## Purpose

Stores important engineering problems discovered by deterministic evaluation.

## Fields

| Column              | Type        |
| ------------------- | ----------- |
| `id`                | UUID PK     |
| `evaluation_run_id` | UUID FK     |
| `category`          | TEXT        |
| `finding_code`      | TEXT        |
| `title`             | TEXT        |
| `explanation`       | TEXT        |
| `evidence`          | JSONB       |
| `created_at`        | TIMESTAMPTZ |

Example:

```text
category:
consistency

finding_code:
CACHE_STALE_AFTER_UPDATE
```

Evidence:

```json
{
  "databasePrice": 1200,
  "cachedPrice": 1000,
  "endpoint": "/products/17"
}
```

The AI mentor should receive these structured findings instead of simply guessing from source code.

---

# 22. Failure Experiments

## Table

```text
failure_experiments
```

## Purpose

Stores predefined failure scenarios.

## Fields

| Column                | Type    |
| --------------------- | ------- |
| `id`                  | UUID PK |
| `scenario_version_id` | UUID FK |
| `slug`                | TEXT    |
| `name`                | TEXT    |
| `fault_type`          | TEXT    |
| `configuration`       | JSONB   |
| `position`            | INTEGER |

Example Redis outage:

```json
{
  "action": "stop_service",
  "service": "redis",
  "durationSeconds": 30
}
```

Example cache stampede workload:

```json
{
  "action": "concurrent_requests",
  "requests": 500,
  "resource": "/products/17"
}
```

---

# 23. Hint Usage

## Table

```text
hint_usage
```

## Purpose

Tracks how much assistance the learner needed.

## Fields

| Column         | Type        |
| -------------- | ----------- |
| `id`           | UUID PK     |
| `session_id`   | UUID FK     |
| `challenge_id` | UUID FK     |
| `hint_id`      | UUID FK     |
| `opened_at`    | TIMESTAMPTZ |

Example learning evidence:

```text
Scenario 1

Needed Hint Level 4
```

Later:

```text
Scenario 5

Solved without hints
```

This is more valuable than simply storing:

```text
completed = true
```

---

# 24. Reflections

## Table

```text
reflections
```

## Purpose

Stores learner reflections after completing parts of the scenario.

## Fields

| Column            | Type        |
| ----------------- | ----------- |
| `id`              | UUID PK     |
| `session_id`      | UUID FK     |
| `reflection_type` | TEXT        |
| `question_key`    | TEXT        |
| `response`        | TEXT        |
| `created_at`      | TIMESTAMPTZ |

Example:

```text
question_key:
when_not_to_use_cache
```

Response:

```text
I wouldn't add caching when data changes constantly
and PostgreSQL is already handling the traffic easily.
```

---

# 25. Skills

This can be added slightly after the first MVP.

## Table

```text
skills
```

Possible records:

```text
problem_identification
measurement
performance_reasoning
failure_reasoning
consistency_reasoning
tradeoff_reasoning
architecture_design
```

## Fields

| Column        | Type        |
| ------------- | ----------- |
| `id`          | UUID PK     |
| `slug`        | TEXT UNIQUE |
| `name`        | TEXT        |
| `description` | TEXT        |

---

# 26. Skill Evidence

## Table

```text
skill_evidence
```

Instead of:

```text
System Design Skill = 87%
```

Thinker stores real evidence.

## Fields

| Column              | Type        |
| ------------------- | ----------- |
| `id`                | UUID PK     |
| `user_id`           | UUID FK     |
| `session_id`        | UUID FK     |
| `skill_id`          | UUID FK     |
| `evidence_type`     | TEXT        |
| `evidence_ref_type` | TEXT        |
| `evidence_ref_id`   | UUID NULL   |
| `notes`             | TEXT        |
| `created_at`        | TIMESTAMPTZ |

Example evidence types:

```text
identified_without_hint
identified_with_hint
predicted_correctly
implemented_successfully
failure_detected
tradeoff_explained
```

---

# 27. Mentor Messages

## Table

```text
mentor_messages
```

## Purpose

Stores conversations between the learner and Thinker's AI mentor.

## Fields

| Column           | Type        |
| ---------------- | ----------- |
| `id`             | UUID PK     |
| `session_id`     | UUID FK     |
| `stage_id`       | UUID NULL   |
| `role`           | TEXT        |
| `content`        | TEXT        |
| `model`          | TEXT NULL   |
| `prompt_version` | TEXT NULL   |
| `evidence_refs`  | JSONB       |
| `created_at`     | TIMESTAMPTZ |

Example:

```json
{
  "evaluationFindingIds": [
    "finding-id"
  ],
  "metricRunIds": [
    "metric-run-id"
  ]
}
```

This provides traceability.

```text
AI says:

"Your cache invalidation is broken."

Why?

↓

Evaluation Finding:
CACHE_STALE_AFTER_UPDATE
```

---

# 28. Execution Jobs

## Table

```text
execution_jobs
```

## Purpose

Represents asynchronous execution jobs.

Examples:

```text
build
start
seed
test
benchmark
failure_test
```

## Fields

| Column                      | Type             |
| --------------------------- | ---------------- |
| `id`                        | UUID PK          |
| `session_id`                | UUID FK NULL     |
| `implementation_attempt_id` | UUID FK NULL     |
| `job_type`                  | TEXT             |
| `status`                    | TEXT             |
| `sandbox_id`                | TEXT NULL        |
| `queued_at`                 | TIMESTAMPTZ      |
| `started_at`                | TIMESTAMPTZ NULL |
| `completed_at`              | TIMESTAMPTZ NULL |
| `timeout_ms`                | INTEGER          |
| `exit_code`                 | INTEGER NULL     |
| `logs_uri`                  | TEXT NULL        |
| `artifacts_uri`             | TEXT NULL        |
| `error`                     | JSONB NULL       |

Possible statuses:

```text
queued
running
completed
failed
timeout
cancelled
```

---

# 29. Sandbox Runs

Can be introduced when sandbox infrastructure becomes more advanced.

## Table

```text
sandbox_runs
```

## Fields

| Column             | Type             |
| ------------------ | ---------------- |
| `id`               | UUID PK          |
| `execution_job_id` | UUID FK          |
| `image_digest`     | TEXT             |
| `cpu_limit`        | DOUBLE PRECISION |
| `memory_limit_mb`  | INTEGER          |
| `network_policy`   | TEXT             |
| `started_at`       | TIMESTAMPTZ      |
| `destroyed_at`     | TIMESTAMPTZ NULL |

This helps reproduce execution problems.

---

# 30. Final Database Relationship

```text
users
  │
  └── learning_sessions
        │
        ├── session_responses
        │
        ├── design_submissions
        │
        ├── hint_usage
        │
        ├── reflections
        │
        ├── mentor_messages
        │
        └── implementation_attempts
               │
               └── evaluation_runs
                      │
                      ├── test_results
                      │
                      ├── evaluation_findings
                      │
                      └── metric_runs
                             │
                             └── metric_values
```

Curriculum:

```text
projects
  │
  ├── project_versions
  │
  └── scenarios
         │
         └── scenario_versions
                │
                ├── scenario_stages
                │      │
                │      └── challenges
                │             │
                │             └── hints
                │
                └── failure_experiments
```

---

# 31. Recommended MVP Tables

We do not need every future table immediately.

For Thinker MVP, start with:

## Identity

```text
users
```

## Projects

```text
projects
project_versions
```

## Curriculum

```text
scenarios
scenario_versions
scenario_stages
challenges
hints
failure_experiments
```

## Learning

```text
learning_sessions
session_responses
design_submissions
hint_usage
reflections
```

## Implementation

```text
implementation_attempts
```

## Evaluation

```text
evaluation_runs
test_results
evaluation_findings
```

## Metrics

```text
metric_runs
metric_values
```

## Runtime

```text
execution_jobs
```

## AI

```text
mentor_messages
```

Later add:

```text
skills
skill_evidence
sandbox_runs
github_installations
github_repositories
```

---

# 32. Example Complete Redis Learning Session

```text
USER
 │
 ▼
LEARNING SESSION
Product Read Overload
 │
 ▼
SCENARIO VERSION v1
 │
 ▼
BASELINE EVALUATION
 │
 ├── p95 = 420ms
 ├── DB queries = 998
 └── Unique products = 43
 │
 ▼
USER HYPOTHESIS

"The same products are repeatedly
being fetched from PostgreSQL."
 │
 ▼
DESIGN SUBMISSION v1

API
 ↓
Redis
 ↓
PostgreSQL
 │
 ▼
IMPLEMENTATION ATTEMPT #1
 │
 ▼
EVALUATION

Correctness ✓
Performance ✓
Invalidation ✗
 │
 ▼
FINDING

CACHE_STALE_AFTER_UPDATE
 │
 ▼
AI QUESTION

"What happens when PostgreSQL changes
while Redis still contains the old product?"
 │
 ▼
IMPLEMENTATION ATTEMPT #2
 │
 ▼
INVALIDATION TEST ✓
 │
 ▼
REDIS FAILURE EXPERIMENT
 │
 ▼
APPLICATION FAILURE DETECTED
 │
 ▼
IMPLEMENTATION ATTEMPT #3
 │
 ▼
GRACEFUL FALLBACK ✓
 │
 ▼
FINAL REFLECTION
```

---

# 33. Most Important Design Decision

The core Thinker relationship should not be:

```text
User
 ↓
Course
 ↓
Lesson
 ↓
Completed
```

It should be:

```text
User
 ↓
Engineering Scenario
 ↓
Reasoning
 ↓
Design
 ↓
Implementation
 ↓
Evidence
 ↓
Failure
 ↓
Revision
 ↓
Reflection
```

The database should preserve the entire journey.

That historical reasoning data will eventually allow Thinker to answer a much more meaningful question than:

> Did the user finish the Redis lesson?

It can answer:

> How has this developer's engineering reasoning improved over time?
