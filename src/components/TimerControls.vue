<template>
  <div class="timer-controls">
    <div class="d-flex align-items-center gap-2 mb-3">
      <button 
        @click="toggleTimer" 
        class="btn"
        :class="isRunning ? 'btn-danger' : 'btn-success'"
      >
        {{ isRunning ? 'Stop' : 'Start' }} Timer
      </button>
      <button @click="adjustTimer('minutes', 1)" class="btn btn-secondary">
        +1 Min
      </button>
      <button @click="adjustTimer('seconds', 30)" class="btn btn-secondary">
        +30 Sec
      </button>
      <button @click="resetTimer" class="btn btn-warning">
        Reset Timer
      </button>
    </div>
    <div class="current-time">
      Current Time: {{ formatTime(store.timer.minutes) }}:{{ formatTime(store.timer.seconds) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '../stores/gameStore';
import { useTimer } from '../composables/useTimer';
import { socket } from '../socket';

const store = useGameStore();
const { isRunning, startTimer, stopTimer } = useTimer();

const formatTime = (value: number): string => {
  return value.toString().padStart(2, '0');
};

const toggleTimer = () => {
  if (isRunning.value) {
    stopTimer();
  } else {
    startTimer(store.timer.minutes, store.timer.seconds, (minutes, seconds) => {
      store.timer.minutes = minutes;
      store.timer.seconds = seconds;
      emitTimerUpdate();
    });
  }
};

const adjustTimer = (unit: 'minutes' | 'seconds', value: number) => {
  if (unit === 'minutes') {
    store.timer.minutes += value;
  } else {
    store.timer.seconds += value;
    if (store.timer.seconds >= 60) {
      store.timer.minutes += Math.floor(store.timer.seconds / 60);
      store.timer.seconds = store.timer.seconds % 60;
    }
  }
  emitTimerUpdate();
};

const resetTimer = () => {
  stopTimer();
  store.timer.minutes = 0;
  store.timer.seconds = 0;
  emitTimerUpdate();
};

const emitTimerUpdate = () => {
  socket.emit('gameUpdate', {
    code: store.settings.gameCode,
    player1: store.player1,
    player2: store.player2,
    settings: store.settings,
    timer: store.timer
  });
};
</script>

<style scoped>
.timer-controls {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.current-time {
  font-size: 1.2rem;
  font-weight: bold;
  color: #495057;
}
</style>