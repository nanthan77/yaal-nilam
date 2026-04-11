'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FAQ } from '@/lib/faq-data';
import { useStore } from '@/lib/store';
import { localize } from '@/lib/translations';

export default function FAQSection({ faqs, title }: { faqs: FAQ[]; title?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { locale } = useStore();

  if (faqs.length === 0) return null;

  return (
    <section className="py-12 px-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {title ||
          localize(locale, {
            en: 'Frequently Asked Questions',
            ta: 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
          })}
      </h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900 pr-4">
                {locale === 'ta' && faq.question_ta ? faq.question_ta : faq.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 shrink-0 transition-transform ${
                  openIndex === i ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === i && (
              <div className="px-4 pb-4 text-gray-600 leading-relaxed">
                {locale === 'ta' && faq.answer_ta ? faq.answer_ta : faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
