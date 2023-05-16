<script setup lang="ts">
import { useMeterStore } from '@/stores/roastMeter';
import { ref } from 'vue';
import { onMounted } from 'vue';

const meterStore = useMeterStore();
const btAvailable = ref(false)

onMounted(async () => {
  btAvailable.value = await navigator.bluetooth.getAvailability()
})
</script>

<template>
  <div class="is-align-items-center is-flex is-flex-direction-column">
    <h1 class="title is-2">
      <div class="icon-text">
        <span class="icon has-text-info">
          <i class="fa-brands fa-cloudscale"></i>
        </span>
        <span>Agtron</span>
      </div>
    </h1>

    <h2 class="subtitle is-4 has-text-grey-light mt-1 has-text-centered">
      Where data and consistency meet, creating the perfect roasted coffee.
    </h2>
    <br>

    <button class="button is-medium is-primary" @click="meterStore.requestDevice" :disabled="!btAvailable">
      {{ btAvailable ? "Connect Your Roast Meter" : "Bluetooth is Unavailable" }}
    </button>

  </div>
</template>

<style scoped></style>
