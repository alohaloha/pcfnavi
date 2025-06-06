'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";

export default function CalendarPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">カレンダー</h1>
      
      <Card>
        <div className="aspect-[4/3] w-full">
          {isClient ? (
            <iframe
              src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FTokyo&showPrint=0&showCalendars=0&showTitle=0&src=MThkOWIzMjRiNWJiMmQ4OWJiM2IyNWE2ZmE5ZThlYzUzNTlkNzQwNzk1MGM0ZjM3ZThlMTgxZDUxYTg5OTA4MkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23D50000"
              style={{ border: 0 }}
              width="100%"
              height="100%"
              className="rounded-lg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-sm text-gray-600">カレンダーを読み込み中...</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
} 