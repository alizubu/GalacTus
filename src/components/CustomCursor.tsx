'use client';

import {
  CursorProvider,
  Cursor,
} from '@/components/animate-ui/primitives/animate/cursor';

export default function CustomCursor() {
  return (
    <CursorProvider global>
      {/* Fast-responding arrow cursor */}
      <Cursor>
        <svg
          width="22"
          height="22"
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.35))',
          }}
        >
          <path
            fill="white"
            stroke="rgba(0,0,0,0.6)"
            strokeWidth="2"
            strokeLinejoin="round"
            d="M1.8 4.4 7 36.2c.3 1.8 2.6 2.3 3.6.8l3.9-5.7c1.7-2.5 4.5-4.1 7.5-4.3l6.9-.5c1.8-.1 2.5-2.4 1.1-3.5L5 2.5c-1.4-1.1-3.5 0-3.3 1.9Z"
          />
        </svg>
      </Cursor>
    </CursorProvider>
  );
}
