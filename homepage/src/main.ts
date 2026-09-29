import {
  ViteSSG,
} from 'vite-ssg';
import {
  createPinia,
} from 'pinia';
import App from './App.vue';
import {
  routes,
} from './router';
import './style.css';

export const createApp = ViteSSG(
  App,
  {
    routes,
    base: import.meta.env.BASE_URL,
  },
  ({
    app, isClient,
  }) => {
    app.use(createPinia());

    if (isClient) {
      document.documentElement.classList.remove('dark');
    }
  },
);
