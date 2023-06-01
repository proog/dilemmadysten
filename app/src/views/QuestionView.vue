<script setup lang="ts">
import { playerName } from "@/game";
import { computed } from "vue";
import type { GameState } from "../../../common/GameState";

const props = defineProps<{ gameState: GameState; playerName: string }>();
defineEmits<{ (e: "answer", answer: string): void }>();

const isAnswered = computed(
  () =>
    props.gameState.currentStep?.kind === "question" &&
    props.gameState.currentStep.options.some((option) =>
      option.players.includes(playerName.value)
    )
);
</script>

<template>
  <div
    class="container w-container"
    v-if="gameState.currentStep?.kind === 'question'"
  >
    <div class="headline">
      <h1 class="heading">Hvad ville</h1>
      <h1 class="heading-2">
        {{
          gameState.currentStep?.subject === playerName
            ? "du"
            : gameState.currentStep.subject
        }}
      </h1>
      <h1 class="heading">vælge?</h1>
    </div>

    <div class="player-lineup wf-section">
      <div
        class="player-icon01"
        v-for="score in gameState.players"
        :key="score.name"
        :title="score.name"
      >
        {{ score.name[0] }}
      </div>
    </div>

    <div
      class="dilemma"
      v-for="option in gameState.currentStep?.options"
      :key="option.text"
    >
      <div class="dilemma01-column-left w-row">
        <div class="column w-col w-col-6"></div>
        <div class="column w-col w-col-6"></div>
      </div>
      <button
        type="button"
        class="button-dilemma w-button"
        :disabled="isAnswered"
        @click="$emit('answer', option.text)"
      >
        {{ option.text }}
      </button>
      <div class="dilemma01-column-right w-row">
        <div class="column w-col w-col-6" v-if="isAnswered">
          <div
            class="player-icon05"
            v-for="player in option.players"
            :key="player"
          >
            {{ player[0] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
