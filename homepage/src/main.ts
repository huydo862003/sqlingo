import {
  ViteSSG,
} from 'vite-ssg';
import {
  createPinia,
} from 'pinia';
import {
  useTheme,
} from '@hdnax/genuix';
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
      useTheme();
    }
  },
);
