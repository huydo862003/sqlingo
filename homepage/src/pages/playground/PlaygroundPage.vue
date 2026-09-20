<template>
  <MainLayout>
    <main class="mx-auto max-w-[1040px] px-8">
      <div class="mt-12 mb-8">
        <h1 class="td-pg-title">
          Playground
        </h1>
        <p class="td-pg-desc">
          Everything runs locally in your browser. Nothing is sent anywhere.
        </p>
        <div class="td-pg-tabs">
          <button
            type="button"
            class="td-pg-tab"
            :class="{
              'td-pg-tab--active': tab === Tab.Transpile,
            }"
            @click="onSelectTranspile"
          >
            Transpile
          </button>
          <button
            type="button"
            class="td-pg-tab"
            :class="{
              'td-pg-tab--active': tab === Tab.Dbml,
            }"
            @click="onSelectDbml"
          >
            SQL to DBML
          </button>
        </div>
      </div>

      <div v-if="tab === Tab.Transpile">
        <SqlTranspile />
      </div>
      <div v-else>
        <SqlToDbml />
      </div>

      <div class="mt-12" />
    </main>
  </MainLayout>
</template>

<script setup lang="ts">
import {
  ref,
} from 'vue';
import {
  useSeoMeta,
} from '@unhead/vue';
import SqlToDbml from './SqlToDbml.vue';
import SqlTranspile from './SqlTranspile.vue';
import MainLayout from '@/layout/main/MainLayout.vue';
import {
  Tab,
  usePlaygroundStore,
} from '@/stores/playground';

useSeoMeta({
  title: 'Playground: SQL Transpiler & SQL to DBML | sqlingo',
  ogTitle: 'Playground: SQL Transpiler & SQL to DBML | sqlingo',
  description: 'Try sqlingo in your browser. Convert between SQL dialects and DBML.',
  ogDescription: 'Try sqlingo in your browser. Convert between SQL dialects and DBML.',
});

const store = usePlaygroundStore();
const tab = ref(store.tab);

function onSelectDbml () {
  selectTab(Tab.Dbml);
}

function onSelectTranspile () {
  selectTab(Tab.Transpile);
}

function selectTab (mode: Tab) {
  tab.value = mode;
  store.tab = mode;
  store.persist();
}
</script>

<style scoped>
.td-pg-title {
  margin: 0;
  font-size: var(--text-xl);
  font-weight: 600;
  letter-spacing: -0.028em;
  color: var(--gui-primary-solid);
}

.td-pg-desc {
  margin-top: 8px;
  font-size: var(--text-sm);
  color: var(--gui-neutral-solid);
}

.td-pg-tabs {
  display: inline-flex;
  margin-top: 20px;
  padding: 4px;
  border-radius: 10px;
  border: 1px solid var(--gui-neutral-border-subtle);
  background: var(--gui-neutral-bg-active);
}

.td-pg-tab {
  cursor: pointer;
  border: none;
  border-radius: 7px;
  padding: 10px 20px;
  font-size: var(--text-sm);
  font-weight: 600;
  background: transparent;
  color: var(--gui-neutral-solid);
  transition:
    color var(--duration-fast) var(--ease-default),
    background var(--duration-fast) var(--ease-default),
    box-shadow var(--duration-fast) var(--ease-default);
}

.td-pg-tab--active {
  background: var(--gui-neutral-bg);
  color: var(--gui-neutral-fg);
  box-shadow: var(--shadow-xs);
}
</style>
