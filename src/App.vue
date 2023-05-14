<script setup lang="ts">
import GreetingAndConnect from './components/GreetingAndConnect.vue';
import TheMeter from './components/TheMeter.vue';
import { useMeterStore } from '@/stores/roastMeter';

const meterStore = useMeterStore();
</script>

<template>
  <main>
    <section class="hero is-fullheight is-default is-bold">
      <div class="hero-head">
        <nav class="navbar">
          <div class="container">
            <div class="navbar-brand">
              <a class="navbar-item" href="../">
                <h1>Roast Meter</h1>
              </a>
            </div>
          </div>
        </nav>
      </div>
      <div class="hero-body">
        <TheMeter v-if="meterStore.isConnected" />
        <GreetingAndConnect v-if="!meterStore.isConnected" />
      </div>

      <div class="hero-foot">
        <div class="container">
          <div class="tabs is-centered">
            <ul>
              <li><a>Roast Meter App v0.1.2</a></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped></style>
