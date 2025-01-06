<template>
  <div class="scoreboard">
    <div class="sponsor-banner" v-if="store.settings.sponsorName">
      Sponsored by: {{ store.settings.sponsorName }}
    </div>
    
    <div class="timer">
      {{ formatTime(store.timer.minutes) }}:{{ formatTime(store.timer.seconds) }}
    </div>

    <div class="players">
      <div class="player" :class="{ 'serving': isServing(1) }">
        <div class="name">{{ store.player1.name || 'Player 1' }}</div>
        <div class="points">{{ formatPoints(store.player1.points) }}</div>
        <div class="games">
          <span 
            v-for="(game, index) in store.player1.games" 
            :key="index"
            :class="{ 'current-set': index === store.player1.games.length - 1 }"
          >
            {{ game }}
          </span>
        </div>
        <div class="tiebreak" v-if="store.isTiebreak">
          {{ store.player1.tiebreakPoints }}
        </div>
      </div>

      <div class="player" :class="{ 'serving': isServing(2) }">
        <div class="name">{{ store.player2.name || 'Player 2' }}</div>
        <div class="points">{{ formatPoints(store.player2.points) }}</div>
        <div class="games">
          <span 
            v-for="(game, index) in store.player2.games" 
            :key="index"
            :class="{ 'current-set': index === store.player2.games.length - 1 }"
          >
            {{ game }}
          </span>
        </div>
        <div class="tiebreak" v-if="store.isTiebreak">
          {{ store.player2.tiebreakPoints }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '../stores/gameStore';
import { onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { socket } from '../socket';

const store = useGameStore();
const route = useRoute();

const formatTime = (value: number): string => {
  return value.toString().padStart(2, '0');
};

const formatPoints = (points: number | string): string => {
  if (typeof points === 'string') return points;
  if (store.settings.setType === 'running') return points.toString();
  switch (points) {
    case 0: return '0';
    case 15: return '15';
    case 30: return '30';
    case 40: return '40';
    default: return '0';
  }
};

const isServing = (playerNum: number): boolean => {
  const totalGames = store.player1.games.reduce((a, b) => a + b, 0) + 
                    store.player2.games.reduce((a, b) => a + b, 0);
  return totalGames % 2 === (playerNum === 1 ? 0 : 1);
};

onMounted(() => {
  const gameCode = route.params.gameCode as string;
  socket.emit('joinGame', gameCode);
});

// Clean up socket connection on component unmount
onUnmounted(() => {
  socket.off('gameUpdated');
});
</script>