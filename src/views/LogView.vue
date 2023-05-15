<script setup lang="ts">
import { useCurrentUser, useFirebaseApp } from 'vuefire'
import { RecaptchaVerifier, getAuth } from "firebase/auth";

const auth = getAuth(useFirebaseApp());
window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);

const user = useCurrentUser()
</script>

<template>
  <div>
    <h1 v-if="user">Not Implement yet!</h1>
    <section class="hero is-success">
      <div class="hero-body">
        <div class="container has-text-centered" v-if="!user">
          <div class="column is-4 is-offset-4">
            <h3 class="title has-text-black">Login</h3>
            <hr class="login-hr">
            <p class="subtitle has-text-black">Please login to proceed.</p>
            <div class="box">
              <figure class="avatar">
                <img src="https://via.placeholder.com/150">
              </figure>
              <form>
                <div class="field">
                  <div class="control">
                    <input class="input is-large" type="email" placeholder="Your Email" autofocus="">
                  </div>
                </div>

                <div class="field">
                  <div class="control">
                    <input class="input is-large" type="password" placeholder="Your Password">
                  </div>
                </div>
                <div class="field">
                  <label class="checkbox">
                    <input type="checkbox">
                    Remember me
                  </label>
                </div>
                <button class="button is-block is-info is-large is-fullwidth">Login <i class="fa fa-sign-in"
                    aria-hidden="true"></i></button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style></style>