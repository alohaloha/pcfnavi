'use client'

import { useState } from 'react'
import { FaqItem as FaqItemType } from '@/lib/faq'
import { ChevronDown } from 'lucide-react'

export default function FaqItem({ question, answer }: Pick<FaqItemType, 'question' | 'answer'>) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border rounded-lg shadow-sm bg-white overflow-hidden">
      <button
        className={`flex w-full justify-between items-center text-left font-bold text-lg p-4 ${
          isOpen ? 'bg-blue-50' : 'hover:bg-gray-50'
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <ChevronDown
          className={`transition-transform duration-200 h-5 w-5 flex-shrink-0 text-blue-600 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      
      <div 
        className={`transition-all duration-300 bg-gray-50 ${
          isOpen ? 'max-h-96 border-t' : 'max-h-0'
        }`}
      >
        <div className={`p-4 ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
          <p className="text-gray-700 whitespace-pre-line">{answer}</p>
        </div>
      </div>
    </div>
  )
} 