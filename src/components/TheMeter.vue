<script setup lang="ts">
import { useMeterStore } from '@/stores/roastMeter';
import { onMounted, computed } from 'vue';

const meterStore = useMeterStore();

onMounted(() => {
  console.log("Mounted subscribe meter reading!")
  meterStore.getMeterReading();
})

const agtronScale = computed(() => {
  if (meterStore.agtron == 0) return "Ready!"

  return meterStore.agtron
})

const agtronScaleDescription = computed(() => {
  if (meterStore.agtron == 0) return "Please load your Sample."

  if (meterStore.agtron <= 30) return "SCAA: Very Dark (Italian)"
  if (meterStore.agtron < 40) return "SCAA: Dark (French)"
  if (meterStore.agtron < 50) return "SCAA: Medium Dark (Full City)"
  if (meterStore.agtron < 60) return "SCAA: Medium (City)"
  if (meterStore.agtron < 70) return "SCAA: Medium Light (High)"
  if (meterStore.agtron < 80) return "SCAA: Light (Medium)"
  if (meterStore.agtron < 90) return "SCAA: Very Light (Cinnamon)"
  if (meterStore.agtron < 100) return "SCAA: Extremely Light (Light)"

  return "Underdeveloped"
})
</script>

<template>
  <div class="container is-fluid">
    <div class="columns is-vcentered">
      <div class="column is-5 ">
        <div class="has-text-centered">
          <h1 class="title is-2">
            {{ agtronScale }}
          </h1>
          <h2 class="subtitle is-4 has-text-grey-light">
            {{ agtronScaleDescription }}
          </h2>
          <h3 class="subtitle is-4 has-text-grey-light">
            {{ meterStore.particleSensor }}
          </h3>
        </div>
      </div>
      <div class="column is-6 is-offset-1">
        <div class="tabs is-centered">
          <ul>
            <RouterLink v-slot="{ isActive, href, navigate }" custom to="/">
              <li :class="[isActive && 'is-active']"><a :href="href" @click="navigate">Logging</a></li>
            </RouterLink>
            <RouterLink v-slot="{ isActive, href, navigate }" custom to="/setting">
              <li :class="[isActive && 'is-active']"><a :href="href" @click="navigate">Setting</a></li>
            </RouterLink>
          </ul>
        </div>
        <div style="overflow: auto; min-height: 70vh;">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
