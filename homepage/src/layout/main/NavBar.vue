<template>
  <nav class="td-navbar">
    <div class="td-navbar-inner">
      <RouterLink
        to="/"
        class="td-brand"
      >
        <img
          :src="`${base}icon.svg`"
          alt="sqlingo.js"
          class="size-8 rounded-md"
        >
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
          :class="{ 'is-active': $route.path === '/' }"
        >
          Home
        </RouterLink>
        <RouterLink
          to="/playground/"
          class="td-nav-link"
          :class="{ 'is-active': $route.path.startsWith('/playground') }"
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
