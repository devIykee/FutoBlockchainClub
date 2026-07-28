"use client";

import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  deadline: Date;
  className?: string;
  blockClassName?: string;
}

export function CountdownTimer({
  deadline,
  className = '',
  blockClassName = '',
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const deadlineTime = deadline.getTime();
      const difference = deadlineTime - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  const blocks = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className={`flex gap-4 justify-center ${className}`}>
      {blocks.map((block) => (
        <div
          key={block.label}
          className={`flex flex-col items-center ${blockClassName}`}
        >
          <div className="bg-gray-900 text-white rounded-lg px-6 py-4 min-w-20 text-center">
            <div className="text-3xl md:text-4xl font-bold font-mono">
              {String(block.value).padStart(2, '0')}
            </div>
          </div>
          <span className="text-gray-600 dark:text-gray-400 text-sm font-semibold mt-2 uppercase tracking-wider">
            {block.label}
          </span>
        </div>
      ))}
    </div>
  );
}