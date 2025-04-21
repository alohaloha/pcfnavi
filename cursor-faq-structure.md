# Directory Structure

The project follows the standard `src/`-based Next.js App Router structure with Markdown content and dynamic FAQ from a Notion database.

```txt
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── rules/page.tsx
│   ├── events/page.tsx
│   ├── gallery/page.tsx
│   ├── posts/[slug]/page.tsx
│   ├── posts/page.tsx
│   ├── about/page.tsx
│   ├── privacy-policy/page.tsx
│   └── faq/page.tsx              # FAQ page (Notion DB-driven, filterable by category)
│
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── InfoCard.tsx
│   ├── PostCard.tsx
│   ├── SectionTitle.tsx
│   └── FaqItem.tsx               # Accordion-style Q&A component
│
├── lib/
│   ├── posts.ts
│   └── faq.ts                    # Fetches categorized FAQ data from Notion Database API
│
├── types/
│   ├── post.ts
│   └── faq.ts                    # type FaqItem = { question: string; answer: string; category: FaqCategory }
│
├── content/
│   └── posts/                    # Markdown articles
│       ├── exciting-season.md
│       └── spotlight-john-doe.md
```

# FAQ Page - Notion Database Integration

## Notion Database Setup

- Create a Notion **database** with the following properties:
  - `question`: title field
  - `answer`: rich text
  - `category`: select field (use exact match to predefined values below)
- Share the database publicly for reading access

### FAQ Categories (used for filtering):
- `General`
- `Events`
- `Teams`
- `Starting`
- `Support`
- `All Japan`
- `Other`

## Data Fetching (`lib/faq.ts`)

Use the official Notion API with a secret token (stored in `.env.local`):

```ts
export type FaqCategory = 'General' | 'Events' | 'Teams' | 'Starting' | 'Support' | 'All Japan' | 'Other'

export type FaqItem = {
  question: string
  answer: string
  category: FaqCategory
}

export const fetchFaq = cache(async (): Promise<FaqItem[]> => {
  const NOTION_DB_ID = process.env.NOTION_FAQ_DB_ID!
  const NOTION_TOKEN = process.env.NOTION_API_SECRET!

  const res = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
  })

  const data = await res.json()

  return data.results.map((row: any) => ({
    question: row.properties.question.title[0]?.plain_text || '',
    answer: row.properties.answer.rich_text[0]?.plain_text || '',
    category: row.properties.category.select.name as FaqCategory,
  })).filter(f => f.question && f.answer && f.category)
})
```

## Rendering (app/faq/page.tsx)

```tsx
import { fetchFaq } from '@/lib/faq'
import FaqItem from '@/components/FaqItem'

export default async function FaqPage() {
  const faqList = await fetchFaq()
  const categories = [...new Set(faqList.map(f => f.category))]

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">よくある質問</h1>
      {categories.map(category => (
        <section key={category} className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{category}</h2>
          {faqList.filter(f => f.category === category).map((faq, i) => (
            <FaqItem key={i} {...faq} />
          ))}
        </section>
      ))}
    </main>
  )
}
```

## FaqItem Component

```tsx
'use client'
import { useState } from 'react'
import type { FaqItem as Faq } from '@/lib/faq'

export default function FaqItem({ question, answer }: Faq) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mb-4 border-b pb-2">
      <button className="text-left w-full font-semibold text-lg" onClick={() => setOpen(!open)}>
        {question}
      </button>
      {open && <p className="mt-2 text-gray-700">{answer}</p>}
    </div>
  )
}
```

# Cursor Instructions

- All components use `TailwindCSS`
- All pages must reside in `app/`
- Shared logic goes under `lib/` and types in `types/`
- FAQ content is sourced from **Notion Database API**, not hardcoded
- FAQ items are grouped and filterable by predefined categories

