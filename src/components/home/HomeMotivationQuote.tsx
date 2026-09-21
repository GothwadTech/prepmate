import React, { useState } from 'react';
import { Badge } from '../common/Badge';
import { LightbulbIcon, RefreshCwIcon } from '../icons/SvgIcons';

const NEET_QUOTES = [
  {
    quote: 'Doctor banna koi aam baat nahi, har din ka ek-ek ghanta MBBS seat tak le jaata hai.',
    author: 'Prepmate Aspirant Wisdom',
    tag: 'Dedication',
  },
  {
    quote: 'NCERT ki har ek line ek question hai. Padho aise jaise NEET ka paper tumne hi banaya ho.',
    author: 'AIIMS Toppers Strategy',
    tag: 'Biology & Chem',
  },
  {
    quote: 'Consistency is more powerful than intensity. 6 hours daily beats 14 hours once a week.',
    author: 'Study Habit Rule',
    tag: 'Discipline',
  },
  {
    quote: 'Jab thak jao toh aaraam kar lo, par ruko mat. White coat and stethoscope are waiting for you.',
    author: 'Medical Dream',
    tag: 'Motivation',
  },
  {
    quote: 'Roz ke 45 Physics numericals solve karna exam hall me 180 marks ko possible bana deta hai.',
    author: 'Physics Drill',
    tag: 'Problem Solving',
  },
  {
    quote: 'Success in NEET is not an accident; it is hard work, perseverance, learning, and sacrifice.',
    author: 'NEET Mantra',
    tag: 'Focus',
  },
];

export const HomeMotivationQuote: React.FC = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isRotatingQuote, setIsRotatingQuote] = useState(false);

  const handleNextQuote = () => {
    setIsRotatingQuote(true);
    setTimeout(() => {
      setQuoteIndex((prev) => (prev + 1) % NEET_QUOTES.length);
      setIsRotatingQuote(false);
    }, 200);
  };

  const currentQuote = NEET_QUOTES[quoteIndex];

  return (
    <div className="quote-box" id="daily-motivation-quote-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <LightbulbIcon size={18} color="var(--primary)" />
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
            NEET Daily Inspiration
          </span>
          <Badge variant="neutral">{currentQuote.tag}</Badge>
        </div>
        <button
          type="button"
          className="btn-icon"
          onClick={handleNextQuote}
          title="Next inspiring quote"
          aria-label="Refresh motivational quote"
          style={{ width: '28px', height: '28px' }}
          id="refresh-quote-btn"
        >
          <div style={{ transform: isRotatingQuote ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
            <RefreshCwIcon size={14} />
          </div>
        </button>
      </div>

      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-primary)',
          fontStyle: 'italic',
          lineHeight: 1.5,
          margin: '4px 0 2px 0',
        }}
      >
        &quot;{currentQuote.quote}&quot;
      </p>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
          — {currentQuote.author}
        </span>
      </div>
    </div>
  );
};
