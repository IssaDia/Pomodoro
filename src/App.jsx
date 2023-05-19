import { useEffect, useState } from "react";
import "./App.css";

let audio = new Audio("../src/audio/alarm.mp3");
function App() {
  const minutesToSeconds = (time) => {
    let minutes = parseInt(time, 10);

    return minutes * 60;
  };
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);

  const [time, setTime] = useState(minutesToSeconds(sessionLength));
  const [isRunning, setIsRunning] = useState(false);
  const [isSessionCountdown, setIsSessionCountdown] = useState(true);
  const [isBreakCountdown, setIsBreakCountdown] = useState(false);

  const Status = {
    BREAK: "break",
    SESSION: "session",
  };

  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const startCountdown = () => {
    setIsSessionCountdown(true);
    setIsRunning(!isRunning);
  };

  const resetCountdown = () => {
    setBreakLength(5);
    setSessionLength(25);
    setTime(minutesToSeconds(25));
    setIsRunning(false);
    setIsSessionCountdown(true);
    setIsBreakCountdown(false);
    const beepAudio = document.getElementById("beep");
    beepAudio.pause();
    beepAudio.currentTime = 0;
  };

  const increment = (status) => {
    switch (status) {
      case Status.BREAK:
        setBreakLength(breakLength + 1);
        break;
      case Status.SESSION:
        setSessionLength(sessionLength + 1);
        break;
    }
  };

  const decrement = (status) => {
    switch (status) {
      case Status.BREAK:
        setBreakLength(breakLength - 1);
        break;
      case Status.SESSION:
        setSessionLength(sessionLength - 1);
        break;
    }
  };

  useEffect(() => {
    if (isRunning) {
      let timer;
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    }
  }, [isRunning]);

  useEffect(() => {
    setTime(minutesToSeconds(sessionLength));
  }, [sessionLength]);

  useEffect(() => {
    if (time < 0 && isSessionCountdown) {
      setIsSessionCountdown(false);
      setIsBreakCountdown(true);
      setTime(minutesToSeconds(breakLength));
    }

    if (time < 0 && isBreakCountdown) {
      setIsBreakCountdown(false);
      setIsSessionCountdown(true);
      setTime(minutesToSeconds(sessionLength));
    }

    if (time === 0) {
      const beepAudio = document.getElementById("beep");
      beepAudio.play();
    }

    formatTime();
  }, [time, isRunning, isSessionCountdown, isBreakCountdown]);

  return (
    <div className="container">
      <div className="clock">
        <h1>25 + 5 Clock</h1>
        <div className="counter">
          <div className="break">
            <p id="break-label">Break Length</p>
            <div className="setting-break">
              <i
                id="break-decrement"
                className="fa fa-arrow-down fa-2x"
                onClick={breakLength > 1 ? () => decrement("break") : null}
              ></i>
              <span id="break-length">{breakLength}</span>
              <i
                id="break-increment"
                className="fa fa-arrow-up fa-2x"
                onClick={() => (breakLength <= 59 ? increment("break") : null)}
              ></i>
            </div>
          </div>
          <div className="session">
            <p id="session-label">Session Length</p>
            <div className="setting-session">
              <i
                id="session-decrement"
                className="fa fa-arrow-down fa-2x"
                onClick={sessionLength > 1 ? () => decrement("session") : null}
              ></i>
              <span id="session-length">{sessionLength}</span>
              <i
                id="session-increment"
                className="fa fa-arrow-up fa-2x"
                onClick={() =>
                  sessionLength <= 59 ? increment("session") : null
                }
              ></i>
            </div>
          </div>
        </div>
      </div>
      <div className="timer">
        <h2 id="timer-label">{isSessionCountdown ? "Session" : "Break"}</h2>
        <div>
          <p id="time-left">{formatTime()}</p>
        </div>
      </div>
      <div className="controls">
        <div className="play" onClick={startCountdown}>
          <i
            id="start_stop"
            className="fa fa-play fa-2x"
            onClick={startCountdown}
          ></i>
          <i className="fa fa-pause fa-2x"></i>
        </div>
        <div className="pause"></div>
        <div className="refresh">
          <i
            id="reset"
            className="fa fa-refresh fa-2x"
            onClick={resetCountdown}
          ></i>
        </div>
      </div>

      <div className="credits">
        <p>Coded by</p>
        <p>Issa Dia</p>
      </div>
      <audio id="beep" src="../src/audio/alarm.mp3"></audio>
    </div>
  );
}

export default App;
