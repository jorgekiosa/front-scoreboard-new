import { ref } from 'vue';

export function useTimer() {
  const isRunning = ref(false);
  let timerInterval: NodeJS.Timeout | null = null;

  const startTimer = (minutes: number, seconds: number, onTick: (m: number, s: number) => void) => {
    if (isRunning.value) return;
    isRunning.value = true;
    
    timerInterval = setInterval(() => {
      if (seconds === 59) {
        minutes++;
        seconds = 0;
      } else {
        seconds++;
      }
      onTick(minutes, seconds);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    isRunning.value = false;
  };

  return {
    isRunning,
    startTimer,
    stopTimer
  };
}