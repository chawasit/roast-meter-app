<script setup lang="ts">
import { useMeterStore } from '@/stores/roastMeter'
import { onMounted, computed } from 'vue'

const meterStore = useMeterStore()

onMounted(() => {
  console.log('Mounted subscribe meter reading!')
  meterStore.getMeterReading()
})

const agtronScale = computed(() => {
  return meterStore.agtron
})

const agtronScaleDescription = computed(() => {
  if (meterStore.agtron <= 20) return 'Overdeveloped'
  if (meterStore.agtron <= 30) return 'Very Dark (Italian)'
  if (meterStore.agtron < 40) return 'Dark (French)'
  if (meterStore.agtron < 50) return 'Medium Dark (Full City)'
  if (meterStore.agtron < 60) return 'Medium (City)'
  if (meterStore.agtron < 70) return 'Medium Light (High)'
  if (meterStore.agtron < 80) return 'Light (Medium)'
  if (meterStore.agtron < 90) return 'Very Light (Cinnamon)'
  if (meterStore.agtron < 100) return 'Extremely Light (Light)'

  return 'Underdeveloped'
})

const agtronScaleColor = computed(() => {
  if (meterStore.agtron <= 20) return '#0B0806'
  if (meterStore.agtron <= 30) return '#160F0D'
  if (meterStore.agtron < 40) return '#211713'
  if (meterStore.agtron < 50) return '#2C1E19'
  if (meterStore.agtron < 60) return '#362620'
  if (meterStore.agtron < 70) return '#412E26'
  if (meterStore.agtron < 80) return '#4C352C'
  if (meterStore.agtron < 90) return '#573D32'
  if (meterStore.agtron < 100) return '#624439'

  return '#6D4C3F'
})
</script>

<template>
  <div class="container is-fluid">
    <div class="columns is-vcentered">
      <div class="column is-5">
        <div
          class="is-align-items-center is-flex is-flex-direction-column"
          v-if="meterStore.meterState == 0"
        >
          <h1 class="title is-2">
            <div class="icon-text">
              <span class="icon has-text-info">
                <i class="fa-solid fa-gear fa-spin"></i>
              </span>
              <span>Setting Up</span>
            </div>
          </h1>
          <h2 class="subtitle is-4 has-text-grey-light mt-1">Preparing liquid oxygen.</h2>
        </div>

        <div
          class="is-align-items-center is-flex is-flex-direction-column"
          v-if="meterStore.meterState == 1"
        >
          <h1 class="title is-2">
            <div class="icon-text">
              <span class="icon has-text-danger">
                <i class="fa-solid fa-fire"></i>
              </span>
              <span>Warm Up</span>
            </div>
          </h1>
          <h2 class="subtitle is-4 has-text-grey-light mt-1">Preparing for ignition.</h2>
        </div>

        <div
          class="is-align-items-center is-flex is-flex-direction-column"
          v-if="meterStore.meterState == 2"
        >
          <h1 class="title is-2">
            <div class="icon-text">
              <span class="icon has-text-success">
                <i class="fa-solid fa-check-double"></i>
              </span>
              <span>Ready!</span>
            </div>
          </h1>
          <h2 class="subtitle is-4 has-text-grey-light mt-1">Please load your sample.</h2>
        </div>

        <div
          class="is-align-items-center is-flex is-flex-direction-column"
          v-if="meterStore.meterState == 3"
        >
          <h1 class="title is-2">
            <div class="icon-text">
              <span class="icon" :style="[{ color: agtronScaleColor }]">
                <i class="fa-solid fa-compass fa-spin"></i>
              </span>
              <span class="mx-2">{{ agtronScale }}</span>
            </div>
          </h1>
          <h2 class="subtitle is-4 has-text-grey-light mt-1">
            {{ agtronScaleDescription }}
          </h2>
          <h3 class="subtitle is-4 has-text-grey">Raw: {{ meterStore.particleSensor }}</h3>
        </div>
      </div>
      <div class="column is-6 is-offset-1">
        <div class="tabs is-centered">
          <ul>
            <RouterLink v-slot="{ isActive, href, navigate }" custom to="/">
              <li :class="[isActive && 'is-active']">
                <a :href="href" @click="navigate">Logging</a>
              </li>
            </RouterLink>
            <RouterLink v-slot="{ isActive, href, navigate }" custom to="/setting">
              <li :class="[isActive && 'is-active']">
                <a :href="href" @click="navigate">Setting</a>
              </li>
            </RouterLink>
          </ul>
        </div>
        <div style="overflow: auto; min-height: 70vh">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
