# Kerenisan — Deployment Guide

## Step 1: Set Up Supabase

1. Go to **https://supabase.com** and create a free account
2. Click **"New Project"** — choose a name (e.g., `kerenisan`) and set a database password
3. Wait for the project to initialize (~2 minutes)

### Create Database Tables
4. Go to **SQL Editor** (left sidebar)
5. Click **"New query"**
6. Open the file `sql/setup.sql` from this project, copy ALL its contents
7. Paste into the SQL editor and click **"Run"**
8. You should see "Success" — this creates all tables and initial categories

### Create Storage Bucket
9. Go to **Storage** (left sidebar)
10. Click **"New bucket"**
11. Name: `products`
12. Toggle **"Public bucket"** to ON
13. Click **"Create bucket"**

### Create Admin User
14. Go to **Authentication** (left sidebar)
15. Click **"Add user"** → **"Create new user"**
16. Enter your email and a strong password
17. This will be your admin login

### Get API Keys
18. Go to **Settings** → **API** (left sidebar)
19. Copy these two values:
    - **Project URL** (looks like `https://xxxxx.supabase.co`)
    - **anon public** key (under "Project API keys")

---

## Step 2: Push Code to GitHub

1. Create a new repository on **https://github.com/new**
2. Name it `kerenisan` (or whatever you like)
3. On your computer, open Terminal/CMD in the `kerenisan` project folder:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/kerenisan.git
git push -u origin main
```

---

## Step 3: Deploy to Vercel

1. Go to **https://vercel.com** and sign in with your GitHub account
2. Click **"Add New..."** → **"Project"**
3. Find and select your `kerenisan` repository
4. In **"Environment Variables"**, add these:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Your WhatsApp number (with country code, no +) |
| `NEXT_PUBLIC_GA_ID` | Your Google Analytics ID (optional) |

5. Click **"Deploy"**
6. Wait 1-2 minutes — your site will be live!

---

## Step 4: Connect Your Domain

1. In Vercel, go to your project → **Settings** → **Domains**
2. Add your domain (e.g., `kerenisan.com`)
3. Vercel will show you DNS records to add
4. Go to your domain registrar and update the DNS:
   - Add a **CNAME** record pointing to `cname.vercel-dns.com`
   - Or add an **A** record to the IP Vercel provides
5. Wait for DNS propagation (usually 5-30 minutes)

---

## Step 5: Manage Your Site

### Admin Panel
- URL: `https://yourdomain.com/admin`
- Login with the email/password you created in Supabase

### Adding Products
1. Go to Admin → Products → **+ Add Product**
2. Fill in: Product ID, Name (EN + AR), Description, Category
3. Upload images (drag & drop or click to select — multiple images supported)
4. Set colors, sizes, MOQ
5. Check "Published" to make it visible, "New Arrivals" or "Hot Sale" as needed
6. Click **Create Product**

### Managing Categories
- Go to Admin → Categories
- Add, edit, or delete categories
- Products are automatically grouped by category on the website

---

## Google Analytics Setup (Optional)

1. Go to **https://analytics.google.com**
2. Create a new property for your website
3. Get the Measurement ID (starts with `G-`)
4. Add it as `NEXT_PUBLIC_GA_ID` in Vercel environment variables
5. Redeploy (Vercel → Deployments → Redeploy)

---

## Updating the Site

Any time you push changes to GitHub, Vercel automatically rebuilds and deploys.

```bash
git add .
git commit -m "Update"
git push
```

---

## Troubleshooting

**Images not loading?**
- Make sure the `products` storage bucket is set to **Public**
- Check that `NEXT_PUBLIC_SUPABASE_URL` is correct

**Admin login not working?**
- Verify you created the user in Supabase Authentication
- Check email/password are correct

**Arabic not showing?**
- The Tajawal font loads from Google Fonts — needs internet
- Make sure Arabic names are filled in Admin panel
