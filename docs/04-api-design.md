# API design

## Authentication API

## Register user

POST /api/auth/register

# Request
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

# Response
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER"
}

Login

POST /api/auth/login

# Request
{
    "email": "john@example.com",
    "password": "password123"
}

# Response
{
    "token": "jwt-token"
}

Get current user

GET /api/auth/me

# Response
{
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
}

## Project API

Creating a project (Admin only)

POST /api/projects

# Request 
{
    "name": "Entity relationship diagram",
    "description": "A group project, creating a ERD for database model"
}

# Response
{
    "id": 1,
    "name": "Entity relationship diagram",
    "ownerId": 1
}

returns all projects the user is a member of

GET /api/projects

Get project by ID

GET /api/projects/{projectId}

Adding a user to project (Admin)

POST /api/projects/{projectId}/members

# Request
{
    "userId": 2
}

Removing a user from a project

DELETE /api/projects/{projectId}/members/{userId}

## Task API

Create task

POST /api/tasks

# Request
{
    "title": "Implement login",
    "description": "Add JWT authentication",
    "projectId": 1,
    "assigneeIds": [2, 3]
}

# Response
{
    "id": 10,
    "title": "Implement login",
    "status": "TODO"
}

Get task by project

GET /api/projects/{projectId}/tasks

Get task by ID

GET /api/tasks/{taskId}

Updating a task

PUT /api/tasks/{taskId}

# Request
{
    "title": "Implement login (updated)",
    "description": "JWT + Spring Security"
}

Updating status of task

PUT /api/tasks/{taskId}/status

( Only assigned users can update task cycle)
( Has to follow defined lifecycle)

# Response 
{
    "status": "IN_PROGRESS"
}

Assign users to task

POST /api/tasks/{taskId}/assignees

# Request
{
    "userIds": [2, 3]
}

Remove user from task

DELETE /api/tasks/{taskId}/assignees/{userId}
