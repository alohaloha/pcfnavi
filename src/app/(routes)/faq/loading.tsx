import { Section } from "@/components/Section";

export default function FaqLoading() {
  return (
    <Section>
      <div className="h-10 w-64 bg-gray-200 rounded-md mb-6 animate-pulse"></div>
      
      {[1, 2, 3].map((category) => (
        <div key={category} className="mb-10">
          <div className="h-8 w-40 bg-gray-200 rounded-md mb-4 animate-pulse"></div>
          
          <div className="space-y-6">
            {[1, 2, 3].map((faq) => (
              <div key={faq} className="border-b pb-4">
                <div className="h-6 w-3/4 bg-gray-200 rounded-md mb-2 animate-pulse"></div>
                <div className="h-16 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </Section>
  );
} 