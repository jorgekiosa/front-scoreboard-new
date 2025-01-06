<template>
  <div class="container mt-4">
    <div class="card">
      <div class="card-header">
        <h3>Tennis Scoreboard Control Panel</h3>
      </div>
      <div class="card-body">
        <!-- Game Settings -->
        <div class="row mb-4">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Player 1 Name</label>
              <input 
                v-model="store.player1.name" 
                class="form-control" 
                type="text"
                placeholder="Enter player 1 name"
              >
            </div>
            <div class="mb-3">
              <label class="form-label">Player 2 Name</label>
              <input 
                v-model="store.player2.name" 
                class="form-control" 
                type="text"
                placeholder="Enter player 2 name"
              >
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Sponsor Name</label>
              <input 
                v-model="store.settings.sponsorName" 
                class="form-control" 
                type="text"
                placeholder="Enter sponsor name"
              >
            </div>
            <div class="mb-3">
              <label class="form-label">Game Code: {{ store.settings.gameCode }}</label>
              <button @click="openScoreboard" class="btn btn-primary ms-2">
                Open Scoreboard
              </button>
            </div>
          </div>
        </div>

        <!-- Timer Controls -->
        <TimerControls />

        <!-- Game Type Settings -->
        <div class="row mb-4">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Set Type</label>
              <select v-model="store.settings.setType" class="form-select">
                <option value="normal">Normal Set</option>
                <option value="running">Running Set</option>
              </select>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Deuce Type</label>
              <select v-model="store.settings.deuceType" class="form-select">
                <option value="advantage">Advantage</option>
                <option value="goldenPoint">Golden Point</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Score Controls -->
        <div class="row">
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h5>{{ store.player1.name || 'Player 1' }}</h5>
              </div>
              <div class="card-body">
                <button @click="store.addPoint(1)" class="btn btn-success btn-lg">
                  Add Point
                </button>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h5>{{ store.player2.name || 'Player 2' }}</h5>
              </div>
              <div class="card-body">
                <button @click="store.addPoint(2)" class="btn btn-success btn-lg">
                  Add Point
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '../stores/gameStore';
import TimerControls from './TimerControls.vue';

const store = useGameStore();

const openScoreboard = () => {
  const url = `/scoreboard/${store.settings.gameCode}`;
  window.open(url, '_blank');
};
</script>