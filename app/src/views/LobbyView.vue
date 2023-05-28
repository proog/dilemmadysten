<script setup lang="ts">
import type { GameState } from "../../../common/GameState";

defineProps<{ gameState: GameState; isHost: boolean }>();
defineEmits<{ (e: "startGame"): void }>();
</script>

<template>
  <div class="container w-container">
    <div class="room-code">Room code: {{ gameState.code }}</div>

    <div class="players-title">Deltagere</div>
    <div class="player-lineup wf-section">
      <div
        v-for="player in gameState.players"
        :key="player.name"
        :title="player.name"
        class="player-icon01"
      >
        {{ player.name[0] }}
      </div>
    </div>

    <button
      type="button"
      class="button-accept w-button"
      v-if="isHost"
      @click="$emit('startGame')"
    >
      Start dyst
    </button>
    <div class="players-title" v-else>Venter på at spillet starter...</div>
  </div>
</template>
