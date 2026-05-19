"use client";

import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: number;
  showCount?: boolean;
  count?: number;
}

export default function StarRating({
  rating,
  onRatingChange,
  readonly = false,
  size = 20,
  showCount = false,
  count = 0,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = (hoverRating || rating) >= star;
          return (
            <button
              key={star}
              type="button"
              onClick={() => handleClick(star)}
              onMouseEnter={() => !readonly && setHoverRating(star)}
              onMouseLeave={() => !readonly && setHoverRating(0)}
              disabled={readonly}
              className={`transition-all ${
                readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
              }`}
              aria-label={`${star} نجوم`}
            >
              <Star
                size={size}
                className={`${
                  isFilled
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-slate-200 text-slate-200"
                } transition-colors`}
              />
            </button>
          );
        })}
      </div>
      {showCount && count > 0 && (
        <span className="text-sm text-slate-500 font-bold">
          ({count} تقييم)
        </span>
      )}
    </div>
  );
}
