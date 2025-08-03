# 🚧 Next Steps for Nahal Prat Project

## 🔄 Database

- [ ] **Rename `user` table** to avoid conflict with PostgreSQL reserved word  
  - Suggested name: `app_user` or `users`
  - Update all related models, migrations, and queries

## 🔐 Authentication

- [ ] **Improve Google authentication flow**
  - Add better error handling for failed logins
  - Show clearer messages to user during sign-in/out
  - Style the login page to match the site branding
- [ ] Differentiate access between `admin` and `user` in the UI
  - Admins should see booking management options
  - Users should only see their own bookings

## 🏠 Home Page

- [ ] **Enhance homepage with more functionality**
  - Add section to showcase trek packages: Basic, Pro, Premium
  - Show next available trek dates (fetch from `/api/trekdates`)
  - Add CTA buttons for registration / login
  - Add testimonials or images (optional)

---

_Last updated: 2025-08-03_