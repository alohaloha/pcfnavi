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

export const fetchFaqList = cache(async (): Promise<FaqItem[]> => {
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
import { fetchFaqList } from '@/lib/faq'
import FaqItem from '@/components/FaqItem'

export default async function FaqPage() {
  const faqList = await fetchFaqList()
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

# Implementation Priorities

## 1. Error Handling & Loading States
### Error Pages
- Global error page (`app/error.tsx`)
- Not found page (`app/not-found.tsx`)
- Route specific error pages where needed

### Loading States
- Global loading (`app/loading.tsx`)
- Route specific loading states
- Skeleton UI components for content-heavy pages

## 2. Caching Strategy
- Implement React Cache for data fetching
- Configure Notion API response caching
- Static page generation where applicable
- Revalidation strategies for dynamic content

## 3. Accessibility Improvements
- ARIA labels and roles
- Keyboard navigation
- Focus management
- Color contrast compliance
- Screen reader optimization

## 4. Analytics & Monitoring
- Vercel Analytics integration
- Error tracking (Sentry)
- Performance monitoring
- User behavior analytics
- API endpoint monitoring

## Implementation Notes
- Each feature should be implemented incrementally
- Test coverage should be maintained
- Documentation should be updated alongside changes
- Accessibility testing should be part of the development process

# Implementation Notes

## Global Loading

```tsx
export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="text-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary" />
        <p className="mt-4 text-gray-600">読み込み中...</p>
      </div>
    </div>
  )
}
```

## FAQ Page Loading

```tsx
export default function FaqLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="mb-8">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
            {[...Array(2)].map((_, j) => (
              <div key={j} className="mb-4">
                <div className="h-4 bg-gray-200 rounded w-full" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
```

# Implementation Notes

## Global Error Handling

```tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">エラーが発生しました</h1>
        <p className="mt-4 text-gray-600">{error.message}</p>
        <button
          onClick={reset}
          className="mt-4 rounded bg-primary px-4 py-2 text-white"
        >
          もう一度試す
        </button>
      </div>
    </div>
  )
}
```

