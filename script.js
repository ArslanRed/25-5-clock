const { useState, useEffect, useRef } = React;

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const intervalRef = useRef(null);
  const beepRef = useRef(null);

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  useEffect(() => {
    if (timeLeft === 0) {
      beepRef.current.play();
      if (onBreak) {
        setTimeLeft(sessionLength * 60);
        setOnBreak(false);
      } else {
        setTimeLeft(breakLength * 60);
        setOnBreak(true);
      }
    }
  }, [timeLeft, onBreak, breakLength, sessionLength]);

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setOnBreak(false);
    beepRef.current.pause();
    beepRef.current.currentTime = 0;
  };

  const handleStartStop = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    } else {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      setIsRunning(true);
    }
  };

  const handleBreakChange = (amount) => {
    if (isRunning) return;
    if (breakLength + amount >= 1 && breakLength + amount <= 60) {
      setBreakLength(breakLength + amount);
    }
  };

  const handleSessionChange = (amount) => {
    if (isRunning) return;
    if (sessionLength + amount >= 1 && sessionLength + amount <= 60) {
      setSessionLength(sessionLength + amount);
      setTimeLeft((sessionLength + amount) * 60);
    }
  };

  return (
    <div className="app">
      <h1>25 + 5 Clock</h1>

      <div id="break-session-wrapper">
        <div className="length-control">
          <h2 id="break-label">Break Length</h2>
          <button id="break-decrement" onClick={() => handleBreakChange(-1)}>
            -
          </button>
          <span id="break-length">{breakLength}</span>
          <button id="break-increment" onClick={() => handleBreakChange(1)}>
            +
          </button>
        </div>

        <div className="length-control">
          <h2 id="session-label">Session Length</h2>
          <button id="session-decrement" onClick={() => handleSessionChange(-1)}>
            -
          </button>
          <span id="session-length">{sessionLength}</span>
          <button id="session-increment" onClick={() => handleSessionChange(1)}>
            +
          </button>
        </div>
      </div>

      <div className="timer">
        <h2 id="timer-label">{onBreak ? "Break" : "Session"}</h2>
        <div id="time-left">{formatTime(timeLeft)}</div>

        <button id="start_stop" onClick={handleStartStop}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button id="reset" onClick={handleReset}>Reset</button>
      </div>

      <audio
        id="beep"
        preload="auto"
        src="https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3"
        ref={beepRef}
      />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
