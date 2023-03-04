<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { socketClient } from "../sockets";

const router = useRouter();
const playerName = ref("");

async function submit() {
  const data = await socketClient.create(playerName.value);
  router.push({ name: "lobby", params: { code: data.code } });
}
</script>

<template>
  <form @submit.prevent="submit">
    <label for="playerName" class="field-label">Dit navn</label>
    <input
      type="text"
      id="playerName"
      class="field-text w-input"
      maxlength="256"
      required
      v-model="playerName"
    />
    <input
      type="submit"
      value="Opret"
      data-wait="Please wait..."
      class="button-accept w-button"
    />
  </form>
  <div class="w-form-done">
    <div>Thank you! Your submission has been received!</div>
  </div>
  <div class="w-form-fail">
    <div>Oops! Something went wrong while submitting the form.</div>
  </div>
</template>
