# 🚀 Deployment Guide: Vercel + Neon (PostgreSQL)

Since Vercel is a "Serverless" platform, it **cannot** run a local database (like the one on your laptop). You need a cloud database.

## 1. Set up a Cloud Database (Neon.tech)

We recommend [Neon](https://neon.tech) because it is serverless, free, and designed for Vercel.

1.  Go to [Neon.tech](https://neon.tech) and **Sign Up**.
2.  Create a **New Project** (e.g., `kaps-medtech`).
3.  Copy the **Connection String** (Postgres URL). It looks like:
    `postgres://user:password@ep-cool-server.us-east-2.aws.neon.tech/neondb?sslmode=require`

## 2. Initialize the Cloud Database

You need to run your `schema.sql` on the new cloud database.

1.  On your laptop, verify you have the connection string.
2.  Run this command in your terminal (replacing `YOUR_NEON_URL` with the one you copied):
    ```bash
    DATABASE_URL="YOUR_NEON_URL" node backend/init_db.js
    ```
    *(This connects to the cloud DB and creates the tables/users automatically!)*

## 3. Deploy to Vercel

1.  Push your latest code to GitHub:
    ```bash
    git add .
    git commit -m "Ready for Vercel"
    git push
    ```
2.  Go to [Vercel.com](https://vercel.com) and **Sign Up/Login**.
3.  Click **"Add New..."** -> **"Project"**.
4.  Import your `kaps-medtech` repository.
5.  **Environment Variables** (Critical Step!):
    -   In the "Environment Variables" section, add:
        -   `DATABASE_URL`: (Paste your Neon Connection String)
        -   `JWT_SECRET`: (Enter a secure random string, e.g., `supersecretkey123`)
6.  Click **Deploy**.

## 4. Verify

Once deployed, Vercel will give you a URL (e.g., `https://kaps-medtech.vercel.app`).
-   Open it and try logging in as `student@university.edu` / `password123`.
-   If it works, your app is live! 🌍
