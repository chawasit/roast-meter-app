<script setup lang="ts">
import { useMeterStore } from '@/stores/roastMeter';
import { useBluetooth } from '@vueuse/core';
const meterStore = useMeterStore();
const { error } = useBluetooth();
</script>

<template>
  <div class="container">
    <h1 class="title is-2">
      <div class="icon-text">
        <span class="icon has-text-success">
          <i class="fa-brands fa-cloudscale"></i>
        </span>
        <span>Agtron</span>
      </div>
    </h1>
    <h2 class="subtitle is-4 mt-1">
      Where data and consistency meet, creating the perfect roasted coffee.
    </h2>
    <br>
    <p class="">
      <a class="button is-medium is-primary" @click="meterStore.requestDevice">
        Connect Your Roast Meter
      </a>
      <p class="has-text-red" v-if="error">{{ error }}</p>
    </p>
  </div>
</template>

<style scoped></style>
