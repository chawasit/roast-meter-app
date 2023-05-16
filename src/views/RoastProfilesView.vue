<script setup lang="ts">
import { useCurrentUser, useCollection, useFirestore } from 'vuefire'
import { ref } from 'vue';
import { collection, where, query, orderBy } from 'firebase/firestore';

const db = useFirestore()
const user = useCurrentUser()

const roastProfileCollection = collection(db, 'roast_profiles')
const roastProfilesQuery = query(roastProfileCollection, where("uid", "==", user.value?.uid), orderBy("date", "desc"))
const userRoastProfiles = useCollection(roastProfilesQuery)

</script>

<template>
  <div class="container">
    <div class="columns  is-multiline is-centered">
      <div class="column is-half" v-for="profile in userRoastProfiles" :key="profile.id">
        <div class="card">
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <p class="title is-4">({{ profile.agtron }}) {{ profile.coffee }}</p>
              </div>
            </div>

            <div class="content">
              {{ profile.note }}
              <ul v-show="profile.hasReference">
                <li>Reference Agtron: {{ profile.referenceAgtron }}</li>
                <li>Reference Model: {{ profile.referenceModel }}</li>
              </ul>
              <time datetime="2016-1-1">{{ new Date(profile.date * 1000) }}</time>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
