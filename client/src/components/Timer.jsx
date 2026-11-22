import { useEffect, useRef, useState } from 'react';

const TOTAL_SECONDS = 10 * 60; // 10 minutes

export default function Timer({ onExpire }) {
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpireRef.current();
      return;
    }

    const id = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearInterval(id);
  }, [secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const seconds = (secondsLeft % 60).toString().padStart(2, '0');

  const isWarning = secondsLeft <= 60;

  return (
    <span className={`font-mono font-semibold text-sm ${isWarning ? 'text-error' : 'text-base-content'}`}>
      {minutes}:{seconds}
    </span>
  );
}
