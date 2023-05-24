<script setup lang="ts">
import { useCurrentUser, useFirestore } from 'vuefire'
import { ref } from 'vue';
import { collection, serverTimestamp, addDoc } from 'firebase/firestore';
import { useRoute, useRouter } from 'vue-router';
import { logEvent } from "firebase/analytics";
import { analytics } from '@/firebase';
import { onMounted } from 'vue';

const db = useFirestore()
const user = useCurrentUser()
const router = useRouter()
const route = useRoute()

const roastProfileCollection = collection(db, 'roast_profiles')

const formCoffee = ref("")
const formAgtron = ref(parseInt(route.params.agtron as string))
const formNote = ref("")
const formHaveReference = ref(false)
const formReferenceAgtron = ref(0)
const formReferenceModel = ref("")

const formCancel = () => {
  router.back()
}

const formSave = async () => {
  const roastProfileData = {
    uid: user.value?.uid,
    coffee: formCoffee.value,
    agtron: formAgtron.value,
    hasReference: formHaveReference.value,
    referenceAgtron: formReferenceAgtron.value,
    referenceModel: formReferenceModel.value,
    note: formNote.value,
    date: serverTimestamp(),
  }

  await addDoc(roastProfileCollection, roastProfileData);

  // Cancel Form After Saved
  formCancel()
}

onMounted(() => {
  logEvent(analytics, "meter_setting");
});

</script>

<template>
  <div class="container">
    <form class="box" @submit.prevent="formSave">
      <div class="field">
        <label class="label">Coffee</label>
        <div class="control">
          <input class="input" type="text" v-model="formCoffee" placeholder="Ethiopia Gesha Wash 2023" required>
        </div>
      </div>
      <div class="field">
        <label class="label">Agtron</label>
        <div class="control">
          <input class="input" type="number" v-model="formAgtron" required>
        </div>
      </div>
      <div class="field">
        <label class="label">Roaster Note</label>
        <div class="control">
          <textarea class="input" v-model="formNote"></textarea>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <label class="checkbox">
            <input type="checkbox" v-model="formHaveReference">
            Have Reference Reading
          </label>
        </div>
      </div>
      <div class="field" v-show="formHaveReference">
        <label class="label">Reference Agtron</label>
        <div class="control">
          <input class="input" type="number" v-model="formReferenceAgtron" placeholder="78">
        </div>
      </div>
      <div class="field" v-show="formHaveReference">
        <label class="label">Reference Model</label>
        <div class="control">
          <input class="input" type="text" v-model="formReferenceModel" placeholder="Lighttells CM100">
        </div>
      </div>
      <div class="field is-grouped">
        <div class="control">
          <button class="button is-info" type="submit">Save</button>
        </div>
        <div class="control">
          <button class="button is-info is-light" @click="formCancel">Cancel</button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
