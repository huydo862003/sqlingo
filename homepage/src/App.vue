<template>
  <RouterView
    v-slot="{
      Component,
    }"
  >
    <Transition
      name="fade"
      mode="out-in"
    >
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<script setup lang="ts">
import {
  RouterView, useRoute,
} from 'vue-router';
import {
  useHead,
} from '@unhead/vue';
import {
  computed,
} from 'vue';

const route = useRoute();
useHead({
  link: [
    {
      rel: 'canonical',
      href: computed(() => `https://huydo862003.github.io/sqlingo${route.path}`),
    },
  ],
});
</script>

<style scoped>
:global(.fade-enter-active),
:global(.fade-leave-active) {
  transition: opacity 0.08s ease;
}

:global(.fade-enter-from),
:global(.fade-leave-to) {
  opacity: 0;
}
</style>
