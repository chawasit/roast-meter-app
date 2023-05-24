<script setup lang="ts">
import { useMeterStore } from '@/stores/roastMeter'
import { onBeforeMount } from 'vue'
import { logEvent } from "firebase/analytics";
import { analytics } from '@/firebase';
import { onMounted } from 'vue';

const meterStore = useMeterStore()

onBeforeMount(() => {
  console.log('BeforeMount: get meter setting')
  meterStore.getMeterSetting()
})

onMounted(() => {
  logEvent(analytics, "meter_setting");
});
</script>

<template>
  <div class="container">
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
            <input class="input" type="number" min="0" max="256" v-model="meterStore.ledBrightnessLevel" />
          </div>
          <p class="help">Default 135</p>
        </div>
        <div class="field">
          <label class="label">Intersection Point</label>
          <div class="control">
            <input class="input" type="number" min="0" max="256" v-model="meterStore.intersectionPoint" />
          </div>
          <p class="help">Default 117</p>
        </div>
        <div class="field">
          <label class="label">Deviation</label>
          <div class="control">
            <input class="input" type="number" step="0.001" v-model="meterStore.deviation" />
          </div>
          <p class="help">Default 0.165</p>
        </div>
      </div>
      <footer class="card-footer">
        <a href="#" class="card-footer-item is-info" @click="meterStore.saveMeterSetting">Save</a>
      </footer>
    </div>

    <p class="has-text-warning mt-2">{{ meterStore.error }}</p>
  </div>
</template>

<style></style>
