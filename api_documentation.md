API Documentation

Authentication Requirements
Most endpoints require a valid session cookie
Admin endpoints require `role: ADMIN` in user record
2FA-enabled accounts require TOTP code after initial authentication
API routes use NextAuth.js session management

User Management Endpoints

Get All Users (Admin)
Endpoint: `GET /api/admin/users`
Required Role: ADMIN  
Response:

[
  {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "role": "USER|ADMIN",
    "createdAt": "ISO date"
  }
]
```

---

 Authentication Endpoints

Generate 2FA Secret
Endpoint: `GET /api/auth/2fa/generate`  
Response:
{
  "secret": "TOTP_SECRET"
}

Verify 2FA Code
Endpoint: `POST /api/auth/2fa/verify`  
Request Body:
{
  "code": "123456",
  "secret": "TOTP_SECRET"
}

Response:
{
  "backupCodes": ["ABCD1234", ...]
}

Change Password
Endpoint: `POST /api/auth/changepassword`  
Request Body:
{
  "values": {
    "currentPassword": "string",
    "newPassword": "string"
  }
}






Journal Endpoints

Get Paginated Entries
Endpoint: `GET /api/entries?userId=UUID&search=string&category=UUID&startDate=ISO&endDate=ISO&cursor=UUID`  
Parameters:
limit: 9 (default)
cursor: UUID for pagination

Response:
{
  "data": [
    {
      "id": "uuid",
      "title": "string",
      "content": "string",
      "date": "ISO date",
      "categories": [],
      "sentiment": null|{...}
    }
  ],
  "nextCursor": "UUID|null"
}

Create Entry
Endpoint: `POST /api/entries`  
Request Body:
{
  "title": "string",
  "content": "string",
  "date": "ISO date",
  "userId": "UUID",
  "categoryIds": ["UUID"]
}

Get/Delete Entry
Endpoint: `GET|DELETE /api/entries/[entryId]`


 Category Endpoints

Get User Categories
Endpoint: `GET /api/categories`  
Response:
[
  {
    "id": "uuid",
    "name": "string",
    "isDefault": boolean,
    "userId": "UUID"
  }
]

---

 AI Analysis Endpoint

Analyze Entry Sentiment
Endpoint: `POST /api/aianalysis`  
Request Body:
{
  "entryId": "UUID",
  "content": "Journal text"
}

Streaming Response:
{
  "score": 0.85,
  "keywords": ["keyword1", "keyword2", "keyword3"]
}


 Summary Endpoints

Category Distribution
Endpoint: `GET /api/summary/categories?userId=UUID`  
Response:
```json
[
  {"name": "Work", "value": 12},
  {"name": "Personal", "value": 8}
]
```

Writing Heatmap
Endpoint: `GET /api/summary/heatmap?userId=UUID&year=2024`  
Response:
{
  "2024-01-01": 1,
  "2024-01-02": 2
}

Mood Timeline
Endpoint: `GET /api/summary/mood?userId=UUID&year=2024`  
Response:
[
  {"month": "Jan", "score": 0.75},
  {"month": "Feb", "score": 0.68}
]

---

 Error Responses
Common error formats:

{
  "error": "Error message"
}

Status Codes:
401 Unauthorized
403 Forbidden (admin-only)
400 Invalid request
500 Server error


 Database Schema Overview

 Relationships
User 1:m JournalEntry
User 1:m Category
JournalEntry m:m Category
JournalEntry 1:1 Sentiment

 Key Models
User:
Authentication fields
2FA configuration
Role-based access

JournalEntry:
Soft delete (deletedAt)
Full-text search capabilities
Sentiment analysis linkage

Sentiment:
AI-generated scores (-1 to 1)
Keyword extraction

