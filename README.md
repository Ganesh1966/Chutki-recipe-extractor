# Chutki Recipe Extractor

A full-stack web application built for the Chutki Assignment to upload a `.txt` file containing recipe text, extract structured recipe data (name, image, ingredients, steps) using OpenAI, store it in a Neon Postgres database, and display it in a clean, user-friendly UI. Deployed on Vercel (free tier).

## Features
- **File Upload**: Upload a `.txt` file via a modern drag-and-drop interface.
- **AI Processing**: Uses OpenAI's GPT-4o-mini to extract structured JSON from raw recipe text.
- **Data Storage**: Persists extracted data in Neon Postgres (free tier).
- **Attractive UI**: Displays recipes in a card layout with images, ingredient grids, and numbered steps.
- **Deployment**: Hosted on Vercel with serverless API routes and secure environment variables.
- **Responsive Design**: Mobile-friendly with Tailwind CSS styling.

## Tech Stack
- **Frontend**: Next.js (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes, OpenAI SDK, Neon Postgres (serverless)
- **Deployment**: Vercel (free tier)
- **Database**: Neon Postgres (free tier)

## Project Structure
```
chutki-assignment/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── upload/
│   │   │       └── route.ts    # API to process .txt file and store data
│   │   ├── globals.css         # Tailwind CSS global styles
│   │   ├── layout.tsx          # Root layout for the app
│   │   └── page.tsx            # Frontend UI for upload and recipe display
│   └── lib/
│       ├── openai.ts           # OpenAI client setup
│       ├── db.ts               # Neon Postgres client
│       └── prompts.ts          # Prompt builder for OpenAI
├── .env.local                  # Environment variables (not committed)
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## Prerequisites
- **Node.js**: LTS version (e.g., 20.x)
- **OpenAI API Key**: Sign up at [OpenAI](https://platform.openai.com) to get an API key.
- **Neon Postgres**: Free account at [Neon](https://neon.tech) for serverless Postgres.
- **Vercel Account**: Free account at [Vercel](https://vercel.com) for deployment.
- **GitHub Account**: For version control and Vercel deployment.

## Setup Instructions
1. **Clone the Repository**
   ```bash
   git clone https://github.com/<your-username>/chutki-assignment.git
   cd chutki-assignment
   ```

2. **Install Dependencies**
   ```bash
   npm install
   npm install openai @neondatabase/serverless
   ```

3. **Set Up Environment Variables**
   Create a `.env.local` file in the project root:
   ```
   OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
   DATABASE_URL=postgresql://<user>:<password>@<host>.neon.tech:5432/<dbname>?sslmode=require
   ```
   - Get `OPENAI_API_KEY` from your OpenAI account.
   - Get `DATABASE_URL` from your Neon dashboard (e.g., `postgresql://neondb_owner:npg_SpaG9EsC8mhx@ep-withered-poetry-a1a1vlmi-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`).

4. **Set Up Neon Postgres**
   - Log in to [Neon](https://neon.tech).
   - Create a new project (e.g., `chutki-assignment`).
   - In the SQL Editor, run:
     ```sql
     CREATE TABLE IF NOT EXISTS extracted_data (
       id SERIAL PRIMARY KEY,
       data JSONB NOT NULL,
       created_at TIMESTAMPTZ DEFAULT NOW()
     );
     ```

5. **Run Locally**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage
1. **Upload a .txt File**
   - Use the drag-and-drop area or click to select a `.txt` file with recipe text (e.g., ingredients, steps).
   - Example `recipe1.txt`:
     ```
     Recipe: Paneer Butter Masala
     Ingredients:
     - 200g paneer cubes
     - 2 onions
     - 3 tomatoes
     - 1 tbsp butter
     Steps:
     1. Heat butter, sauté onions.
     2. Add tomatoes, cook until soft.
     3. Blend into gravy.
     4. Add paneer and spices.
     ```

2. **Extract & Display**
   - Click "Upload & Extract Recipe".
   - The backend processes the file using OpenAI, stores the result in Neon Postgres, and displays a recipe card with:
     - Recipe name
     - Image (Unsplash fallback if none provided)
     - Ingredients (grid layout)
     - Steps (numbered list)

3. **Test the API Directly**
   ```bash
   curl -X POST http://localhost:3000/api/upload -F "file=@recipe1.txt"
   ```
   Expected output:
   ```json
   {
     "id": 1,
     "data": {
       "name": "Paneer Butter Masala",
       "image": "https://source.unsplash.com/800x600/?paneer,masala",
       "ingredients": ["200g paneer cubes", "2 onions", "3 tomatoes", "1 tbsp butter"],
       "steps": ["Heat butter, sauté onions.", "Add tomatoes, cook until soft.", "Blend into gravy.", "Add paneer and spices."]
     }
   }
   ```

## Deployment
1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com) → New Project → Import your GitHub repo.
   - Add environment variables in Vercel (Settings → Environment Variables):
     - `OPENAI_API_KEY`: Your OpenAI key
     - `DATABASE_URL`: Your Neon connection string
   - Click Deploy. Vercel auto-detects Next.js and deploys.

3. **Access Live App**
   - Vercel provides a URL (e.g., `https://chutki-assignment.vercel.app`).
   - Test the upload at `<your-url>/api/upload`.

## Troubleshooting
- **API Errors**: Check Vercel logs (Functions → Logs) or local console for OpenAI/Neon issues.
- **Invalid JSON**: Ensure `OPENAI_API_KEY` is correct. Adjust prompt in `prompts.ts` if needed.
- **DB Connection**: Verify `DATABASE_URL` matches Neon’s connection string and table exists.
- **UI Issues**: Ensure Tailwind CSS is set up (check `globals.css`, `tailwind.config.js`).

## Limitations
- **File Size**: Limited to 1MB to avoid overloading Vercel/OpenAI.
- **OpenAI Costs**: Monitor token usage (GPT-4o-mini is budget-friendly).
- **Neon Free Tier**: Limited to 3GB storage and compute; sufficient for this demo.
