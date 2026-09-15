<template>
  <div class="flex min-h-screen flex-col overflow-hidden">
    <NavBar :breadcrumb="breadcrumb" />
    <div class="flex-1">
      <slot />
    </div>
    <footer class="td-footer">
      <div class="td-footer-inner">
        <span class="td-footer-text">
          sqlingo.js is
          <a
            href="https://github.com/huydo862003/sqlingo.js/blob/master/COPYRIGHT_NOTICE"
            target="_blank"
            rel="noopener noreferrer"
            class="td-footer-link"
          >MIT licensed</a>.
          Based on
          <a
            href="https://github.com/tobymao/sqlglot"
            target="_blank"
            rel="noopener noreferrer"
            class="td-footer-link"
          >SQLGlot</a> by Toby Mao, also MIT.
        </span>
        <div class="flex-1" />
        <a
          href="https://github.com/huydo862003/sqlingo.js/issues"
          target="_blank"
          rel="noopener noreferrer"
          class="td-footer-link"
        >Report an issue</a>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import NavBar from './NavBar.vue';

interface Crumb {
  label: string;
  href?: string;
}

const {
  breadcrumb = [],
} = defineProps<{
  /** Navigation breadcrumb items */
  breadcrumb?: Crumb[];
}>();
</script>

<style scoped>
.td-footer {
  border-top: 1px solid var(--gui-neutral-border-subtle);
  background: var(--gui-neutral-bg-subtle);
  flex-shrink: 0;
}

.td-footer-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 24px 28px;
}

.td-footer-text {
  font-size: var(--text-sm);
  color: var(--gui-neutral-border-strong);
}

.td-footer-link {
  color: var(--gui-primary-solid);
  text-decoration: none;
  font-size: var(--text-sm);
}

.td-footer-link:hover {
  color: var(--gui-primary-solid-hover);
  text-decoration: underline;
}
</style>
