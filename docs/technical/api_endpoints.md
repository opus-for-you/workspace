# API Endpoints

## Authentication Endpoints

### POST /api/register
Create a new user account.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "username": "string",
  "password": "hashed-password"
}
```

**Errors:**
- 400: Username already exists

---

### POST /api/login
Authenticate a user and create a session.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "username": "string",
  "password": "hashed-password"
}
```

**Errors:**
- 401: Invalid credentials

---

### POST /api/logout
End user session.

**Response (200):**
```
200 OK
```

---

### GET /api/user
Get current authenticated user.

**Response (200):**
```json
{
  "id": "uuid",
  "username": "string",
  "password": "hashed-password"
}
```

**Errors:**
- 401: Not authenticated

---

## Connection Endpoints

### GET /api/connections
Get all connections for the authenticated user.

**Headers:**
- Cookie: session cookie (required)

**Response (200):**
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "name": "string",
    "relationship": "string",
    "lastTouch": "YYYY-MM-DD" | null,
    "notes": "string" | null,
    "createdAt": "ISO timestamp"
  }
]
```

---

### POST /api/connections
Create a new connection.

**Request Body:**
```json
{
  "name": "string",
  "relationship": "string",
  "lastTouch": "YYYY-MM-DD" | null,
  "notes": "string" | null
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "name": "string",
  "relationship": "string",
  "lastTouch": "YYYY-MM-DD" | null,
  "notes": "string" | null,
  "createdAt": "ISO timestamp"
}
```

---

### PATCH /api/connections/:id
Update an existing connection.

**Request Body:**
```json
{
  "name": "string",
  "relationship": "string",
  "lastTouch": "YYYY-MM-DD" | null,
  "notes": "string" | null
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "name": "string",
  "relationship": "string",
  "lastTouch": "YYYY-MM-DD" | null,
  "notes": "string" | null,
  "createdAt": "ISO timestamp"
}
```

**Errors:**
- 404: Connection not found

---

### DELETE /api/connections/:id
Delete a connection.

**Response (204):**
```
204 No Content
```

**Errors:**
- 404: Connection not found

---

## Goal Endpoints

### GET /api/goals
Get all goals for the authenticated user.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "title": "string",
    "description": "string" | null,
    "targetDate": "YYYY-MM-DD" | null,
    "progress": 0-100,
    "createdAt": "ISO timestamp"
  }
]
```

---

### POST /api/goals
Create a new goal.

**Request Body:**
```json
{
  "title": "string",
  "description": "string" | null,
  "targetDate": "YYYY-MM-DD" | null,
  "progress": 0-100
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "title": "string",
  "description": "string" | null,
  "targetDate": "YYYY-MM-DD" | null,
  "progress": 0-100,
  "createdAt": "ISO timestamp"
}
```

---

### PATCH /api/goals/:id
Update an existing goal.

**Request Body:**
```json
{
  "title": "string",
  "description": "string" | null,
  "targetDate": "YYYY-MM-DD" | null,
  "progress": 0-100
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "title": "string",
  "description": "string" | null,
  "targetDate": "YYYY-MM-DD" | null,
  "progress": 0-100,
  "createdAt": "ISO timestamp"
}
```

**Errors:**
- 404: Goal not found

---

### DELETE /api/goals/:id
Delete a goal.

**Response (204):**
```
204 No Content
```

**Errors:**
- 404: Goal not found

---

## Task Endpoints

### GET /api/tasks
Get all tasks for the authenticated user.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "title": "string",
    "description": "string" | null,
    "dueDate": "YYYY-MM-DD" | null,
    "goalId": "uuid" | null,
    "status": "todo" | "in-progress" | "done",
    "createdAt": "ISO timestamp"
  }
]
```

---

### POST /api/tasks
Create a new task.

**Request Body:**
```json
{
  "title": "string",
  "description": "string" | null,
  "dueDate": "YYYY-MM-DD" | null,
  "goalId": "uuid" | null,
  "status": "todo" | "in-progress" | "done"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "title": "string",
  "description": "string" | null,
  "dueDate": "YYYY-MM-DD" | null,
  "goalId": "uuid" | null,
  "status": "todo" | "in-progress" | "done",
  "createdAt": "ISO timestamp"
}
```

---

### PATCH /api/tasks/:id
Update an existing task.

**Request Body:**
```json
{
  "title": "string",
  "description": "string" | null,
  "dueDate": "YYYY-MM-DD" | null,
  "goalId": "uuid" | null,
  "status": "todo" | "in-progress" | "done"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "title": "string",
  "description": "string" | null,
  "dueDate": "YYYY-MM-DD" | null,
  "goalId": "uuid" | null,
  "status": "todo" | "in-progress" | "done",
  "createdAt": "ISO timestamp"
}
```

**Errors:**
- 404: Task not found

---

### DELETE /api/tasks/:id
Delete a task.

**Response (204):**
```
204 No Content
```

**Errors:**
- 404: Task not found

---

## Weekly Review Endpoints

### GET /api/reviews
Get all weekly reviews for the authenticated user.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "weekStart": "YYYY-MM-DD",
    "summary": "string" | null,
    "wins": "string" | null,
    "lessons": "string" | null,
    "nextSteps": "string" | null,
    "createdAt": "ISO timestamp"
  }
]
```

---

### POST /api/reviews
Create a new weekly review.

**Request Body:**
```json
{
  "weekStart": "YYYY-MM-DD",
  "summary": "string" | null,
  "wins": "string" | null,
  "lessons": "string" | null,
  "nextSteps": "string" | null
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "weekStart": "YYYY-MM-DD",
  "summary": "string" | null,
  "wins": "string" | null,
  "lessons": "string" | null,
  "nextSteps": "string" | null,
  "createdAt": "ISO timestamp"
}
```

---

### DELETE /api/reviews/:id
Delete a weekly review.

**Response (204):**
```
204 No Content
```

**Errors:**
- 404: Review not found

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
Invalid request body or validation error.
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
User not authenticated.
```
401 Unauthorized
```

### 404 Not Found
Resource not found.
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
Server error.
```json
{
  "error": "Internal server error"
}
```

---

## Authentication

All endpoints except `/api/register`, `/api/login`, and `/api/logout` require authentication via session cookies. The session cookie is automatically set upon successful login or registration.
