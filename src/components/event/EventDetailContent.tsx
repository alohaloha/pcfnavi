import { EventDetail } from '@/types/event';
import { NotionBlock, RichText } from '@/types/notion';

interface EventDetailContentProps {
    event: EventDetail;
}

export function EventDetailContent({ event }: EventDetailContentProps) {
    return (
        <div className="prose max-w-none">
            {event.blocks.map((block: NotionBlock) => {
                switch (block.type) {
                    case 'paragraph':
                        return (
                            <p key={block.id} className="mb-4">
                                {block.rich_texts.map((text: RichText, index: number) => (
                                    <span
                                        key={index}
                                    >
                                        {text.plain_text}
                                    </span>
                                ))}
                            </p>
                        );
                    case 'heading_1':
                        return (
                            <h1 key={block.id} className="text-3xl font-bold mb-4">
                                {block.rich_texts.map((text: RichText, index: number) => (
                                    <span key={index}>{text.plain_text}</span>
                                ))}
                            </h1>
                        );
                    case 'heading_2':
                        return (
                            <h2 key={block.id} className="text-2xl font-bold mb-3">
                                {block.rich_texts.map((text: RichText, index: number) => (
                                    <span key={index}>{text.plain_text}</span>
                                ))}
                            </h2>
                        );
                    case 'heading_3':
                        return (
                            <h3 key={block.id} className="text-xl font-bold mb-2">
                                {block.rich_texts.map((text: RichText, index: number) => (
                                    <span key={index}>{text.plain_text}</span>
                                ))}
                            </h3>
                        );
                    case 'bulleted_list_item':
                        return (
                            <ul key={block.id} className="list-disc pl-6 mb-4">
                                <li>
                                    {block.rich_texts.map((text: RichText, index: number) => (
                                        <span key={index}>{text.plain_text}</span>
                                    ))}
                                </li>
                            </ul>
                        );
                    case 'numbered_list_item':
                        return (
                            <ol key={block.id} className="list-decimal pl-6 mb-4">
                                <li>
                                    {block.rich_texts.map((text: RichText, index: number) => (
                                        <span key={index}>{text.plain_text}</span>
                                    ))}
                                </li>
                            </ol>
                        );
                    case 'image':
                        return block.imageSrc ? (
                            <div key={block.id} className="my-4">
                                <img
                                    src={block.imageSrc}
                                    alt={block.rich_texts.map((text: RichText) => text.plain_text).join('')}
                                    className="max-w-full h-auto rounded-lg"
                                />
                            </div>
                        ) : null;
                    default:
                        return null;
                }
            })}
        </div>
    );
} 