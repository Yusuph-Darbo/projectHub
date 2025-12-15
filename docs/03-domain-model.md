## User

A registered user of the system.

### Fields
- **id**  
  Unique identifier for the user

- **name**  
  Display name of the user

- **email**  
  Unique email address used for authentication

- **password**  
  Hashed password stored securely

- **role**  
  User role within the system  
  (e.g. USER, ADMIN)

- **createdAt**  
  Timestamp of account creation

### Relationships
- A user can be a member of multiple projects
- A user can be assigned to multiple tasks
- A user (Admin) can own multiple projects

---

## Project

Represents a collaborative workspace that groups related tasks.

### Fields
- **id**  
  Unique identifier for the project

- **name**  
  Project name

- **description**  
  Optional project description

- **owner**  
  The user who created and manages the project

- **createdAt**  
  Timestamp of project creation

### Relationships
- A project is owned by one user
- A project can have multiple members (users)
- A project can contain multiple tasks

---

## Task

Represents a unit of work within a project.

### Fields
- **id**  
  Unique identifier for the task

- **title**  
  Short summary of the task

- **description**  
  Detailed explanation of the task

- **status**  
  Current state of the task  
  (TODO, IN_PROGRESS, DONE)

- **project**  
  The project this task belongs to

- **createdAt**  
  Timestamp of task creation

- **updatedAt**  
  Timestamp of last update

### Relationships
- A task belongs to exactly one project
- A task can be assigned to one or more users
