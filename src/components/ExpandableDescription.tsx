"use client";

import { useState, useRef, useEffect } from "react";

interface ExpandableDescriptionProps {
  text: string;
  className?: string;
}

export default function ExpandableDescription({ text, className = "" }: ExpandableDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || expanded) return;

    const check = () => setIsClamped(el.scrollHeight > el.clientHeight);
    check();

    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [expanded, text]);

  return (
    <div className="mb-4">
      <p
        ref={ref}
        className={`text-gray-600 dark:text-gray-300 ${className} ${expanded ? "" : "line-clamp-3"}`}
      >
        {text}
      </p>
      {(isClamped || expanded) && (
        <button
          onClick={() => setExpanded(prev => !prev)}
          className="mt-1.5 text-sm font-medium flex items-center gap-1 transition-colors duration-200"
          style={{ color: "var(--dr-amber-deep)" }}
        >
          {expanded ? "Show less" : "Read more"}
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
    </div>
  );
}
