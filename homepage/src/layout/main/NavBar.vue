<template>
  <nav class="td-navbar">
    <div class="td-navbar-inner">
      <RouterLink
        to="/"
        class="td-brand"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" class="size-8 rounded-md" aria-label="sqlingo.js" role="img">
          <path d="M7 15c0-2 1.2-3.5 3-4 1-.2 2 .3 2.5 1.3.5 1.2-.1 2.8-1.2 3.3-1.3.5-3 .4-3.8-.2-.3-.2-.5-.3-.5-.4z" fill="currentColor" stroke="currentColor" stroke-width="0.7" fill-opacity="0.18" stroke-opacity="0.65" />
          <path d="M12 9c1-.9 2.5-.7 3.5.2.8.7 1.2 1.9.6 3-.5 1-1.7 1.5-2.9 1.2-1.3-.3-1.9-1.5-1.7-2.7.1-.6.2-1.3.5-1.7z" fill="currentColor" stroke="currentColor" stroke-width="0.7" fill-opacity="0.12" stroke-opacity="0.6" />
          <path d="M18 12c1.3-.4 2.7 0 3.4 1.1.6 1 .4 2.4-.4 3.2-.9.8-2.2.9-3.1.3-1-.7-1.3-1.9-.8-3 .2-.6.5-1.3.9-1.6z" fill="currentColor" stroke="currentColor" stroke-width="0.7" fill-opacity="0.22" stroke-opacity="0.7" />
          <path d="M9 19c-.2-.9.4-1.9 1.5-2.2 1.2-.3 2.6.4 3 1.6.3 1-.1 2.2-1 2.7-1.1.6-2.5.3-3-.6-.2-.4-.4-.9-.5-1.5z" fill="currentColor" stroke="currentColor" stroke-width="0.7" fill-opacity="0.14" stroke-opacity="0.6" />
          <path d="M16 17.5c.7-1 2.1-1.3 3.2-.6 1 .6 1.4 1.8 1 2.8-.4 1-1.4 1.7-2.5 1.5-1.2-.2-2-1.1-2-2.2 0-.5.1-1 .3-1.5z" fill="currentColor" stroke="currentColor" stroke-width="0.7" fill-opacity="0.20" stroke-opacity="0.65" />
          <path d="M11 23c-.1-.7.3-1.5 1.2-1.8 1-.2 2.1.3 2.4 1.2.2.8-.2 1.7-1 2-1 .3-1.9-.2-2.3-.8-.2-.2-.3-.4-.3-.6z" fill="currentColor" stroke="currentColor" stroke-width="0.7" fill-opacity="0.10" stroke-opacity="0.55" />
          <path d="M8 14c1.2-.6 2.8-.2 3.6.8" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" opacity="0.35" />
          <path d="M13 10.5c1 .4 1.7 1.5 1.5 2.5" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" opacity="0.35" />
          <path d="M17 14c.9.2 1.7.9 1.7 1.9" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" opacity="0.35" />
          <path d="M10.5 19.5c.8-.2 1.8.1 2.3 1" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" opacity="0.35" />
          <ellipse cx="23" cy="9" rx="3.5" ry="2.5" fill="currentColor" fill-opacity="0.85" transform="rotate(-20 23 9)" />
          <circle cx="22" cy="8" r="0.8" fill="currentColor" fill-opacity="0.25" />
          <circle cx="22" cy="8" r="0.35" fill="currentColor" />
          <circle cx="24.2" cy="7.5" r="0.8" fill="currentColor" fill-opacity="0.25" />
          <circle cx="24.2" cy="7.5" r="0.35" fill="currentColor" />
          <path d="M25 10.5 L27 12.5 M27 12.5 L26 14 M27 12.5 L28.5 13.5" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" opacity="0.7" />
        </svg>
        <span class="td-brand-name">sqlingo.js</span>
      </RouterLink>

      <GBreadcrumb v-if="breadcrumb.length">
        <GBreadcrumbItem
          v-for="crumb in breadcrumb"
          :key="crumb.label"
          as="a"
          :href="crumb.href"
        >
          {{ crumb.label }}
        </GBreadcrumbItem>
      </GBreadcrumb>

      <div class="flex-1" />

      <div class="td-nav-links">
        <RouterLink
          to="/"
          class="td-nav-link"
          :class="{
            'is-active': $route.path === '/',
          }"
        >
          Home
        </RouterLink>
        <RouterLink
          to="/playground/"
          class="td-nav-link"
          :class="{
            'is-active': $route.path.startsWith('/playground'),
          }"
          @pointerenter.once="preloadPlayground"
        >
          Playground
        </RouterLink>
        <a
          :href="`${base}api-reference/`"
          class="td-nav-link"
        >
          API reference
        </a>
        <a
          href="https://github.com/huydo862003/sqlingo.js"
          target="_blank"
          rel="noopener noreferrer"
          class="td-nav-link hidden sm:block"
        >
          GitHub
        </a>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import {
  RouterLink,
} from 'vue-router';
import {
  GBreadcrumb, GBreadcrumbItem,
} from '@hdnax/genuix';
import {
  preloadPlayground,
} from '@/router';

const {
  breadcrumb = [],
} = defineProps<{
  /** Navigation breadcrumb items */
  breadcrumb?: Crumb[];
}>();

const base = import.meta.env.BASE_URL;

interface Crumb {
  label: string;
  href?: string;
}
</script>

<style scoped>
.td-navbar {
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: 1px solid var(--gui-neutral-border-subtle);
  background: var(--gui-neutral-bg-subtle);
}

.td-navbar-inner {
  display: flex;
  align-items: center;
  height: 56px;
  gap: 28px;
  padding: 0 28px;
}

.td-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--gui-primary-solid);
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-default);
}

.td-brand:hover {
  color: var(--gui-primary-solid-hover);
}

.td-brand-name {
  font-size: var(--text-sm);
  font-weight: 600;
  letter-spacing: -0.024em;
}

.td-nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
}

.td-nav-link {
  padding: 6px 12px;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--gui-neutral-border-strong);
  text-decoration: none;
  transition:
    color var(--duration-fast) var(--ease-default),
    background-color var(--duration-fast) var(--ease-default);
}

.td-nav-link:hover {
  color: var(--gui-neutral-fg);
  background-color: var(--gui-neutral-bg-hover);
}

.td-nav-link.is-active {
  color: var(--gui-neutral-fg);
  font-weight: 600;
}
</style>
