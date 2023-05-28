import { ref } from "vue";
import type { GameState } from "../../common/GameState";

export const gameState = ref<GameState>();
export const isHost = ref<boolean>(false);
