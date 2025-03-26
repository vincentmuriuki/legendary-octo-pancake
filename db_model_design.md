# Data Model Documentation

This document describes the database schema for the journaling application with user management, categories, sentiment analysis, and role-based access control. The system uses PostgreSQL with Prisma ORM.

Core Entities & Relationships

```
erDiagram
    USER ||--o{ JOURNAL_ENTRY : "1-m"
    USER ||--o{ CATEGORY : "1-m"
    JOURNAL_ENTRY ||--o{ CATEGORY : "m-m"
    JOURNAL_ENTRY ||--o| SENTIMENT : "1-1"
```

# Data Model Documentation

## Models

### 1. User Model

**Purpose**: Manages user accounts and authentication

| Field               | Type         | Description                          | Constraints                      |
|---------------------|--------------|--------------------------------------|----------------------------------|
| `id`                | String       | Unique identifier                    | `@id @default(uuid())`           |
| `name`              | String?      | Display name                         | Optional                         |
| `email`             | String       | Login credential                     | `@unique`                        |
| `emailVerified`     | DateTime?    | Email verification timestamp         | -                                |
| `password`          | String?      | Hashed password                      | Nullable for OAuth               |
| `createdAt`         | DateTime     | Account creation date                | `@default(now())`                |
| `updatedAt`         | DateTime     | Last update timestamp                | `@updatedAt`                     |
| `twoFactorEnabled`  | Boolean      | 2FA status                           | `@default(false)`                |
| `twoFactorSecret`   | String?      | TOTP secret key                      | -                                |
| `backupCodes`       | String[]     | 2FA recovery codes                   | Array storage                    |
| `role`              | Role         | Authorization level                  | `@default(USER)`                 |

**Relationships**:
- Has many `JournalEntry` (1:m)
- Has many `Category` (1:m)

---

### 2. Journal Entry Model

**Purpose**: Stores diary entries with organizational metadata

| Field         | Type        | Description                          | Constraints                      |
|---------------|-------------|--------------------------------------|----------------------------------|
| `id`          | String      | Unique identifier                    | `@id @default(uuid())`           |
| `title`       | String      | Entry heading                        | Required                         |
| `content`     | String      | Diary content                        | Required                         |
| `date`        | DateTime    | Entry date                           | `@default(now())`                |
| `userId`      | String      | Author reference                     | Foreign key                      |
| `sentiment`   | Sentiment?  | NLP analysis results                 | Optional 1:1 relationship        |
| `createdAt`   | DateTime    | Creation timestamp                   | `@default(now())`                |
| `updatedAt`   | DateTime    | Last update timestamp                | `@updatedAt()`                   |
| `categoryIds` | String[]    | Denormalized category IDs            | Performance optimization         |
| `deletedAt`   | DateTime?   | Soft delete marker                   | -                                |

**Relationships**:
- Belongs to one `User`
- Has many `Category` through categoryIds


## Indexes:
```
@@index([userId, date])  // Optimized for timeline queries
@@index([userId])        // User-specific entry retrieval
```


### 3. Category Model

**Purpose**: Organizes entries into user-defined groups

| Field       | Type     | Description                   | Constraints               |
|-------------|----------|-------------------------------|---------------------------|
| `id`        | String   | Unique identifier             | `@id @default(uuid())`    |
| `name`      | String   | Category label                | Required                  |
| `isDefault` | Boolean  | System-generated flag         | `@default(false)`         |
| `userId`    | String   | Owner reference               | Foreign key               |

**Relationships**:
- Many-to-many with `JournalEntry`
- Belongs to one `User`

---

### 4. Sentiment Analysis Model

**Purpose**: Stores NLP processing results

| Field       | Type      | Description                          | Example                    |
|-------------|-----------|--------------------------------------|----------------------------|
| `id`        | String    | Unique identifier                    | `@id @default(uuid())`     |
| `entryId`   | String    | Linked journal entry                 | `@unique`                  |
| `score`     | Float     | Sentiment polarity (-1 to 1)         | 0.72 (positive)           |
| `keywords`  | String[]  | Identified key phrases               | ["family", "vacation"]    |
| `createdAt` | DateTime  | Analysis timestamp                   | `@default(now())`         |

---

## Enumerations

### Role Enum
```prisma
enum Role {
  USER
  ADMIN
}
```

# Design Decisions

## 1. Security Architecture

| **Decision**               | **Rationale**                                                                 |
|----------------------------|-------------------------------------------------------------------------------|
| UUID Primary Keys          | Prevents ID enumeration attacks                  |
| 2FA Support                | Implements time-based one-time passwords (TOTP) for enhanced security         |
| Hashed Passwords           | Stores credentials using industry-standard bcrypt/scrypt algorithms           |
| Role-Based Access Control  | Prepares for future admin features and privilege separation                   |

## 2. Performance Optimizations

| **Technique**       | **Implementation**            | **Benefit**                                  |
|----------------------|-------------------------------|----------------------------------------------|
| Denormalization      | `categoryIds` array           | Avoids JOIN operations for common reads      |
| Composite Indexes    | `(userId, date)` index        | Optimizes chronological entry queries        |
| Soft Deletes         | `deletedAt` field             | Enables data recovery workflows              |

## 3. Extensibility Features

| **Feature**           | **Description**                                  |
|-----------------------|--------------------------------------------------|
| Sentiment Analysis    | Smart entry analysis and Insight generation     |         |
| Backup Code Storage   | Enables 2FA recovery mechanisms                  |


## Schema Considerations
```
// Example Many-to-Many Relationship
model JournalEntry {
  categories Category[] @relation(references: [id])
}

model Category {
  entries JournalEntry[] @relation(references: [id])
}
```