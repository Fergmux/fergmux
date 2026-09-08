<template>
  <dialog
    ref="dialog"
    class="binding-dialog w-[calc(100%_-_2rem)] max-w-lg rounded-lg border border-mint-600 bg-mint-200 p-6 text-white shadow-xl"
    aria-labelledby="binding-title"
    @cancel.prevent="emit('close')"
  >
    <h2 id="binding-title" class="text-2xl font-semibold">
      {{ hotkey.action }}
    </h2>
    <p class="mb-4 mt-2 leading-6 text-mint-800">
      Press your shortcut in the capture box, or choose a key and modifiers
      below.
    </p>
    <button
      ref="captureBox"
      type="button"
      class="w-full rounded border-2 border-dashed border-mint-600 bg-mint-100 p-5 text-center focus:border-mint-800"
      aria-label="Capture shortcut"
      @keydown="capture"
    >
      <span class="block text-xl font-semibold">{{
        formatBinding(draft)
      }}</span>
      <span class="mt-2 block text-sm text-mint-700"
        >Click here and press a key combination</span
      >
    </button>
    <p role="status" class="mt-2 text-sm text-mint-800">{{ captureStatus }}</p>
    <label class="mt-4 block"
      >Key
      <select
        v-model.number="draft.keyCode"
        class="mt-2 block w-full rounded border border-mint-600 bg-mint-100 p-3"
      >
        <option
          v-for="option in options"
          :key="option.code"
          :value="option.code"
        >
          {{ option.name }}
        </option>
      </select>
    </label>
    <div class="my-5 flex flex-wrap gap-6">
      <label class="flex items-center gap-2"
        ><input
          v-model="draft.ctrl"
          type="checkbox"
          :disabled="!draft.keyCode"
        />
        Ctrl</label
      >
      <label class="flex items-center gap-2"
        ><input
          v-model="draft.alt"
          type="checkbox"
          :disabled="!draft.keyCode"
        />
        Alt</label
      >
      <label class="flex items-center gap-2"
        ><input
          v-model="draft.shift"
          type="checkbox"
          :disabled="!draft.keyCode"
        />
        Shift</label
      >
    </div>
    <p class="mb-5 text-sm leading-6 text-mint-700">
      Choose Tab, Escape or a mouse button from the key list. Punctuation
      follows the US keyboard layout.
    </p>
    <div class="flex flex-wrap justify-between gap-3">
      <button
        type="button"
        class="rounded px-3 py-2 underline"
        @click="emit('save', emptyBinding)"
      >
        Unassign
      </button>
      <div class="flex gap-3">
        <button
          type="button"
          class="rounded border border-mint-600 px-4 py-2"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button
          type="button"
          class="rounded bg-mint-800 px-4 py-2 font-semibold text-mint-100"
          @click="emit('save', draft.keyCode ? { ...draft } : emptyBinding)"
        >
          Save binding
        </button>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  formatBinding,
  keyName,
  keyNames,
  type Binding,
  type Hotkey,
} from '../../netlify/lib/hkp/format'
import { hkpKeyCode } from '@/lib/hkpKeys'

const props = defineProps<{ hotkey: Hotkey }>()
const emit = defineEmits<{ save: [binding: Binding]; close: [] }>()
const emptyBinding: Binding = {
  keyCode: 0,
  ctrl: false,
  alt: false,
  shift: false,
}
const draft = ref<Binding>({
  keyCode: props.hotkey.keyCode,
  ctrl: props.hotkey.ctrl,
  alt: props.hotkey.alt,
  shift: props.hotkey.shift,
})
const dialog = ref<HTMLDialogElement>()
const captureBox = ref<HTMLButtonElement>()
const captureStatus = ref('')
const options = computed(() =>
  [
    ...new Set([
      0,
      props.hotkey.keyCode,
      ...Object.keys(keyNames).map(Number),
      ...Array.from({ length: 26 }, (_, i) => 65 + i),
      ...Array.from({ length: 10 }, (_, i) => 48 + i),
      ...Array.from({ length: 10 }, (_, i) => 96 + i),
      ...Array.from({ length: 24 }, (_, i) => 112 + i),
    ]),
  ]
    .sort((a, b) => a - b)
    .map((code) => ({ code, name: keyName(code) }))
)

onMounted(() => {
  dialog.value?.showModal()
  captureBox.value?.focus()
})
function capture(event: KeyboardEvent) {
  // Preserve keyboard navigation and the dialog's native Escape behaviour.
  if (event.code === 'Tab' || event.code === 'Escape') return
  event.preventDefault()
  event.stopPropagation()
  if (event.repeat || event.isComposing) return
  const keyCode = hkpKeyCode(event.code)
  if (keyCode === null || event.metaKey) {
    captureStatus.value =
      'Hold Ctrl, Alt or Shift and press a key, or use the key list.'
    return
  }
  draft.value = {
    keyCode,
    ctrl: event.ctrlKey,
    alt: event.altKey,
    shift: event.shiftKey,
  }
  captureStatus.value = `Captured ${formatBinding(draft.value)}.`
}
</script>

<style scoped>
.binding-dialog::backdrop {
  background: rgb(0 0 0 / 65%);
}
button:focus-visible,
select:focus-visible,
input:focus-visible {
  outline: 3px solid #65e0d4;
  outline-offset: 3px;
}
</style>
