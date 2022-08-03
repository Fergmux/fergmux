<template>
  <div
    id="toast"
    class="fixed left-0 right-0 flex flex-col justify-center margin-auto hide"
  >
    <div
      id="static-example"
      class="block max-w-full px-5 mx-auto mb-3 text-sm rounded-lg shadow-lg pointer-events-auto bg-mint-500 bg-clip-padding"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      data-mdb-autohide="false"
    >
      <div class="p-3 text-white break-words rounded-lg bg-mint-500">
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
