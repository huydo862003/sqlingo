import type {
  RouteRecordRaw,
} from 'vue-router';
import HomePage from './pages/home/HomePage.vue';

const playgroundImport = () => import('./pages/playground/PlaygroundPage.vue');

export function preloadPlayground () {
  playgroundImport();
}

export const routes: RouteRecordRaw[] = [
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
];
