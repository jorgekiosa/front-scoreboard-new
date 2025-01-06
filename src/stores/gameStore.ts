import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Player, GameSettings } from '../types/tennis';
import { socket } from '../socket';

export const useGameStore = defineStore('game', () => {
  const player1 = ref<Player>({
    name: '',
    points: 0,
    games: [0],
    tiebreakPoints: 0
  });

  const player2 = ref<Player>({
    name: '',
    points: 0,
    games: [0],
    tiebreakPoints: 0
  });

  const settings = ref<GameSettings>({
    setType: 'normal',
    deuceType: 'advantage',
    maxSets: 3,
    sponsorName: '',
    showScoreboard: true,
    gameCode: Math.random().toString(36).substring(2, 8)
  });

  const timer = ref({
    minutes: 0,
    seconds: 0
  });

  // Listen for game updates from socket
  socket.on('gameUpdated', (data) => {
    player1.value = data.player1;
    player2.value = data.player2;
    settings.value = data.settings;
    timer.value = data.timer;
  });

  const addPoint = (playerNum: 1 | 2) => {
    const player = playerNum === 1 ? player1.value : player2.value;
    const opponent = playerNum === 1 ? player2.value : player1.value;

    if (settings.value.setType === 'running') {
      player.points++;
      if (player.points >= 9) {
        handleGameWin(playerNum);
      }
    } else {
      // Normal tennis scoring
      if (isTiebreak.value) {
        player.tiebreakPoints++;
        if (player.tiebreakPoints >= 7 && player.tiebreakPoints - opponent.tiebreakPoints >= 2) {
          handleGameWin(playerNum);
        }
      } else {
        // Regular game scoring
        switch (player.points) {
          case 0: player.points = 15; break;
          case 15: player.points = 30; break;
          case 30: player.points = 40; break;
          case 40:
            if (opponent.points < 40) {
              handleGameWin(playerNum);
            } else if (settings.value.deuceType === 'goldenPoint') {
              handleGameWin(playerNum);
            } else {
              player.points = 'AD';
            }
            break;
          default:
            if (player.points === 'AD') {
              handleGameWin(playerNum);
            } else if (opponent.points === 'AD') {
              opponent.points = 40;
            } else {
              player.points = 'AD';
            }
        }
      }
    }

    // Emit game update after any point change
    emitGameUpdate();
  };

  const handleGameWin = (playerNum: 1 | 2) => {
    const player = playerNum === 1 ? player1.value : player2.value;
    const opponent = playerNum === 1 ? player2.value : player1.value;
    
    const currentSet = player.games.length - 1;
    player.games[currentSet]++;
    
    // Reset points for new game
    player.points = 0;
    opponent.points = 0;
    player.tiebreakPoints = 0;
    opponent.tiebreakPoints = 0;

    // Check for set win
    if (player.games[currentSet] >= 6) {
      if (player.games[currentSet] >= opponent.games[currentSet] + 2) {
        handleSetWin(playerNum);
      } else if (player.games[currentSet] === 7) {
        handleSetWin(playerNum);
      }
    }

    emitGameUpdate();
  };

  const handleSetWin = (playerNum: 1 | 2) => {
    if (player1.value.games.length < settings.value.maxSets) {
      player1.value.games.push(0);
      player2.value.games.push(0);
      emitGameUpdate();
    }
  };

  const emitGameUpdate = () => {
    socket.emit('gameUpdate', {
      code: settings.value.gameCode,
      player1: player1.value,
      player2: player2.value,
      settings: settings.value,
      timer: timer.value
    });
  };

  const isTiebreak = computed(() => {
    const currentSet = player1.value.games.length - 1;
    return player1.value.games[currentSet] === 6 && 
           player2.value.games[currentSet] === 6;
  });

  return {
    player1,
    player2,
    settings,
    timer,
    addPoint,
    isTiebreak,
    emitGameUpdate
  };
});