<script setup lang="ts">
import { useMeterStore } from '@/stores/roastMeter'
import { onMounted } from 'vue'

const meterStore = useMeterStore()

onMounted(() => {
  console.log('Mounted get meter setting')
  meterStore.getMeterSetting()
})
</script>

<template>
  <div>
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">Device</p>
      </header>
      <div class="card-content">
        <div class="field">
          <label class="label">BLE Device Name</label>
          <div class="control">
            <input class="input" type="text" v-model="meterStore.bleName" />
          </div>
        </div>
        <div class="field">
          <label class="label">LED Brightness Level</label>
          <div class="control">
            <input
              class="input"
              type="number"
              min="0"
              max="256"
              v-model="meterStore.ledBrightnessLevel"
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Intersection Point</label>
          <div class="control">
            <input
              class="input"
              type="number"
              min="0"
              max="256"
              v-model="meterStore.intersectionPoint"
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Deviation</label>
          <div class="control">
            <input class="input" type="number" step="0.001" v-model="meterStore.deviation" />
          </div>
        </div>
      </div>
      <footer class="card-footer">
        <a href="#" class="card-footer-item is-info" @click="meterStore.saveMeterSetting">Save</a>
      </footer>
    </div>
  </div>
</template>

<style></style>
