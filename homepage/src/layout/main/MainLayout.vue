<template>
  <div class="flex min-h-screen flex-col overflow-hidden">
    <NavBar :breadcrumb="breadcrumb" />
    <div class="flex-1">
      <slot />
    </div>
    <footer
      v-if="!hideFooter"
      class="td-footer"
    >
      <div class="td-footer-inner">
        <span class="td-footer-text">
          sqlingo is
          <a
            href="https://github.com/huydo862003/sqlingo/blob/master/COPYRIGHT_NOTICE"
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
          href="https://github.com/huydo862003/sqlingo/issues"
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
  hideFooter = false,
} = defineProps<{
  /** Navigation breadcrumb items */
  breadcrumb?: Crumb[];
  /** Whether the footer should be hidden */
  hideFooter?: boolean;
}>();
</script>

<style scoped>
.td-footer {
  background: var(--color-neutral-12);
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
  color: var(--color-primary-8);
  text-decoration: none;
  font-size: var(--text-sm);
}

.td-footer-link:hover {
  text-decoration: underline;
}
</style>
