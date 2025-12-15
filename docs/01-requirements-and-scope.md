## Users

### Regular Users
- Can register and log in to the system
- Can view projects they are a member of
- Can create, view, and update tasks within assigned projects
- Can update the status of tasks they are assigned to

### Project Admins
- Have all regular user permissions
- Can create and manage projects
- Can add or remove users from projects
- Can assign tasks to project members
- Can modify or delete projects they own

---

## MVP Features (V1)

The minimum viable product focuses on core task management functionality
and secure access control.

- **User Authentication**
  - User registration and login
  - JWT-based authentication
  - Role-based authorization

- **Project Management**
  - Create and view projects
  - Assign users to projects
  - Restrict project access to members only

- **Task Management**
  - Create, update, and delete tasks
  - Assign tasks to users
  - Track task progression through defined statuses
    (e.g. TODO => IN_PROGRESS => DONE)

- **Task Progression**
  - Tasks have a clearly defined lifecycle
  - Status changes are validated based on user permissions

---

## Out of Scope

The following features are intentionally excluded from the MVP and will be
considered in later phases of development:

- Kanban board with drag-and-drop interaction
- Real-time task updates using WebSockets
- File attachments for tasks
- Email notifications
- Activity timeline and audit logging