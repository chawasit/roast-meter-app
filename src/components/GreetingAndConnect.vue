<script setup lang="ts">
import { useMeterStore } from '@/stores/roastMeter';

const meterStore = useMeterStore();
</script>

<template>
  <div class="container">
    <h1 class="title is-2">
      Agtron
    </h1>
    <h2 class="subtitle is-4">
      Where data and consistency meet, creating the perfect roasted coffee.
    </h2>
    <br>
    <p class="">
      <a class="button is-medium is-primary" @click="meterStore.requestDevice">
        Connect Your Roast Meter
      </a>
    </p>
  </div>
</template>

<style scoped></style>
