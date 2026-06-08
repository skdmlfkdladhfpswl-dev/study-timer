import { useState, useEffect, useRef } from 'react';
import type { Subject } from '../App';

interface TimerProps {
  currentSubject: Subject | null;
  onSessionComplete: () => void;
}

import { API_URL } from '../config';

interface TimerProps {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const startTimeRef = useRef<Date | null>(null);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const handleStart = () => {
    if (!currentSubject) {
      alert('Please select a subject first!');
      return;
    }
    setIsActive(true);
    if (!startTimeRef.current) {
      startTimeRef.current = new Date();
    }
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleStop = async () => {
    if (seconds > 0 && currentSubject && startTimeRef.current) {
      const endedAt = new Date();
      try {
        await fetch(`${API_URL}/sessions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject_id: currentSubject.id,
            duration_seconds: seconds,
            started_at: startTimeRef.current.toISOString(),
            ended_at: endedAt.toISOString(),
          }),
        });
        onSessionComplete();
      } catch (err) {
        console.error('Failed to save session', err);
      }
    }
    setIsActive(false);
    setSeconds(0);
    startTimeRef.current = null;
  };

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer-card">
      <div className="current-subject-display">
        {currentSubject ? (
          <span style={{ color: currentSubject.color }}>{currentSubject.name} 공부 중</span>
        ) : (
          <span>과목을 선택해주세요</span>
        )}
      </div>
      <div className="timer-display">{formatTime(seconds)}</div>
      <div className="timer-controls">
        {!isActive ? (
          <button onClick={handleStart} className="btn-start">Start</button>
        ) : (
          <button onClick={handlePause} className="btn-pause">Pause</button>
        )}
        <button onClick={handleStop} className="btn-stop">Stop & Save</button>
      </div>
    </div>
  );
};

export default Timer;
