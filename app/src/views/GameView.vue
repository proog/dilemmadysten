<script setup lang="ts">
import { gameState, isHost } from "@/game";
import { socketClient } from "@/sockets";
import EndView from "./EndView.vue";
import LobbyView from "./LobbyView.vue";
import QuestionScoreView from "./QuestionScoreView.vue";
import QuestionView from "./QuestionView.vue";

defineProps<{ roomCode: string }>();

async function startGame() {
  await socketClient.start();
}

async function submitAnswer(answer: string) {
  await socketClient.submitAnswer(answer);
}

async function endStep() {
  await socketClient.endStep();
}
</script>

<template>
  <div class="container-2 w-container">
    <div class="timer">60</div>
    <a href="#" class="button-menu w-button">Menu ikon</a>
  </div>

  <template v-if="gameState">
    <QuestionView
      v-if="gameState.currentStep?.kind === 'question'"
      :game-state="gameState"
      @answer="submitAnswer"
    />
    <QuestionScoreView
      v-else-if="gameState.currentStep?.kind === 'scores'"
      :game-state="gameState"
      :is-host="isHost"
      @continue="endStep"
    />
    <EndView
      v-else-if="gameState.currentStep?.kind === 'finished'"
      :game-state="gameState"
    />
    <LobbyView
      v-else
      :game-state="gameState"
      :is-host="isHost"
      @start-game="startGame"
    />
  </template>
</template>
