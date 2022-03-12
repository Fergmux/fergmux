<template>
  <div
    class="fixed flex left-0 right-0 margin-auto flex-col justify-center hide"
    id="toast"
  >
    <div
      class="bg-mint-500 shadow-lg mx-auto px-5 max-w-full text-sm pointer-events-auto bg-clip-padding rounded-lg block mb-3"
      id="static-example"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      data-mdb-autohide="false"
    >
      <div class="p-3 bg-mint-500 rounded-lg break-words text-white">
        {{ text }}
      </div>
    </div>
  </div>
</template>

<style>
.hide {
  opacity: 0;
  top: 50px;
  transition: opacity 0.5s ease-in-out, top 0.5s ease-in-out;
}
.show {
  opacity: 1;
  top: 40px;
  transition: opacity 0.5s ease-in-out, top 0.5s ease-in-out;
}
</style>
