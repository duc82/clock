import { useCallback, useEffect, useRef, useState } from "react";
import beep from "./assets/beep.mp3";

type Clock = "break" | "session";

const initialValues = {
  breakLength: 5,
  sessionLength: 25,
  isPause: true,
  currentClock: "session" as Clock,
  isTimerLessThanOneMinute: false,
};

const formatTime = (miliseconds: number) => {
  const seconds = Math.floor(miliseconds / 1000);
  const hours = Math.floor(seconds / 60 / 60);
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const remainingSeconds = seconds % 60;

  return `${
    hours === 1 ? "60" : minutes.toString().padStart(2, "0")
  }:${remainingSeconds.toString().padStart(2, "0")}`;
};

const minutesToMiliseconds = (n: number) => {
  return n * 60 * 1000;
};

const App = () => {
  const [breakLength, setBreakLength] = useState(initialValues.breakLength);
  const [sessionLength, setSessionLength] = useState(
    initialValues.sessionLength
  );
  const [timer, setTimer] = useState(minutesToMiliseconds(sessionLength));
  const [currentClock, setCurrentClock] = useState<Clock>(
    initialValues.currentClock
  );
  const [isPause, setIsPause] = useState(initialValues.isPause);
  const [isTimerLessThanOneMinute, setIsTimerLessThanOneMinute] = useState(
    initialValues.isTimerLessThanOneMinute
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const handleBreakLength = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!isPause) return;
    const id = e.currentTarget.id;
    const value = id === "break-decrement" ? -1 : 1;
    const newBreak = Math.max(Math.min(breakLength + value, 60), 1);
    setBreakLength(newBreak);
    setTimer(minutesToMiliseconds(newBreak));
  };

  const handleSessionLength = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!isPause) return;
    const id = e.currentTarget.id;
    const value = id === "session-decrement" ? -1 : 1;
    const newSession = Math.max(Math.min(sessionLength + value, 60), 1);
    setSessionLength(newSession);
    setTimer(minutesToMiliseconds(newSession));
  };

  const handlePlayOrPause = () => {
    // running
    if (isPause) {
      setIsPause(false);
    } else {
      setIsPause(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  };

  const reset = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsPause(true);
    setBreakLength(initialValues.breakLength);
    setSessionLength(initialValues.sessionLength);
    setTimer(minutesToMiliseconds(initialValues.sessionLength));
    setIsTimerLessThanOneMinute(initialValues.isTimerLessThanOneMinute);
    setCurrentClock(initialValues.currentClock);
  };

  const changeClock = useCallback(() => {
    setTimer(
      minutesToMiliseconds(
        currentClock === "session" ? breakLength : sessionLength
      )
    );
    setIsTimerLessThanOneMinute(false);
    setCurrentClock(currentClock === "session" ? "break" : "session");
  }, [breakLength, sessionLength, currentClock]);

  useEffect(() => {
    if (isPause) return;

    timeoutRef.current = setTimeout(() => {
      if (timer <= 0) {
        audioRef.current?.play();
        clearTimeout(timeoutRef.current!);
        changeClock();
        return;
      }

      if (timer <= 60 * 1000 && !isTimerLessThanOneMinute) {
        setIsTimerLessThanOneMinute(true);
      }

      setTimer((prev) => prev - 1000);
    }, 1000);
  }, [timer, isPause, isTimerLessThanOneMinute, changeClock]);

  return (
    <main className="container">
      <h1 className="title">25 + 5 Clock</h1>
      <div className="settings">
        <div>
          <p id="break-label">Break Length</p>
          <div className="center">
            <button
              type="button"
              id="break-decrement"
              onClick={handleBreakLength}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M13.0001 16.1716L18.3641 10.8076L19.7783 12.2218L12.0001 20L4.22192 12.2218L5.63614 10.8076L11.0001 16.1716V4H13.0001V16.1716Z"></path>
              </svg>
            </button>
            <span id="break-length">{breakLength}</span>
            <button
              type="button"
              id="break-increment"
              onClick={handleBreakLength}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M13.0001 7.82843V20H11.0001V7.82843L5.63614 13.1924L4.22192 11.7782L12.0001 4L19.7783 11.7782L18.3641 13.1924L13.0001 7.82843Z"></path>
              </svg>
            </button>
          </div>
        </div>
        <div>
          <p id="session-label">Session Length</p>
          <div className="center">
            <button
              type="button"
              id="session-decrement"
              onClick={handleSessionLength}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M13.0001 16.1716L18.3641 10.8076L19.7783 12.2218L12.0001 20L4.22192 12.2218L5.63614 10.8076L11.0001 16.1716V4H13.0001V16.1716Z"></path>
              </svg>
            </button>
            <span id="session-length">{sessionLength}</span>
            <button
              type="button"
              id="session-increment"
              onClick={handleSessionLength}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M13.0001 7.82843V20H11.0001V7.82843L5.63614 13.1924L4.22192 11.7782L12.0001 4L19.7783 11.7782L18.3641 13.1924L13.0001 7.82843Z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <audio src={beep} id="beep" ref={audioRef} hidden></audio>

      <div className={`timer-box ${isTimerLessThanOneMinute ? "red" : ""}`}>
        <p id="timer-label">{currentClock}</p>
        <p id="time-left">{formatTime(timer)}</p>
      </div>

      <div className="control">
        <button type="button" id="start_stop" onClick={handlePlayOrPause}>
          {isPause ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19.376 12.4161L8.77735 19.4818C8.54759 19.635 8.23715 19.5729 8.08397 19.3432C8.02922 19.261 8 19.1645 8 19.0658V4.93433C8 4.65818 8.22386 4.43433 8.5 4.43433C8.59871 4.43433 8.69522 4.46355 8.77735 4.5183L19.376 11.584C19.6057 11.7372 19.6678 12.0477 19.5146 12.2774C19.478 12.3323 19.4309 12.3795 19.376 12.4161Z"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M6 5H8V19H6V5ZM16 5H18V19H16V5Z"></path>
            </svg>
          )}
        </button>
        <button type="button" id="reset" onClick={reset}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M5.46257 4.43262C7.21556 2.91688 9.5007 2 12 2C17.5228 2 22 6.47715 22 12C22 14.1361 21.3302 16.1158 20.1892 17.7406L17 12H20C20 7.58172 16.4183 4 12 4C9.84982 4 7.89777 4.84827 6.46023 6.22842L5.46257 4.43262ZM18.5374 19.5674C16.7844 21.0831 14.4993 22 12 22C6.47715 22 2 17.5228 2 12C2 9.86386 2.66979 7.88416 3.8108 6.25944L7 12H4C4 16.4183 7.58172 20 12 20C14.1502 20 16.1022 19.1517 17.5398 17.7716L18.5374 19.5674Z"></path>
          </svg>
        </button>
      </div>

      <div className="copyright">
        <p>Designed and Coded by</p>
        <a href="https://github.com/duc82" target="_blank">
          Duc Dang
        </a>
      </div>
    </main>
  );
};

export default App;
