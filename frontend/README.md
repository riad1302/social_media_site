# BuddyScript — Social Media Platform

A full-stack social media application built as a selection task for the **Full Stack Engineer** position at **Appifylab**. The platform allows users to register, log in, and interact with a social feed — posting content, liking, commenting, and replying to others' posts.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Architecture & Design Decisions](#architecture--design-decisions)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Database Schema](#database-schema)
- [Security Considerations](#security-considerations)
- [Performance & Scalability](#performance--scalability)

---

## Project Overview

BuddyScript is a responsive social media platform converted from provided HTML/CSS designs into a fully functional React/Next.js frontend backed by a Laravel REST API. It implements:

- JWT or session-based authentication
- A real-time-styled feed of posts (most recent first)
- Public and private post visibility
- Like/unlike for posts, comments, and replies
- Nested comment and reply threads
- Image upload support for posts

The design faithfully follows the provided Figma-exported HTML templates using **Bootstrap 5** and **Poppins** font.

---

## Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| PHP | 8.3 | Runtime |
| Laravel | 13 | API framework |
| MySQL | 8.x | Primary database |
| PHPUnit | 12 | Testing |
| Laravel Pint | 1 | Code formatter |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16 | React framework (SSR/SSG) |
| React | 19 | UI library |
| TypeScript | 5 | Type safety |
| Bootstrap | 5 | CSS framework (from provided design) |

---

## Features

### Authentication
- **Registration** — first name, last name, email, password with validation
- **Login** — email and password with secure session handling
- **Protected routes** — Feed page is inaccessible without authentication
- **Logout** — session invalidation

### Feed
- View all public posts from all users, ordered by most recent
- Private posts visible only to their author
- Create new posts with optional image attachment
- Real-time-style updates without full page reload

### Posts
- **Create** — text content + optional image, set visibility (public/private)
- **Like / Unlike** — toggle like on any post; shows who liked it
- **Delete** — authors can delete their own posts

### Comments
- Add comments to any post
- **Like / Unlike** comments
- View all commenters

### Replies
- Reply to any comment
- **Like / Unlike** replies
- Nested thread display

---

## Architecture & Design Decisions

### API-First Backend
The Laravel backend exposes a versioned REST API (`/api/v1/...`). This decouples the frontend completely and makes it easy to add mobile clients in the future.

### Authentication Strategy
Laravel Sanctum is used for token-based SPA authentication. Tokens are stored in `httpOnly` cookies, preventing XSS access from JavaScript while still supporting CSRF protection.

### Database Design for Scale
The schema is designed with millions of posts/reads in mind:

- **Polymorphic likes** — a single `likes` table handles post likes, comment likes, and reply likes using `likeable_type` / `likeable_id`. This avoids three separate tables and simplifies queries.
- **Indexed foreign keys** — all foreign keys and frequently filtered columns (e.g. `user_id`, `post_id`, `visibility`, `created_at`) are indexed.
- **Soft deletes** — posts and comments use `SoftDeletes` so data is recoverable and historical like counts remain valid.
- **Pagination** — feed endpoint uses cursor-based pagination rather than offset pagination for stable performance at large offsets.

### Visibility Control
Posts have a `visibility` enum (`public` | `private`). The feed query filters private posts at the database level so they never reach unauthorized users:

```sql
WHERE visibility = 'public' OR user_id = :authenticated_user_id
```

### Image Uploads
Post images are stored on the `local` filesystem disk (configurable to S3 via `FILESYSTEM_DISK=s3`). URLs are generated via Laravel's `Storage::url()` helper.

### Frontend Routing
Next.js App Router is used with the following route structure:

```
/              → redirects to /login or /feed
/login         → Login page (public)
/register      → Registration page (public)
/feed          → Social feed (protected)
```

Route protection is handled by a Next.js middleware that checks for a valid auth token before rendering protected pages.

---

## Project Structure

```
social_media_site/
├── backend/                    # Laravel 13 API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── Auth/
│   │   │   │   │   ├── LoginController.php
│   │   │   │   │   └── RegisterController.php
│   │   │   │   ├── PostController.php
│   │   │   │   ├── CommentController.php
│   │   │   │   ├── ReplyController.php
│   │   │   │   └── LikeController.php
│   │   │   └── Requests/
│   │   │       ├── Auth/
│   │   │       │   ├── LoginRequest.php
│   │   │       │   └── RegisterRequest.php
│   │   │       └── StorePostRequest.php
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── Post.php
│   │   │   ├── Comment.php
│   │   │   ├── Reply.php
│   │   │   └── Like.php
│   │   └── Policies/
│   │       └── PostPolicy.php
│   ├── database/
│   │   ├── migrations/
│   │   ├── factories/
│   │   └── seeders/
│   ├── routes/
│   │   ├── api.php             # All API routes
│   │   └── web.php
│   └── tests/
│       └── Feature/
│
├── frontend/                   # Next.js 16 App
│   ├── src/
│   │   └── app/
│   │       ├── (auth)/
│   │       │   ├── login/
│   │       │   │   └── page.tsx
│   │       │   └── register/
│   │       │       └── page.tsx
│   │       ├── feed/
│   │       │   └── page.tsx
│   │       ├── layout.tsx
│   │       └── middleware.ts   # Route protection
│   └── public/
│
└── task/                       # Original design files
    ├── login.html
    ├── registration.html
    ├── feed.html
    └── assets/
```

---

## Getting Started

### Prerequisites

- PHP 8.3+
- Composer 2+
- Node.js 20+
- npm 10+
- MySQL 8+

---

### Backend Setup

```bash
cd backend

# 1. Install PHP dependencies
composer install

# 2. Copy environment file
cp .env.example .env

# 3. Generate application key
php artisan key:generate

# 4. Configure your database in .env
#    DB_DATABASE, DB_USERNAME, DB_PASSWORD

# 5. Run migrations
php artisan migrate

# 6. (Optional) Seed with sample data
php artisan db:seed

# 7. Start the development server
php artisan serve
```

The API will be available at `http://localhost:8000`.

---

### Frontend Setup

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.local.example .env.local

# 3. Set the API base URL
#    NEXT_PUBLIC_API_URL=http://localhost:8000

# 4. Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`.

---

### Run Both Together (from backend/)

```bash
cd backend
composer run dev
```

This starts the Laravel server, queue worker, log watcher, and Vite dev server concurrently.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `APP_URL` | `http://localhost:8000` | Backend URL |
| `DB_CONNECTION` | `mysql` | Database driver |
| `DB_HOST` | `127.0.0.1` | Database host |
| `DB_PORT` | `3306` | Database port |
| `DB_DATABASE` | `backend` | Database name |
| `DB_USERNAME` | `root` | Database user |
| `DB_PASSWORD` | _(empty)_ | Database password |
| `SESSION_DRIVER` | `database` | Session storage |
| `FILESYSTEM_DISK` | `local` | File storage (use `s3` for production) |
| `SANCTUM_STATEFUL_DOMAINS` | `localhost:3000` | Allowed SPA domains |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Laravel backend base URL |

---

## API Overview

All API routes are versioned under `/api/v1/`.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/register` | Register a new user |
| `POST` | `/api/v1/login` | Log in and receive token |
| `POST` | `/api/v1/logout` | Invalidate current token |
| `GET` | `/api/v1/user` | Get authenticated user |

### Posts

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/posts` | Get feed (paginated, auth required) |
| `POST` | `/api/v1/posts` | Create a new post |
| `DELETE` | `/api/v1/posts/{post}` | Delete own post |

### Comments

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/posts/{post}/comments` | List comments on a post |
| `POST` | `/api/v1/posts/{post}/comments` | Add a comment |

### Replies

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/comments/{comment}/replies` | Add a reply |

### Likes

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/posts/{post}/like` | Toggle like on post |
| `POST` | `/api/v1/comments/{comment}/like` | Toggle like on comment |
| `POST` | `/api/v1/replies/{reply}/like` | Toggle like on reply |

---

## Database Schema

### `users`
| Column | Type | Notes |
|---|---|---|
| `id` | bigint PK | |
| `first_name` | varchar | |
| `last_name` | varchar | |
| `email` | varchar unique | |
| `password` | varchar | bcrypt (12 rounds) |
| `avatar` | varchar nullable | Profile picture path |
| `email_verified_at` | timestamp | |
| `timestamps` | | |

### `posts`
| Column | Type | Notes |
|---|---|---|
| `id` | bigint PK | |
| `user_id` | FK → users | Indexed |
| `content` | text | |
| `image` | varchar nullable | Storage path |
| `visibility` | enum(`public`,`private`) | Default: `public` |
| `deleted_at` | timestamp | Soft delete |
| `timestamps` | | |

### `comments`
| Column | Type | Notes |
|---|---|---|
| `id` | bigint PK | |
| `post_id` | FK → posts | Indexed |
| `user_id` | FK → users | Indexed |
| `content` | text | |
| `deleted_at` | timestamp | Soft delete |
| `timestamps` | | |

### `replies`
| Column | Type | Notes |
|---|---|---|
| `id` | bigint PK | |
| `comment_id` | FK → comments | Indexed |
| `user_id` | FK → users | Indexed |
| `content` | text | |
| `timestamps` | | |

### `likes` (polymorphic)
| Column | Type | Notes |
|---|---|---|
| `id` | bigint PK | |
| `user_id` | FK → users | Indexed |
| `likeable_id` | bigint | Polymorphic target ID |
| `likeable_type` | varchar | `Post`, `Comment`, or `Reply` |
| `timestamps` | | Unique on (user_id, likeable_id, likeable_type) |

---

## Security Considerations

- **Password hashing** — bcrypt with 12 rounds via Laravel's `Hash::make()`
- **CSRF protection** — Laravel Sanctum's cookie-based SPA auth includes CSRF tokens automatically
- **SQL injection** — All queries use Eloquent ORM / prepared statements; no raw user input in queries
- **XSS prevention** — React escapes all rendered values by default; Blade templates use `{{ }}` escaping
- **Authorization** — Laravel Policies (`PostPolicy`) enforce that users can only modify their own content
- **Input validation** — All request data validated via Laravel Form Requests before any business logic
- **Visibility enforcement** — Private posts filtered at query level, never sent to unauthorized clients
- **File upload safety** — Uploaded images validated for MIME type and size; stored outside the web root

---

## Performance & Scalability

- **Cursor-based pagination** on the feed — consistent performance regardless of dataset size
- **Polymorphic likes table** — single indexed table instead of three, reducing JOIN complexity
- **Eager loading** — Eloquent relationships (`with()`) prevent N+1 query issues
- **Database indexes** on all foreign keys and filter columns (`visibility`, `created_at`, `user_id`)
- **Storage abstraction** — switching from local disk to S3 requires only a config change (`FILESYSTEM_DISK=s3`), no code changes
- **Queue-ready** — Laravel queue worker configured for future async tasks (notifications, email, etc.)

---

## Running Tests

```bash
cd backend

# Run all tests
php artisan test --compact

# Run a specific test file
php artisan test --compact tests/Feature/PostTest.php

# Run a specific test
php artisan test --compact --filter=test_user_can_create_post
```
