<script setup lang="ts">
import { useCurrentUser, useFirebaseApp } from 'vuefire'
import { RecaptchaVerifier, getAuth } from 'firebase/auth'

const auth = getAuth(useFirebaseApp())
// window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth)

const user = useCurrentUser()
</script>

<template>
  <div>
    <h1 v-if="user">Not Implement yet!</h1>
    <section class="hero is-success">
      <div class="hero-body">
        <div class="container has-text-centered" v-if="!user">
          <div class="column is-4 is-offset-4">
            <h3 class="title has-text-black">Login to Save Roast Profile</h3>
            <h2 class="subtitle has-text-black">Coming Soon</h2>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style></style>
