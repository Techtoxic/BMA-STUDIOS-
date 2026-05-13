# Sanity CMS Setup for BMA Photography

## Step 1: Create Sanity Account
1. Go to sanity.io and signup
2. Create new project named "BMA Photography"
3. Get your Project ID from dashboard

## Step 2: Install Dependencies
```bash
cd studio
npm install
```

## Step 3: Configure Environment
Create `.env.local` in root folder:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

## Step 4: Deploy Studio
```bash
npx sanity deploy
```
This gives you a URL: `https://bma-photography.sanity.studio`

## Step 5: Client Login
- Give client the studio URL
- Invite client via email in Sanity dashboard
- Client can upload images and edit all content

## Content Types Created:
- **Services** (7 slots) - Title, price, image, icon
- **Products** (unlimited) - Name, category, price, stock, rating, image
- **Portfolio** (unlimited) - Images with categories
- **Hero** - Background image, headline, phone number
