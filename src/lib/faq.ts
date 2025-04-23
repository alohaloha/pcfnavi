import {API_CONFIG, FaqCategoryName} from './constants'

const NOTION_URL = API_CONFIG.NOTION_API_URL!
const NOTION_TOKEN = API_CONFIG.NOTION_API_SECRET!
const FAQ_DB_ID = API_CONFIG.NOTION_FAQ_DB_ID!
const API_VERSION = API_CONFIG.NOTION_VERSION!

export type FaqItem = {
    question: string
    answer: string
    category: FaqCategoryName[]
}

export async function fetchFaqList(): Promise<FaqItem[]> {
    const res = await fetch(`${NOTION_URL}/${FAQ_DB_ID}/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${NOTION_TOKEN}`,
            'Notion-Version': `${API_VERSION}`,
            'Content-Type': 'application/json',
        },
    })

    const data = await res.json()

    console.log(data.results[0]);
    return data.results.map((row: any) => ({
        question: row.properties.question.title[0]?.plain_text || '',
        answer: row.properties.answer.rich_text[0]?.plain_text || '',
        category: row.properties.category.multi_select.map((item: any) => item.name as FaqCategoryName) || [],
    })).filter((item: FaqItem) => item.question && item.answer && item.category.length > 0)
}
