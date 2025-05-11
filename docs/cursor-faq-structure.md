# Directory Structure

The project follows the standard `src/`-based Next.js App Router structure with Markdown content and dynamic FAQ from a
Notion database.

```txt
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── (routes)/
│   │   ├── rules/page.tsx
│   │   ├── events/page.tsx
│   │   ├── gallery/page.tsx
│   │   ├── posts/[id]/page.tsx
│   │   ├── posts/page.tsx
│   │   ├── about/page.tsx
│   │   ├── privacy-policy/page.tsx
│   │   └── faq/page.tsx          # FAQ page (Notion DB-driven, filterable by category)
│   └── api/                      # API Route Handlers
│       └── faq/                  # FAQ related APIs
│           ├── route.ts          # GET - FAQ list endpoint
│           └── detail/[id]/      # Dynamic route for FAQ details
│               └── route.ts      # GET - FAQ details by ID
│
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── InfoCard.tsx
│   ├── PostCard.tsx
│   ├── SectionTitle.tsx
│   ├── FaqList.tsx               # Container component for FAQ items by category
│   └── FaqItem.tsx               # Accordion-style Q&A component with detail view
│
├── lib/
│   ├── posts.ts
│   ├── constants.ts              # Shared constants including API configs
│   ├── faq.ts                    # Server actions for fetching FAQ data (uses the API routes)
│   └── notionParser.tsx          # Shared utility for rendering Notion blocks to React components
│
├── types/
│   ├── post.ts
│   └── faq.ts                    # type FaqItem = { id: string; question: string; answer: string; category: FaqCategory[] }
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
    - `category`: multi-select field (use exact match to predefined values)
- Share the database publicly for reading access

### FAQ Categories (used for filtering):

- `General`
- `Events`
- `Teams`
- `Starting`
- `Support`
- `All Japan`
- `Other`

## Data Fetching Architecture

1. **API Routes (`app/api/faq/`)**
    - `route.ts` - handles the GET request for the FAQ list
    - `detail/[id]/route.ts` - handles the GET request for specific FAQ details

2. **Server Actions (`lib/faq.ts`)**
    - `fetchFaqList` - cached server action that calls the FAQ list API
    - `fetchFaqDetail` - cached server action that calls the FAQ detail API

3. **Client/Server Components**
    - `app/(routes)/faq/page.tsx` - Server Component that fetches the initial FAQ list
    - `components/FaqList.tsx` - Client Component for category filtering
    - `components/FaqItem.tsx` - Client Component for accordion behavior and detail fetching

4. **Shared Utility**
    - `lib/notionParser.tsx` - Utility component for rendering Notion blocks consistently

## Type Definitions

```tsx
// src/lib/faq.ts
export type FaqItem = {
  id: string
  question: string
  answer: string
  category: FaqCategoryName[]
}

export type NotionBlock = {
  id: string
  type: string
  [key: string]: any
}

export type FaqDetail = {
  blocks: NotionBlock[]
}
```

## Caching Strategy

- API routes use `next: { revalidate: 3600 }` for 1-hour cache
- Server actions use React's `cache()` for request deduplication
- Tags-based invalidation for fine-grained cache control

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

