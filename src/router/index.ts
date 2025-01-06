import { createRouter, createWebHistory } from 'vue-router';
import ControlPanel from '../components/ControlPanel.vue';
import Scoreboard from '../components/Scoreboard.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: ControlPanel
    },
    {
      path: '/scoreboard/:gameCode',
      component: Scoreboard
    }
  ]
});