# Thinker MVP — API Design

## 1. Overview

Thinker will expose a REST API for:

* Authentication
* Projects
* Scenarios
* Learning sessions
* User reasoning
* Design submissions
* Implementation attempts
* Evaluations
* Benchmarks
* Hints
* Reflections
* AI mentor conversations
* Execution jobs
* Progress

For the MVP, the API should remain part of the same backend application.

```text
Frontend
   ↓
Thinker REST API
   ↓
Application Services
   ↓
PostgreSQL
   ↓
Execution Queue
   ↓
Sandbox Runner
```

---

# 2. Base URL

```http
/api/v1
```

Example:

```http
GET /api/v1/projects
```

Using `/v1` from the beginning gives us room to evolve the API later without breaking existing clients.

---

# 3. API Style

Thinker will initially use:

```text
REST + JSON
```

Standard response content type:

```http
Content-Type: application/json
```

---

# 4. Authentication

For the first Thinker-controlled-project MVP, authentication can be handled through the main Thinker account system.

Later GitHub OAuth / GitHub App integration can be added.

Authenticated requests should use an HTTP-only session cookie or secure token-based session.

Conceptually:

```text
User
 ↓
Login
 ↓
Thinker Session
 ↓
Authenticated API Requests
```

Most `/api/v1` endpoints require authentication.

Public endpoints should be explicitly marked.

---

# 5. Standard Success Response

For normal object responses:

```json
{
  "data": {
    "id": "uuid",
    "name": "Thinker Product API"
  }
}
```

For collections:

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Thinker Product API"
    }
  ]
}
```

Optional metadata:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 42
  }
}
```

---

# 6. Standard Error Response

All API errors should follow a consistent structure.

```json
{
  "error": {
    "code": "SCENARIO_NOT_FOUND",
    "message": "The requested scenario could not be found.",
    "details": null,
    "requestId": "req_123"
  }
}
```

Validation error:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid data.",
    "details": [
      {
        "field": "learningIntent",
        "message": "learningIntent must be a string."
      }
    ],
    "requestId": "req_123"
  }
}
```

---

# 7. Common HTTP Status Codes

| Status | Meaning                               |
| ------ | ------------------------------------- |
| `200`  | Successful request                    |
| `201`  | Resource created                      |
| `202`  | Async operation accepted              |
| `204`  | Successful request with no body       |
| `400`  | Invalid request                       |
| `401`  | Not authenticated                     |
| `403`  | Not authorized                        |
| `404`  | Resource not found                    |
| `409`  | Resource conflict                     |
| `422`  | Valid request but cannot be processed |
| `429`  | Rate limit exceeded                   |
| `500`  | Internal server error                 |
| `503`  | Temporary service unavailable         |

---

# 8. API Groups

Thinker MVP APIs can be grouped as:

```text
/auth

/me

/projects

/scenarios

/sessions

/challenges

/attempts

/evaluations

/jobs

/progress
```

---

# 9. Authentication APIs

## 9.1 Get Current User

```http
GET /api/v1/me
```

### Response

```json
{
  "data": {
    "id": "user_uuid",
    "username": "priyanshu",
    "email": "user@example.com",
    "avatarUrl": null
  }
}
```

---

## 9.2 Logout

```http
POST /api/v1/auth/logout
```

### Response

```http
204 No Content
```

---

# 10. Projects API

## 10.1 List Available Projects

```http
GET /api/v1/projects
```

Optional query parameters:

```text
status
sourceType
page
limit
```

Example:

```http
GET /api/v1/projects?sourceType=thinker
```

### Response

```json
{
  "data": [
    {
      "id": "project_uuid",
      "slug": "product-api",
      "name": "Thinker Product API",
      "description": "A simple product CRUD backend used for engineering scenarios.",
      "sourceType": "thinker",
      "status": "active"
    }
  ]
}
```

---

# 11. Get Project Details

```http
GET /api/v1/projects/{projectId}
```

### Response

```json
{
  "data": {
    "id": "project_uuid",
    "slug": "product-api",
    "name": "Thinker Product API",
    "description": "Product CRUD backend.",
    "sourceType": "thinker",
    "runtime": {
      "name": "node",
      "version": "22"
    }
  }
}
```

---

# 12. Get Project Scenarios

```http
GET /api/v1/projects/{projectId}/scenarios
```

### Response

```json
{
  "data": [
    {
      "id": "scenario_uuid",
      "slug": "product-read-overload",
      "title": "Product Read Overload",
      "description": "Investigate repeated database reads.",
      "difficulty": "beginner",
      "status": "active"
    }
  ]
}
```

---

# 13. Scenario API

## 13.1 Get Scenario

```http
GET /api/v1/scenarios/{scenarioId}
```

This endpoint should return scenario metadata, not hidden solutions.

### Response

```json
{
  "data": {
    "id": "scenario_uuid",
    "title": "Product Read Overload",
    "description": "Investigate repeated database work.",
    "difficulty": "beginner",
    "learningObjectives": [
      "Identify repeated database reads",
      "Understand caching motivation",
      "Reason about performance trade-offs"
    ]
  }
}
```

Important:

The API should never return hidden challenge answers or evaluation rules to the frontend.

---

# 14. Start Learning Session

```http
POST /api/v1/sessions
```

### Request

```json
{
  "projectId": "project_uuid",
  "scenarioId": "scenario_uuid",
  "learningIntent": "redis"
}
```

### Backend Responsibilities

The backend should:

1. Resolve the active project version.
2. Resolve the published scenario version.
3. Create the learning session.
4. Bind exact project and scenario versions.
5. Set the first stage.
6. Return the session.

### Response

```http
201 Created
```

```json
{
  "data": {
    "id": "session_uuid",
    "projectId": "project_uuid",
    "scenarioId": "scenario_uuid",
    "learningIntent": "redis",
    "status": "in_progress",
    "currentStage": {
      "type": "observe",
      "position": 1
    },
    "startedAt": "2026-09-22T10:00:00Z"
  }
}
```

---

# 15. List User Sessions

```http
GET /api/v1/sessions
```

Optional filters:

```text
status
projectId
scenarioId
```

Example:

```http
GET /api/v1/sessions?status=in_progress
```

### Response

```json
{
  "data": [
    {
      "id": "session_uuid",
      "scenarioTitle": "Product Read Overload",
      "status": "in_progress",
      "currentStage": "design",
      "startedAt": "2026-09-22T10:00:00Z"
    }
  ]
}
```

---

# 16. Get Learning Session

```http
GET /api/v1/sessions/{sessionId}
```

### Response

```json
{
  "data": {
    "id": "session_uuid",
    "status": "in_progress",

    "project": {
      "id": "project_uuid",
      "name": "Thinker Product API"
    },

    "scenario": {
      "id": "scenario_uuid",
      "title": "Product Read Overload"
    },

    "learningIntent": "redis",

    "currentStage": {
      "id": "stage_uuid",
      "type": "hypothesis",
      "title": "Identify the Problem",
      "position": 3
    },

    "startedAt": "2026-09-22T10:00:00Z"
  }
}
```

---

# 17. Get Current Stage

```http
GET /api/v1/sessions/{sessionId}/stage
```

The backend decides what the learner is allowed to see.

### Response

```json
{
  "data": {
    "id": "stage_uuid",
    "type": "observe",
    "title": "Observe the System",
    "position": 1,
    "status": "active",
    "challenges": [
      {
        "id": "challenge_uuid",
        "type": "observation",
        "prompt": "What do you notice about these database queries?",
        "responseType": "text"
      }
    ]
  }
}
```

---

# 18. Baseline Execution

Before reasoning about performance, Thinker may need to run the baseline application.

```http
POST /api/v1/sessions/{sessionId}/baseline-runs
```

### Response

Because execution is asynchronous:

```http
202 Accepted
```

```json
{
  "data": {
    "jobId": "job_uuid",
    "status": "queued"
  }
}
```

---

# 19. Get Baseline Results

```http
GET /api/v1/sessions/{sessionId}/baseline
```

### Response

```json
{
  "data": {
    "status": "completed",
    "metrics": {
      "totalRequests": 1000,
      "uniqueProducts": 43,
      "dbQueryCount": 998,
      "p50LatencyMs": 190,
      "p95LatencyMs": 420
    }
  }
}
```

The frontend can visualize these values.

---

# 20. Submit Challenge Response

```http
POST /api/v1/sessions/{sessionId}/challenges/{challengeId}/responses
```

### Request

```json
{
  "response": "The same products are repeatedly being fetched from PostgreSQL."
}
```

Structured answers may use:

```json
{
  "responseData": {
    "selectedOption": "database_reads"
  }
}
```

### Response

```json
{
  "data": {
    "id": "response_uuid",
    "challengeId": "challenge_uuid",
    "accepted": true,
    "attemptNumber": 1
  }
}
```

Important:

`accepted` should not necessarily mean:

> Your answer is correct.

Sometimes engineering questions have multiple valid answers.

It may simply mean:

> Thinker accepted your reasoning and the mentor can continue from it.

---

# 21. Get Challenge Hints

Hints should be progressive.

Do not return all hints immediately.

## Request Next Hint

```http
POST /api/v1/sessions/{sessionId}/challenges/{challengeId}/hints
```

### Response

```json
{
  "data": {
    "level": 1,
    "content": "Compare the total number of requests with the number of unique product IDs."
  }
}
```

Calling again returns the next allowed hint.

```json
{
  "data": {
    "level": 2,
    "content": "Look closely at repeated database reads."
  }
}
```

The backend records every hint request.

---

# 22. Submit Hypothesis

A hypothesis can technically use the generic response API.

However, because hypotheses are important to Thinker's learning model, exposing an explicit endpoint can make the API clearer.

```http
POST /api/v1/sessions/{sessionId}/hypothesis
```

### Request

```json
{
  "problem": "Repeated reads are putting unnecessary pressure on PostgreSQL.",
  "evidence": "1000 requests produced 998 database queries even though only 43 products were requested.",
  "prediction": "Reducing repeated database reads should improve latency."
}
```

### Response

```http
201 Created
```

```json
{
  "data": {
    "id": "response_uuid",
    "createdAt": "2026-09-22T10:20:00Z"
  }
}
```

---

# 23. Submit Architecture Design

```http
POST /api/v1/sessions/{sessionId}/designs
```

### Request

```json
{
  "explanation": "Check Redis before PostgreSQL. On cache miss, fetch from PostgreSQL and populate Redis.",
  "design": {
    "components": [
      "API",
      "Redis",
      "PostgreSQL"
    ],
    "flow": [
      "API -> Redis",
      "Redis miss -> PostgreSQL",
      "PostgreSQL -> Redis",
      "Redis -> API"
    ]
  }
}
```

### Response

```http
201 Created
```

```json
{
  "data": {
    "id": "design_uuid",
    "version": 1
  }
}
```

If the user submits another design:

```text
version = 2
```

The previous one remains unchanged.

---

# 24. Get Designs

```http
GET /api/v1/sessions/{sessionId}/designs
```

### Response

```json
{
  "data": [
    {
      "id": "design_uuid",
      "version": 1,
      "explanation": "Check Redis before PostgreSQL.",
      "createdAt": "2026-09-22T10:30:00Z"
    }
  ]
}
```

---

# 25. Mentor Conversation

## Get Messages

```http
GET /api/v1/sessions/{sessionId}/mentor/messages
```

### Response

```json
{
  "data": [
    {
      "id": "message_uuid",
      "role": "assistant",
      "content": "What do you notice about the repeated database reads?",
      "createdAt": "2026-09-22T10:15:00Z"
    },
    {
      "id": "message_uuid_2",
      "role": "user",
      "content": "The same records are being queried repeatedly.",
      "createdAt": "2026-09-22T10:16:00Z"
    }
  ]
}
```

---

# 26. Send Mentor Message

```http
POST /api/v1/sessions/{sessionId}/mentor/messages
```

### Request

```json
{
  "content": "Why can't we just query PostgreSQL every time?"
}
```

### Response

```json
{
  "data": {
    "id": "message_uuid",
    "role": "assistant",
    "content": "PostgreSQL can handle many reads. The question is whether those reads are necessary. What does the request pattern tell us?"
  }
}
```

The AI should receive session context from the backend.

The frontend should not send all hidden scenario data directly.

---

# 27. Submit Implementation Attempt

Once the learner finishes coding:

```http
POST /api/v1/sessions/{sessionId}/attempts
```

### MVP Request

For a Thinker workspace:

```json
{
  "sourceType": "workspace",
  "snapshotId": "workspace_snapshot_123"
}
```

Future GitHub version:

```json
{
  "sourceType": "github",
  "commitSha": "b7a23d..."
}
```

### Response

```http
201 Created
```

```json
{
  "data": {
    "id": "attempt_uuid",
    "attemptNumber": 1,
    "status": "submitted"
  }
}
```

---

# 28. List Implementation Attempts

```http
GET /api/v1/sessions/{sessionId}/attempts
```

### Response

```json
{
  "data": [
    {
      "id": "attempt_uuid_1",
      "attemptNumber": 1,
      "status": "evaluated",
      "submittedAt": "2026-09-22T11:00:00Z"
    },
    {
      "id": "attempt_uuid_2",
      "attemptNumber": 2,
      "status": "evaluated",
      "submittedAt": "2026-09-22T11:30:00Z"
    }
  ]
}
```

---

# 29. Start Evaluation

```http
POST /api/v1/attempts/{attemptId}/evaluations
```

### Request

```json
{
  "types": [
    "correctness",
    "performance"
  ]
}
```

### Response

```http
202 Accepted
```

```json
{
  "data": {
    "jobId": "job_uuid",
    "evaluationIds": [
      "evaluation_uuid_1",
      "evaluation_uuid_2"
    ],
    "status": "queued"
  }
}
```

---

# 30. Get Evaluation

```http
GET /api/v1/evaluations/{evaluationId}
```

### Response

```json
{
  "data": {
    "id": "evaluation_uuid",
    "type": "performance",
    "status": "completed",

    "summary": {
      "passed": true
    },

    "metrics": {
      "p95LatencyMs": 104,
      "dbQueryCount": 192,
      "cacheHitRate": 0.808
    }
  }
}
```

---

# 31. Compare Baseline With Implementation

This endpoint is important for Thinker's UX.

```http
GET /api/v1/sessions/{sessionId}/comparisons/{attemptId}
```

### Response

```json
{
  "data": {
    "baseline": {
      "p95LatencyMs": 420,
      "dbQueryCount": 998
    },

    "attempt": {
      "p95LatencyMs": 104,
      "dbQueryCount": 192,
      "cacheHitRate": 0.808
    },

    "difference": {
      "p95LatencyPercent": -75.2,
      "dbQueryCountPercent": -80.7
    }
  }
}
```

This API powers:

```text
Before vs After
```

visualizations.

---

# 32. Evaluation Findings

```http
GET /api/v1/evaluations/{evaluationId}/findings
```

### Response

```json
{
  "data": [
    {
      "id": "finding_uuid",
      "category": "consistency",
      "code": "CACHE_STALE_AFTER_UPDATE",
      "title": "Cached product remains stale after database update.",
      "evidence": {
        "productId": 17,
        "databasePrice": 1200,
        "cachedPrice": 1000
      }
    }
  ]
}
```

This structured evidence can then be used by the mentor.

---

# 33. Run Failure Experiment

Failure experiments should only become available at the correct stage.

```http
POST /api/v1/sessions/{sessionId}/failure-experiments/{experimentId}/runs
```

### Response

```http
202 Accepted
```

```json
{
  "data": {
    "jobId": "job_uuid",
    "status": "queued"
  }
}
```

Example experiment:

```text
Redis outage
```

or:

```text
500 concurrent requests for an uncached product
```

---

# 34. Get Failure Experiment Result

```http
GET /api/v1/sessions/{sessionId}/failure-experiment-runs/{runId}
```

### Response

```json
{
  "data": {
    "status": "completed",

    "experiment": {
      "name": "Redis Outage"
    },

    "result": {
      "requests": 100,
      "successCount": 0,
      "failureCount": 100,
      "http500Count": 100
    },

    "findings": [
      {
        "code": "CACHE_HARD_DEPENDENCY",
        "title": "Redis failure causes the product API to fail."
      }
    ]
  }
}
```

---

# 35. Reflection API

## Submit Reflection

```http
POST /api/v1/sessions/{sessionId}/reflections
```

### Request

```json
{
  "questionKey": "redis_tradeoff",
  "response": "Caching reduced database pressure but introduced stale-data and failure-handling concerns."
}
```

### Response

```http
201 Created
```

---

# 36. Get Reflections

```http
GET /api/v1/sessions/{sessionId}/reflections
```

### Response

```json
{
  "data": [
    {
      "questionKey": "redis_tradeoff",
      "response": "Caching reduced database pressure but introduced stale-data and failure-handling concerns."
    }
  ]
}
```

---

# 37. Advance Session Stage

The frontend should not freely choose any stage.

Instead:

```http
POST /api/v1/sessions/{sessionId}/advance
```

The backend checks whether the learner has completed the required work.

### Possible Request

```json
{}
```

### Response

```json
{
  "data": {
    "previousStage": "design",
    "currentStage": "implement"
  }
}
```

If requirements are not satisfied:

```http
409 Conflict
```

```json
{
  "error": {
    "code": "STAGE_REQUIREMENTS_NOT_MET",
    "message": "Complete the architecture design before moving to implementation."
  }
}
```

This is important.

The frontend should not decide learning progression.

The backend should.

---

# 38. Complete Session

Normally Thinker should complete the session automatically when all required stages are finished.

Internally:

```http
POST /api/v1/sessions/{sessionId}/complete
```

### Response

```json
{
  "data": {
    "id": "session_uuid",
    "status": "completed",
    "completedAt": "2026-09-22T14:00:00Z"
  }
}
```

The backend must validate completion requirements.

---

# 39. Execution Jobs API

Long-running operations should never block regular HTTP requests.

Examples:

```text
npm install
build
tests
benchmark
failure simulation
repository analysis
```

They should become jobs.

---

# 40. Get Job

```http
GET /api/v1/jobs/{jobId}
```

### Running

```json
{
  "data": {
    "id": "job_uuid",
    "type": "benchmark",
    "status": "running",
    "startedAt": "2026-09-22T11:00:00Z"
  }
}
```

### Completed

```json
{
  "data": {
    "id": "job_uuid",
    "type": "benchmark",
    "status": "completed",
    "completedAt": "2026-09-22T11:00:12Z"
  }
}
```

### Failed

```json
{
  "data": {
    "id": "job_uuid",
    "type": "benchmark",
    "status": "failed",
    "error": {
      "code": "APPLICATION_START_FAILED",
      "message": "The application did not pass its health check."
    }
  }
}
```

---

# 41. Job Status Values

```text
queued
running
completed
failed
timeout
cancelled
```

---

# 42. Async Flow

Example benchmark flow:

```text
Frontend

POST /baseline-runs
       │
       ▼
Thinker API
       │
       ├── Create execution_job
       │
       └── Queue job
               │
               ▼
        Sandbox Worker
               │
               ├── Start environment
               ├── Seed DB
               ├── Start API
               ├── Run workload
               ├── Capture metrics
               └── Destroy environment
                       │
                       ▼
                PostgreSQL
                       │
                       ▼
Frontend

GET /jobs/{id}
       │
       ▼
Completed
```

---

# 43. Real-Time Updates

For the first MVP, the frontend can poll:

```http
GET /api/v1/jobs/{jobId}
```

every few seconds.

Later Thinker can introduce:

```text
Server-Sent Events
```

or:

```text
WebSockets
```

for live execution updates.

SSE is likely sufficient because most updates travel:

```text
Server → Client
```

rather than both directions.

---

# 44. Session Events

Later, Thinker may expose:

```http
GET /api/v1/sessions/{sessionId}/events
```

using Server-Sent Events.

Possible events:

```text
baseline.started

baseline.completed

evaluation.started

test.completed

benchmark.completed

failure_experiment.completed

mentor.message
```

This is not required for the first implementation.

---

# 45. Progress API

## User Progress Overview

```http
GET /api/v1/progress
```

### Response

```json
{
  "data": {
    "completedScenarios": 4,
    "activeSessions": 1,

    "skills": [
      {
        "skill": "problem_identification",
        "evidenceCount": 8
      },
      {
        "skill": "failure_reasoning",
        "evidenceCount": 3
      }
    ]
  }
}
```

Avoid immediately converting this to:

```text
Problem Identification = 83%
```

The first version should show evidence.

---

# 46. Scenario Progress

```http
GET /api/v1/sessions/{sessionId}/progress
```

### Response

```json
{
  "data": {
    "currentStage": 5,
    "totalStages": 9,

    "stages": [
      {
        "type": "observe",
        "status": "completed"
      },
      {
        "type": "question",
        "status": "completed"
      },
      {
        "type": "hypothesis",
        "status": "completed"
      },
      {
        "type": "design",
        "status": "completed"
      },
      {
        "type": "implement",
        "status": "active"
      },
      {
        "type": "measure",
        "status": "locked"
      }
    ]
  }
}
```

---

# 47. Internal Admin APIs

Thinker will eventually need APIs for creating curriculum.

These should not be accessible to normal learners.

Possible route namespace:

```text
/api/v1/admin
```

Examples:

```http
POST /api/v1/admin/projects
POST /api/v1/admin/scenarios
POST /api/v1/admin/scenarios/{id}/versions
POST /api/v1/admin/scenario-versions/{id}/stages
POST /api/v1/admin/stages/{id}/challenges
POST /api/v1/admin/challenges/{id}/hints
POST /api/v1/admin/scenario-versions/{id}/failure-experiments
```

For the earliest MVP, scenarios can also be seeded directly into PostgreSQL instead of building an admin UI.

---

# 48. API Authorization Rules

A user should only be able to access their own:

```text
Learning sessions
Responses
Designs
Attempts
Evaluations
Mentor messages
Reflections
Execution jobs
Progress
```

For example:

```http
GET /api/v1/sessions/{sessionId}
```

must validate:

```text
session.user_id === authenticated_user.id
```

Never trust the session ID alone.

---

# 49. Hidden Curriculum Data

Some data must never be exposed directly to the learner.

Examples:

```text
Expected architecture

Hidden test logic

Correct challenge answers

Evaluation thresholds

Failure experiment implementation

Solution code

System prompts

Mentor scoring rules
```

These should remain server-side.

For example:

```text
scenario_versions
         │
         ├── public learning data
         │
         └── private evaluation config
```

The API should return only the public portion.

---

# 50. Idempotency

Certain operations may accidentally be submitted multiple times.

Example:

```text
Start benchmark
Submit implementation
Start evaluation
```

For important write operations, support:

```http
Idempotency-Key: random-unique-id
```

Example:

```http
POST /api/v1/attempts/{attemptId}/evaluations
Idempotency-Key: eval-a7dd21
```

If the client retries because of a network problem, Thinker should not create duplicate evaluation jobs.

---

# 51. Request IDs

Every incoming request should receive a request ID.

Example:

```http
X-Request-ID: req_abc123
```

This should also appear in errors.

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Something went wrong.",
    "requestId": "req_abc123"
  }
}
```

This becomes useful when correlating:

```text
API request
↓
Execution job
↓
Sandbox
↓
Logs
```

---

# 52. Pagination

Collection endpoints should use consistent pagination.

Example:

```http
GET /api/v1/sessions?page=1&limit=20
```

Response:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 75,
    "totalPages": 4
  }
}
```

---

# 53. Main MVP API List

The minimum useful API surface is:

```text
GET    /me

GET    /projects
GET    /projects/{projectId}
GET    /projects/{projectId}/scenarios

GET    /scenarios/{scenarioId}

POST   /sessions
GET    /sessions
GET    /sessions/{sessionId}
GET    /sessions/{sessionId}/stage
GET    /sessions/{sessionId}/progress

POST   /sessions/{sessionId}/baseline-runs
GET    /sessions/{sessionId}/baseline

POST   /sessions/{sessionId}/challenges/{challengeId}/responses
POST   /sessions/{sessionId}/challenges/{challengeId}/hints

POST   /sessions/{sessionId}/hypothesis

POST   /sessions/{sessionId}/designs
GET    /sessions/{sessionId}/designs

GET    /sessions/{sessionId}/mentor/messages
POST   /sessions/{sessionId}/mentor/messages

POST   /sessions/{sessionId}/attempts
GET    /sessions/{sessionId}/attempts

POST   /attempts/{attemptId}/evaluations

GET    /evaluations/{evaluationId}
GET    /evaluations/{evaluationId}/findings

GET    /sessions/{sessionId}/comparisons/{attemptId}

POST   /sessions/{sessionId}/failure-experiments/{experimentId}/runs

POST   /sessions/{sessionId}/reflections
GET    /sessions/{sessionId}/reflections

POST   /sessions/{sessionId}/advance

GET    /jobs/{jobId}

GET    /progress
```

---

# 54. Complete Redis User Flow Through APIs

## Step 1 — Discover Project

```http
GET /api/v1/projects
```

↓

```http
GET /api/v1/projects/{projectId}/scenarios
```

---

## Step 2 — Start Session

```http
POST /api/v1/sessions
```

---

## Step 3 — Run Baseline

```http
POST /api/v1/sessions/{sessionId}/baseline-runs
```

Response:

```text
jobId
```

↓

```http
GET /api/v1/jobs/{jobId}
```

↓

```http
GET /api/v1/sessions/{sessionId}/baseline
```

---

## Step 4 — Observe Problem

```http
GET /api/v1/sessions/{sessionId}/stage
```

Thinker shows:

```text
1000 requests

43 products

998 database queries

p95 = 420 ms
```

---

## Step 5 — User Responds

```http
POST /api/v1/sessions/{sessionId}/challenges/{challengeId}/responses
```

---

## Step 6 — User Submits Hypothesis

```http
POST /api/v1/sessions/{sessionId}/hypothesis
```

---

## Step 7 — User Designs Solution

```http
POST /api/v1/sessions/{sessionId}/designs
```

---

## Step 8 — User Implements

User modifies application code.

---

## Step 9 — Submit Implementation

```http
POST /api/v1/sessions/{sessionId}/attempts
```

---

## Step 10 — Evaluate

```http
POST /api/v1/attempts/{attemptId}/evaluations
```

↓

```http
GET /api/v1/jobs/{jobId}
```

↓

```http
GET /api/v1/evaluations/{evaluationId}
```

---

## Step 11 — Compare

```http
GET /api/v1/sessions/{sessionId}/comparisons/{attemptId}
```

Result:

```text
Before

p95 = 420 ms
DB Queries = 998


After

p95 = 104 ms
DB Queries = 192
Cache Hit Rate = 80.8%
```

---

## Step 12 — Break Solution

```http
POST /api/v1/sessions/{sessionId}/failure-experiments/{experimentId}/runs
```

Thinker disables Redis.

---

## Step 13 — Discover Failure

```text
100 requests

100 failures
```

Thinker asks:

> Redis was introduced as an optimization. Should losing Redis make the entire product API unavailable?

---

## Step 14 — User Fixes Architecture

New implementation:

```http
POST /api/v1/sessions/{sessionId}/attempts
```

---

## Step 15 — Reflection

```http
POST /api/v1/sessions/{sessionId}/reflections
```

---

## Step 16 — Complete Scenario

```http
POST /api/v1/sessions/{sessionId}/advance
```

until:

```text
status = completed
```

---

# 55. High-Level Request Architecture

A normal Thinker API request should flow:

```text
HTTP Request
    ↓
Authentication Middleware
    ↓
Authorization
    ↓
Validation
    ↓
Controller
    ↓
Service
    ↓
Repository
    ↓
PostgreSQL
```

Example:

```text
POST /sessions
        ↓
SessionController
        ↓
SessionService
        ↓
ProjectRepository
ScenarioRepository
SessionRepository
        ↓
PostgreSQL
```

Heavy workloads should branch into the job system:

```text
Controller
    ↓
Service
    ↓
Create Job
    ↓
Queue
    ↓
Worker
    ↓
Sandbox
```

---

# 56. API Design Principle

The frontend should control the **presentation**.

The backend should control the **learning state**.

The frontend should not decide:

```text
Which stage comes next

Whether an implementation passed

Whether a hint is available

Whether the learner can skip ahead

Whether the scenario is complete
```

Those decisions belong to Thinker's backend.

The frontend should mainly ask:

```text
Where is the learner?

What can they do now?

What evidence can they see?

What happened after their action?
```

This protects Thinker's core learning loop and keeps curriculum logic consistent across web clients.
