<template>
  <form id="email-form" name="email-form" data-name="Email Form" method="get">
    <label for="name" class="field-label">Room code</label
    ><input
      type="text"
      class="field-text w-input"
      maxlength="256"
      name="name"
      data-name="Name"
      placeholder=""
      id="name"
    /><label for="email" class="field-label">Dit navn</label
    ><input
      type="email"
      class="field-text w-input"
      maxlength="256"
      name="email"
      data-name="Email"
      placeholder=""
      id="email"
      required
    /><input
      type="submit"
      value="Tilslut"
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
