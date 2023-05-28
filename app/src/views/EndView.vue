<script setup lang="ts">
import { computed } from "vue";
import type { GameState } from "../../../common/GameState";

const props = defineProps<{ gameState: GameState }>();
const winners = computed(() =>
  props.gameState.currentStep?.kind === "finished"
    ? props.gameState.currentStep.winners.join(" / ")
    : ""
);
</script>

<template>
  <div class="container w-container">
    <div class="player-score wf-section">
      <div
        v-for="player in gameState.players"
        :key="player.name"
        class="player-score01"
      >
        {{ player.score }}
      </div>
    </div>
    <div class="player-lineup wf-section">
      <div
        v-for="player in gameState.players"
        :key="player.name"
        class="player-icon01"
      >
        {{ player.name }}
      </div>
    </div>

    <div class="winner">Vinder:</div>
    <div class="winner-name">{{ winners }}</div>

    <!-- <a href="room.html" class="button-accept w-button">Spil igen</a> -->
    <RouterLink to="/" class="button-accept w-button">Menu</RouterLink>
  </div>
</template>
