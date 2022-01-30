import { useEffect, useState } from "react";

export default function Timer({ setTimeOut, questionNumber }) {
  const [timer, setTimer] = useState(100);

  useEffect(() => {
    if (timer === 0) return setTimeOut(true);
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, setTimeOut]);


  useEffect(() => {
    setTimer(100);
  }, [questionNumber]);
  return <div style={{ color: timer < 5 ? "red" : timer < 10 ? "tomato" : timer < 20 ? "orange" : timer < 30 ? "gold" : null }}> {timer}</div>
}