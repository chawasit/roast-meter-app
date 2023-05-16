<script setup lang="ts">
import { ref } from 'vue';
import { useMeterStore } from '@/stores/roastMeter';
import { useCurrentUser, useFirebaseApp } from 'vuefire';
import { signOut, getAuth } from 'firebase/auth';
import router from '@/router/index';

const showNav = ref(false)
const meterStore = useMeterStore()
const user = useCurrentUser()

const logout = () => {
  const auth = getAuth(useFirebaseApp())
  signOut(auth)
  router.push({ name: 'login' })
}
</script>

<template>
  <main>
    <section class="hero is-fullheight">
      <div class="hero-head">
        <nav class="navbar">
          <div class="container">
            <div class="navbar-brand">
              <a class="navbar-item">
                <h1>Roast Meter</h1>
              </a>
              <span class="navbar-burger" v-on:click="showNav = !showNav" v-bind:class="{ 'is-active': showNav }">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
            <div id="navbarMenuHeroC" class="navbar-menu" v-bind:class="{ 'is-active': showNav }">
              <div class="navbar-end">
                <RouterLink v-slot="{ isActive, href, navigate }" custom to="/">
                  <a :class="[{ 'is-active': isActive }, 'navbar-item']" :href="href" @click="navigate"
                    v-on:click="showNav = !showNav">Meter</a>
                </RouterLink>
                <RouterLink v-slot="{ isActive, href, navigate }" custom to="/setting">
                  <a :class="[{ 'is-active': isActive }, 'navbar-item']" :href="href" @click="navigate"
                    v-show="meterStore.isConnected" v-on:click="showNav = !showNav">Meter Setting</a>
                </RouterLink>
                <RouterLink v-slot="{ isActive, href, navigate }" custom to="/roast-profiles">
                  <a :class="[{ 'is-active': isActive }, 'navbar-item']" :href="href" @click="navigate"
                    v-on:click="showNav = !showNav">Roast Profiles</a>
                </RouterLink>
                <RouterLink v-slot="{ isActive, href, navigate }" custom to="/login" name="login">
                  <a :class="[{ 'is-active': isActive }, 'navbar-item']" :href="href" @click="navigate" v-show="!user"
                    v-on:click="showNav = !showNav">Login</a>
                </RouterLink>
                <a class="navbar-item">
                </a>
                <a class="navbar-item" v-show="user" @click="logout" v-on:click="showNav = !showNav">
                  Logout
                </a>
                <!-- <span class="navbar-item">
                  <a class="button is-success is-inverted" v-on:click="showNav = !showNav">
                    <span class="icon">
                      <i class="fab fa-github"></i>
                    </span>
                    <span>GitHub</span>
                  </a>
                </span> -->
              </div>
            </div>
          </div>
        </nav>
      </div>

      <div class="hero-body">
        <RouterView />
      </div>

      <div class="hero-foot">
      </div>
    </section>
  </main>
</template>

<style scoped></style>
