System Design Document

 1. Architecture Diagram

[Client] (Next.js App) 
  │
  │ HTTPS
  ▼
  │ Vercel Serverless API
  ▼
[Backend Services]
  ├── Auth (NextAuth)
  ├── Journal CRUD (Next.js API Routes)
  ├── AI Processing (OpenAI API)
  └── Analytics (Custom Aggregators)
  │
  │ Prisma ORM
  ▼
[PostgreSQL Database] 
  ├── Users
  ├── Journal Entries
  ├── Categories
  └── Sentiment Analysis Data


Key Components:
1. Client Layer: Next.js 13+ with App Router
2. Serverless API: Next.js API routes with rate limiting
3. Database: PostgreSQL with Prisma ORM
4. AI Service: OpenAI API integration for sentiment analysis
5. Auth: NextAuth with JWT sessions

---

 2. Data Model Relationships

Entity Relationship Diagram


  USER ||--o{ JOURNAL_ENTRY : creates
  USER ||--o{ CATEGORY : maintains
  JOURNAL_ENTRY ||--|{ CATEGORY : categorizes
  JOURNAL_ENTRY ||--|| SENTIMENT : has


Key Entities:
- User: Core identity with auth credentials
- Journal Entry: Main content with temporal data
- Category: Flexible tagging system
- Sentiment: AI analysis results

 3. Security Measures
 Authentication:
   - JWT with 1-hour expiration
   - Refresh token rotation
   - 2FA with TOTP

Data Protection:
   - AES-256 encryption for sensitive fields
   - TLS 1.3 everywhere
   - Rate limiting (10 req/s per endpoint)

Input Validation:
   - Zod schema validation
   - Sanitization of all free-text inputs
   - Content security policies (CSP)

 4. Scaling Challenges & Solutions

Database Read Load -> Read replicas + Redis cache 
Write Contention -> Connection pooling + Queueing 
AI API Costs > Cached results + Bulk processing 
Real-time Analytics -> TimescaleDB + Materialized Views 
Asset Delivery -> Vercel Edge Network + Image Optimization 


 5. Million-User Scaling Strategy
Database:
   - Sharding by user geography
   - Citus extension for PostgreSQL
   - Columnar storage for analytics

Compute:
   - Vercel Serverless Functions (auto-scale)
   - Dedicated AI processing workers

Caching:
   - Redis for frequent queries
   - Edge config for personalization

Monitoring:
   - Prometheus/Grafana metrics
   - Distributed tracing (OpenTelemetry)


 6. Potential Bottlenecks
 Database Writes:
   - Implement write-behind caching
   - Batch insert operations

AI Processing Latency:
   - Pre-cache common analysis patterns
   - Implement request coalescing

Cold Starts:
   - Keep serverless functions warm
   - Use edge-optimized packages


 Technical Decision Log

Next.js App Router vs Pages Router
 Problem: Need RSC + Simplified Data Fetching
Options:
Existing Pages Router
Experimental App Router
Choice: App Router
Rationale:
Built-in Layout support
Streaming SSR capabilities
Future-proof architecture
Trade-offs:
Some breaking changes
Smaller plugin ecosystem

Prisma ORM vs Raw SQL
Problem: Safe Database Interactions
Options:
Direct SQL
TypeORM
Prisma
Choice: Prisma
Rationale:
Type-safe queries
Migrations system
Multi-database support
Trade-offs:
Slight performance overhead
Vendor lock-in risk

JWT vs Database Sessions
Problem: Authentication Strategy
Options:
Pure JWT
Database sessions
Hybrid approach
Choice: Hybrid (JWT + DB checks)
Rationale:
Fast validation with JWTs
Revocability via DB checks
Best security practice
Trade-offs:
Additional DB calls
Session sync complexity

OpenAI Integration vs Self-hosted Model
Problem: AI Feature Implementation
Options:
OpenAI API
Hugging Face models
Custom training
Choice: OpenAI API
Rationale:
State-of-the-art models
Maintenance-free
Cost-effective at scale
Trade-offs:
Data privacy concerns
API dependency

Redis Caching Layer
Problem: Analytics Query Performance
Options:
Database caching
In-memory cache
Redis
Choice: Redis
Rationale:
Sub-millisecond responses
Atomic operations
Cluster support
Trade-offs:
Additional infrastructure
Cache invalidation complexity



