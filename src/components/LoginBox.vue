<script setup lang="ts">
import { useCurrentUser, useFirebaseApp } from 'vuefire'
import { RecaptchaVerifier, signInWithPopup, signInWithPhoneNumber, GoogleAuthProvider, getAuth, type ConfirmationResult } from 'firebase/auth'
import { onMounted } from 'vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const auth = getAuth(useFirebaseApp())
auth.useDeviceLanguage()

const router = useRouter()

const signInWithGooglePopup = () => {
  const provider = new GoogleAuthProvider()

  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result)
      router.replace({ name: 'meter' })
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code
      const errorMessage = error.message
      const email = error.customData.email
      const credential = GoogleAuthProvider.credentialFromError(error)

      loginError.value = errorMessage
    });
}

const recaptchaVerifier = ref();

onMounted(() => {
  recaptchaVerifier.value = new RecaptchaVerifier('recaptcha-container', {
    'size': 'normal',
    'callback': (_: any) => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
      signInWithPhone()
    }
  }, auth)
  recaptchaVerifier.value.render()

  if (user.value) {
    useRouter().replace({ name: 'meter' })
  }
})
const phoneNumber = ref("")
const smsCode = ref("")
const cachedConfirmationResult = ref<ConfirmationResult>()
const loginError = ref<string>()
const showSMSCodeForm = ref<boolean>(false)

const signInWithPhone = () => {
  signInWithPhoneNumber(auth, phoneNumber.value, recaptchaVerifier.value)
    .then((confirmationResult) => {
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      cachedConfirmationResult.value = confirmationResult;
      showSMSCodeForm.value = true
      // ...
    }).catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      const email = error.customData.email

      loginError.value = errorMessage
      showSMSCodeForm.value = false
    });
}

const confirmSMSCode = () => {
  smsCode.value && cachedConfirmationResult.value && cachedConfirmationResult.value.confirm(smsCode.value).then((result) => {
    // User signed in successfully.
    // const user = result.user;
    // ...
    router.replace({ name: 'meter' })
  }).catch((error) => {
    // User couldn't sign in (bad verification code?)
    loginError.value = error.message
    showSMSCodeForm.value = false
  });
}

const user = useCurrentUser()
</script>

<template>
  <div class="container has-text-centered is-centered" v-show="!user">
    <div class="column is-6 is-offset-4">
      <div class="box">
        <div class="field">
          <button class="button is-danger is-fullwidth" @click="signInWithGooglePopup">
            <span class="icon-text">
              <span class="icon">
                <i class="fa fa-google"></i>
              </span>
              <span>
                Login with Google
              </span>
            </span>
          </button>
        </div>

        <br />
        <p>OR</p>
        <br />

        <div class="field">
          <label class="label">Login with Phone Number</label>
          <div class="control has-icons-left">
            <input type="tel" class="input" placeholder="+123456789" name="phone" autocomplete="off" v-model="phoneNumber"
              pattern="\+[0-9]+" required>
            <span class="icon is-small is-left">
              <i class="fa fa-phone"></i>
            </span>
          </div>
        </div>

        <div class="field mt-4" v-show="!showSMSCodeForm">
          <div id="recaptcha-container"></div>
        </div>

        <label class="label" v-show="showSMSCodeForm">Enter SMS Code</label>
        <div class="control has-icons-left" v-show="showSMSCodeForm">
          <input type="text" class="input" name="smsCode" autocomplete="off" v-model="smsCode" required>
          <span class="icon is-small is-left">
            <i class="fa fa-sms"></i>
          </span>
        </div>

        <p class="help has-text-danger" v-if="loginError">{{ loginError }}</p>
        <div class="field mt-2">
          <div class="control">
            <button class="button is-warning" @click="confirmSMSCode" v-show="showSMSCodeForm">
              Confirm Code
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
