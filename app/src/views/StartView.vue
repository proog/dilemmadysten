<template>
  <div class="container w-container">
    <div class="tilslut-form">
      <RouterLink
        to="join"
        class="button-alt w-button"
        active-class="button-alt-chosen"
      >
        Tilslut dyst
      </RouterLink>
      <RouterLink
        to="host"
        class="button-alt w-button"
        active-class="button-alt-chosen"
      >
        Opret dyst
      </RouterLink>

      <div class="w-form">
        <RouterView />
      </div>
    </div>
  </div>
</template>
