<script setup lang="ts">
import { computed } from "vue";
import type { GameState } from "../../../common/GameState";

const props = defineProps<{ gameState: GameState; isHost: boolean }>();
defineEmits<{ (e: "continue"): void }>();

const scores = computed(() =>
  props.gameState.currentStep?.kind === "scores"
    ? props.gameState.currentStep.scores
    : []
);
</script>

<template>
  <div class="container w-container">
    <div class="player-score wf-section">
      <div v-for="score in scores" :key="score.player" class="player-score01">
        +{{ score.score }}
      </div>
    </div>
    <div class="player-lineup wf-section">
      <div v-for="score in scores" :key="score.player" class="player-icon01">
        {{ score.player }}
      </div>
    </div>

    <button
      v-if="isHost"
      type="button"
      class="button-accept w-button"
      @click="$emit('continue')"
    >
      Fortsæt
    </button>
  </div>
</template>
