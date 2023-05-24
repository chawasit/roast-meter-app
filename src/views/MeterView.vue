<script setup lang="ts">
import GreetingAndConnect from '@/components/GreetingAndConnect.vue';
import TheMeter from '@/components/TheMeter.vue';
import { useMeterStore } from '@/stores/roastMeter';
import { onMounted } from 'vue';
import { logEvent } from "firebase/analytics";
import { analytics } from '@/firebase';
const meterStore = useMeterStore();

onMounted(() => {
  logEvent(analytics, "view_meter");
});
</script>

<template>
  <div class="container">
    <div class="columns is-vcentered">
      <div class="column">
        <TheMeter v-if="meterStore.isConnected" />
        <GreetingAndConnect v-if="!meterStore.isConnected" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
