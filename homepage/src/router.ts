import {
  createRouter, createWebHistory,
} from 'vue-router';
import HomePage from './pages/home/HomePage.vue';

const playgroundImport = () => import('./pages/playground/PlaygroundPage.vue');

export function preloadPlayground () {
  playgroundImport();
}

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomePage,
    },
    {
      path: '/playground/',
      component: playgroundImport,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
});
