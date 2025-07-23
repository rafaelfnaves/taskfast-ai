erDiagram
    Users {
        int id PK "Primary Key"
        string email UK "Unique, required"
        string password_hash "bcrypt hashed"
        string name "required"
        string timezone "auto-detected, configurable"
        json preferences "notification, theme settings"
        datetime created_at
        datetime updated_at
    }

    Tasks {
        int id PK "Primary Key"
        int user_id FK "Foreign Key to Users"
        string title "1-200 chars, required"
        text description "0-1000 chars, optional"
        datetime due_date "optional"
        string category "from predefined list"
        enum priority "High, Medium, Low"
        enum status "Pending, In Progress, Completed"
        enum ai_suggested_priority "High, Medium, Low"
        datetime created_at
        datetime updated_at
        datetime deleted_at "soft delete"
    }

    %% Relationships
    Users ||--o{ Tasks : "owns"
