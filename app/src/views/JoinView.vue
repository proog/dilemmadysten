<script setup lang="ts">
import { isHost, playerName } from "@/game";
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { socketClient } from "../sockets";

const router = useRouter();
const form = reactive({
  roomCode: "",
  playerName: "",
});

async function submit() {
  const data = await socketClient.join(form.roomCode, form.playerName);
  isHost.value = false;
  playerName.value = form.playerName;
  router.push({ name: "room", params: { roomCode: data.code } });
}
</script>

<template>
  <form @submit.prevent="submit">
    <label for="roomCode" class="field-label">Room code</label>
    <input
      type="text"
      id="roomCode"
      class="field-text w-input"
      maxlength="256"
      required
      v-model="form.roomCode"
    />
    <label for="playerName" class="field-label">Dit navn</label>
    <input
      type="text"
      id="playerName"
      class="field-text w-input"
      maxlength="256"
      required
      v-model="form.playerName"
    />

    <input
      type="submit"
      value="Tilslut"
      data-wait="Please wait..."
      class="button-accept w-button"
    />
  </form>
</template>
