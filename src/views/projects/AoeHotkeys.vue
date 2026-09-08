<template>
  <main class="hotkey-page bg-img-cover min-h-screen px-5 pb-16 pt-20">
    <div class="mx-auto max-w-5xl">
      <header class="mb-10 text-center">
        <h1
          class="mb-7 text-4xl font-semibold text-white underline drop-shadow-3xl sm:text-5xl"
        >
          AoE II Hotkeys
        </h1>
        <p
          class="mx-auto max-w-2xl text-lg leading-8 text-white drop-shadow-3xl"
        >
          Explore the default Definitive Edition bindings, or upload your own
          .hkp files to view, edit and download your hotkeys.
        </p>
      </header>

      <details class="panel upload-panel">
        <summary class="cursor-pointer text-xl font-semibold">
          Upload your hotkey files
        </summary>
        <div class="mt-5">
          <label for="hotkey-files" class="mb-3 block text-xl font-semibold"
            >Choose your hotkey files</label
          >
          <p id="file-help" class="mb-5 leading-7">
            Select your profile’s .hkp file, Base.hkp, or both. Each upload
            replaces the matching set of bindings below; the other set stays as
            it is.
          </p>
          <input
            id="hotkey-files"
            type="file"
            accept=".hkp"
            multiple
            :disabled="busy"
            aria-describedby="file-help upload-help"
            class="w-full rounded border border-mint-600 p-3 file:mr-4 file:rounded file:border-0 file:bg-mint-800 file:px-4 file:py-2 file:text-mint-100 disabled:opacity-50"
            @change="upload"
          />
          <p id="upload-help" class="mt-3 text-sm leading-6 text-mint-700">
            Up to 256 KB per file. Files are sent to this site’s server for
            conversion and are not saved by the reader. Punctuation key names
            use a US keyboard layout.
          </p>
          <p v-if="loading" role="status" class="mt-4">Reading hotkeys…</p>
          <ul
            v-if="errors.length"
            role="alert"
            class="mt-4 space-y-2 text-red-300"
          >
            <li v-for="error in errors" :key="error">{{ error }}</li>
          </ul>
          <details class="mt-5 text-sm leading-7">
            <summary class="cursor-pointer font-semibold">
              Where are my hotkey files?
            </summary>
            <p class="mt-2">
              On Windows, look in
              <code class="break-all"
                >C:\Users\&lt;you&gt;\Games\Age of Empires 2
                DE\&lt;account-id&gt;\profile</code
              >. The profile’s .hkp file contains shared commands; its matching
              folder contains Base.hkp and any expansion files.
            </p>
          </details>
        </div>
      </details>

      <template v-if="results.length">
        <section class="panel mt-6" aria-label="Text export">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 class="text-2xl font-semibold">{{ total }} entries</h2>
              <p class="mt-1 text-sm">
                {{ assigned }} assigned across {{ results.length }}
                {{ results.length === 1 ? 'file' : 'files' }}
              </p>
              <p class="mt-2 text-sm text-mint-800">{{ bindingsSource }}</p>
            </div>
            <div class="flex flex-wrap gap-3">
              <button class="action" @click="copyText">Copy all text</button>
              <button class="action" @click="downloadText">
                Download .txt
              </button>
              <button
                class="rounded px-3 py-2 underline disabled:opacity-50"
                :disabled="busy"
                @click="resetDefaults"
              >
                Restore defaults
              </button>
            </div>
          </div>
          <p role="status" class="mt-2 text-sm">{{ status }}</p>
          <p v-if="downloadError" role="alert" class="mt-3 text-red-300">
            {{ downloadError }}
          </p>
          <p class="mt-3 text-sm leading-6 text-mint-800">
            Click a binding to edit it. Download each edited section as .hkp to
            use it in the game. {{ editCount }}
            {{ editCount === 1 ? 'change' : 'changes' }}.
          </p>
          <details class="mt-3 text-sm leading-6">
            <summary class="cursor-pointer font-semibold">
              Using your edited files
            </summary>
            <p class="mt-2">
              Close the game and keep a copy of your current hotkey files.
              Replace the matching files in your profile folder: shared hotkeys
              go in your profile’s .hkp file, and game hotkeys go in its
              matching folder’s Base.hkp (or the original expansion filename).
              If you edit both sections, download both files. Downloads use the
              original filenames.
            </p>
          </details>
          <details class="mt-3">
            <summary class="cursor-pointer font-semibold">
              Plain text preview
            </summary>
            <textarea
              :value="allText"
              readonly
              aria-label="All hotkeys as plain text"
              class="mt-3 h-80 w-full rounded border border-mint-600 bg-mint-100 p-4 font-mono text-sm"
              spellcheck="false"
            ></textarea>
          </details>
          <div
            class="mt-5 flex flex-wrap items-end gap-4 border-t border-mint-400 pt-5"
          >
            <label class="flex-1"
              >Search actions or keys<input
                v-model="search"
                type="search"
                placeholder="Try villager, Ctrl, or an action ID"
                class="mt-2 block w-full min-w-48 rounded border border-mint-600 bg-mint-100 p-3"
            /></label>
            <label class="flex items-center gap-2 py-3"
              ><input v-model="assignedOnly" type="checkbox" class="h-4 w-4" />
              Assigned only</label
            >
          </div>
          <p class="mt-3 text-sm">
            {{ visibleCount }} matching entries. Copy and download always
            include every entry.
          </p>
        </section>

        <section
          v-for="result in filteredResults"
          :key="result.profile.kind"
          class="mt-8"
          :aria-label="result.profile.filename"
        >
          <div
            class="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row"
          >
            <div class="min-w-0">
              <h2 class="break-all text-2xl font-semibold">
                {{
                  result.profile.kind === 'shared'
                    ? 'Shared hotkeys'
                    : 'Game hotkeys'
                }}
              </h2>
              <p class="mt-1 text-sm">
                {{
                  result.source === 'default'
                    ? 'Default bindings'
                    : result.profile.filename
                }}
                · {{ result.profile.total }} entries
                <span v-if="Object.keys(result.edits).length">
                  · {{ Object.keys(result.edits).length }} edited</span
                >
              </p>
            </div>
            <div class="flex shrink-0 flex-wrap justify-end gap-2">
              <button
                class="action disabled:opacity-50"
                :disabled="busy"
                :aria-label="`Download ${result.profile.filename}`"
                @click="downloadHkp(result.profile.kind)"
              >
                {{
                  exporting === result.profile.kind
                    ? 'Preparing…'
                    : 'Download .hkp'
                }}
              </button>
              <button
                v-if="Object.keys(result.edits).length"
                class="rounded px-3 py-2 underline disabled:opacity-50"
                :disabled="busy"
                @click="undoEdits(result.profile.kind)"
              >
                Undo edits
              </button>
              <button
                v-if="
                  result.source === 'uploaded' ||
                  Object.keys(result.edits).length
                "
                class="rounded px-3 py-2 underline disabled:opacity-50"
                :disabled="busy"
                :aria-label="`Restore defaults for ${result.profile.filename}`"
                @click="restoreProfile(result.profile.kind)"
              >
                Use defaults
              </button>
            </div>
          </div>
          <p
            v-for="warning in result.profile.warnings"
            :key="warning"
            class="mb-3 rounded border border-amber-400 bg-amber-50 p-3 text-sm text-amber-900"
          >
            {{ warning }}
          </p>
          <p v-if="!result.profile.groups.length" class="panel">
            No entries match your search in this file.
          </p>
          <details
            v-for="group in result.profile.groups"
            :key="group.name"
            :open="Boolean(search.trim())"
            class="panel mb-4 !p-0 overflow-hidden"
          >
            <summary class="cursor-pointer bg-mint-200 px-5 py-3 font-semibold">
              {{ group.name }}
              <span class="ml-2 text-sm font-normal">{{
                group.hotkeys.length
              }}</span>
            </summary>
            <ul class="divide-y divide-mint-300 border-t border-mint-400">
              <li
                v-for="hotkey in group.hotkeys"
                :key="hotkey.hotkeyIndex"
                class="flex flex-col items-start justify-between gap-3 px-5 py-3 sm:flex-row sm:gap-4"
              >
                <div class="min-w-0">
                  <p>{{ hotkey.action }}</p>
                  <span
                    v-if="
                      result.edits[`${group.groupIndex}:${hotkey.hotkeyIndex}`]
                    "
                    class="text-xs text-mint-800"
                    >Edited</span
                  >
                </div>
                <button
                  v-if="hotkey.id > 0"
                  class="shrink-0 rounded border border-mint-600 bg-mint-100 px-3 py-1 text-sm hover:border-mint-800 hover:bg-mint-300 disabled:opacity-50"
                  :disabled="busy"
                  :aria-label="`Edit ${hotkey.action}: ${hotkey.binding}`"
                  :class="{ 'opacity-60': !hotkey.keyCode }"
                  @click="
                    editing = {
                      kind: result.profile.kind,
                      groupIndex: group.groupIndex,
                      hotkeyIndex: hotkey.hotkeyIndex,
                      hotkey,
                    }
                  "
                >
                  <kbd>{{ hotkey.binding }}</kbd>
                </button>
                <kbd v-else class="text-sm opacity-60">{{
                  hotkey.binding
                }}</kbd>
              </li>
            </ul>
          </details>
        </section>
      </template>
    </div>
    <BindingEditor
      v-if="editing"
      :hotkey="editing.hotkey"
      @save="saveBinding"
      @close="editing = null"
    />
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  formatBinding,
  profileText,
  type Binding,
  type BindingEdit,
  type Hotkey,
  type HotkeyProfile,
} from '../../../netlify/lib/hkp/format'
import defaultBindings from '@/data/aoeHotkeyDefaults.json'
import BindingEditor from '@/components/BindingEditor.vue'

interface Result {
  profile: HotkeyProfile
  text: string
  data: string
  edits: Record<string, BindingEdit>
  source: 'default' | 'uploaded'
}
// Pre-parsed with the same parser as the function, so defaults appear immediately.
const defaults: Result[] = (
  defaultBindings as Omit<Result, 'source' | 'edits'>[]
).map((result) => ({ ...result, source: 'default', edits: {} }))
const results = ref<Result[]>([...defaults])
const loading = ref(false)
const exporting = ref<HotkeyProfile['kind'] | null>(null)
const busy = computed(() => loading.value || exporting.value !== null)
const downloadError = ref('')
const editing = ref<{
  kind: HotkeyProfile['kind']
  groupIndex: number
  hotkeyIndex: number
  hotkey: Hotkey
} | null>(null)
const editCount = computed(() =>
  results.value.reduce(
    (sum, result) => sum + Object.keys(result.edits).length,
    0
  )
)
const errors = ref<string[]>([])
const status = ref('')
const search = ref('')
const assignedOnly = ref(false)
const bindingsSource = computed(() => {
  if (editCount.value) return 'Showing your edited bindings'
  const uploaded = results.value.filter(
    (result) => result.source === 'uploaded'
  ).length
  return uploaded === 0
    ? 'Showing default game bindings'
    : uploaded === results.value.length
      ? 'Showing your uploaded bindings'
      : 'Showing uploaded bindings alongside the remaining defaults'
})
const total = computed(() =>
  results.value.reduce((sum, result) => sum + result.profile.total, 0)
)
const effectiveResults = computed(() =>
  results.value
    .map((result) => ({
      ...result,
      profile: {
        ...result.profile,
        groups: result.profile.groups.map((group, groupIndex) => ({
          ...group,
          groupIndex,
          hotkeys: group.hotkeys.map((hotkey, hotkeyIndex) => {
            const edit = result.edits[`${groupIndex}:${hotkeyIndex}`]
            return {
              ...hotkey,
              ...(edit ?? {}),
              binding: edit ? formatBinding(edit) : hotkey.binding,
              hotkeyIndex,
            }
          }),
        })),
      },
    }))
    .map((result) => {
      result.profile.assigned = result.profile.groups.reduce(
        (count, group) =>
          count + group.hotkeys.filter((hotkey) => hotkey.keyCode !== 0).length,
        0
      )
      return result
    })
)
const assigned = computed(() =>
  effectiveResults.value.reduce(
    (sum, result) => sum + result.profile.assigned,
    0
  )
)
const allText = computed(() =>
  effectiveResults.value
    .map((result) => profileText(result.profile))
    .join('\n\n')
)
const filteredResults = computed(() =>
  effectiveResults.value.map((result) => ({
    ...result,
    profile: {
      ...result.profile,
      groups: result.profile.groups
        .map((group) => ({
          ...group,
          hotkeys: group.hotkeys.filter(
            (hotkey) =>
              (!assignedOnly.value || hotkey.keyCode !== 0) &&
              `${hotkey.action} ${hotkey.binding} ${hotkey.id} ${group.name}`
                .toLowerCase()
                .includes(search.value.trim().toLowerCase())
          ),
        }))
        .filter((group) => group.hotkeys.length),
    },
  }))
)
const visibleCount = computed(() =>
  filteredResults.value.reduce(
    (sum, result) =>
      sum +
      result.profile.groups.reduce(
        (count, group) => count + group.hotkeys.length,
        0
      ),
    0
  )
)

async function upload(event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  if (!files.length) return
  loading.value = true
  errors.value = []
  status.value = ''
  for (const file of files) {
    try {
      if (!/\.hkp$/i.test(file.name) || !file.size || file.size > 256 * 1024)
        throw new Error('Choose a non-empty .hkp file up to 256 KB.')
      const bytes = new Uint8Array(await file.arrayBuffer())
      let binary = ''
      for (const byte of bytes) binary += String.fromCharCode(byte)
      const data = btoa(binary)
      const response = await fetch('/.netlify/functions/read-hkp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, data }),
        signal: AbortSignal.timeout(30000),
      })
      if (!response.headers.get('content-type')?.includes('application/json'))
        throw new Error(
          'The hotkey reader is unavailable. For local development, run pnpm netlify.'
        )
      const result = await response.json()
      if (!response.ok)
        throw new Error(result.error ?? 'Unable to read this file.')
      // Identify the set by its parsed structure, even when the file was renamed.
      const index = results.value.findIndex(
        (existing) => existing.profile.kind === result.profile.kind
      )
      if (index === -1)
        throw new Error('This file does not contain a recognised hotkey set.')
      results.value[index] = { ...result, data, edits: {}, source: 'uploaded' }
    } catch (error) {
      errors.value.push(
        `${file.name}: ${error instanceof Error ? error.message : 'Upload failed. Please try again.'} Current bindings have been kept.`
      )
    }
  }
  loading.value = false
  input.value = ''
}
async function copyText() {
  try {
    await navigator.clipboard.writeText(allText.value)
    status.value = 'All hotkeys copied.'
  } catch {
    status.value =
      'Could not access the clipboard. Select the text in the preview or download it instead.'
  }
}
function downloadText() {
  const url = URL.createObjectURL(
    new Blob([allText.value], { type: 'text/plain;charset=utf-8' })
  )
  const link = document.createElement('a')
  link.href = url
  link.download =
    results.value.length === 1
      ? results.value[0].profile.filename.replace(/\.hkp$/i, '-hotkeys.txt')
      : 'aoe2-hotkeys.txt'
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  status.value = 'Text download started.'
}
function saveBinding(binding: Binding) {
  const target = editing.value
  if (!target) return
  results.value = results.value.map((result) => {
    if (result.profile.kind !== target.kind) return result
    const original =
      result.profile.groups[target.groupIndex].hotkeys[target.hotkeyIndex]
    const edits = { ...result.edits }
    const key = `${target.groupIndex}:${target.hotkeyIndex}`
    if (
      binding.keyCode === original.keyCode &&
      binding.ctrl === original.ctrl &&
      binding.alt === original.alt &&
      binding.shift === original.shift
    )
      delete edits[key]
    else
      edits[key] = {
        ...binding,
        groupIndex: target.groupIndex,
        hotkeyIndex: target.hotkeyIndex,
      }
    return { ...result, edits }
  })
  status.value = `${target.hotkey.action}: ${formatBinding(binding)}. Download the .hkp to use your changes.`
  editing.value = null
}
function undoEdits(kind: HotkeyProfile['kind']) {
  results.value = results.value.map((result) =>
    result.profile.kind === kind ? { ...result, edits: {} } : result
  )
  status.value = 'Edits undone.'
}
async function downloadHkp(kind: HotkeyProfile['kind']) {
  const result = results.value.find((result) => result.profile.kind === kind)!
  exporting.value = kind
  downloadError.value = ''
  try {
    const response = await fetch('/.netlify/functions/write-hkp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: result.profile.filename,
        data: result.data,
        edits: Object.values(result.edits),
      }),
      signal: AbortSignal.timeout(30000),
    })
    if (!response.ok) {
      const error = response.headers
        .get('content-type')
        ?.includes('application/json')
        ? await response.json()
        : null
      throw new Error(
        error?.error ?? 'The HKP download is unavailable. Please try again.'
      )
    }
    if (
      !response.headers
        .get('content-type')
        ?.includes('application/octet-stream')
    )
      throw new Error(
        'The HKP writer is unavailable. For local development, run pnpm netlify.'
      )
    const url = URL.createObjectURL(await response.blob())
    const link = document.createElement('a')
    link.href = url
    link.download = result.profile.filename
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    const count = Object.keys(result.edits).length
    status.value = `${result.profile.filename} download started with ${count} ${count === 1 ? 'change' : 'changes'}.`
  } catch (error) {
    downloadError.value =
      error instanceof Error
        ? error.message
        : 'Could not download this hotkey file.'
  } finally {
    exporting.value = null
  }
}
function restoreProfile(kind: HotkeyProfile['kind']) {
  const fallback = defaults.find((result) => result.profile.kind === kind)!
  results.value = results.value.map((result) =>
    result.profile.kind === kind ? fallback : result
  )
  status.value = 'Default bindings restored.'
}
function resetDefaults() {
  results.value = [...defaults]
  errors.value = []
  status.value = 'Default bindings restored.'
  search.value = ''
  assignedOnly.value = false
}
</script>

<style scoped>
.hotkey-page {
  @apply text-white;
  background-image: url('@/assets/images/backgrounds/hexagon.svg');
}
.panel {
  @apply rounded-md border border-mint-600 bg-mint-200/95 p-5 shadow-out sm:p-6;
}
.action {
  @apply rounded bg-mint-800 px-4 py-2 font-semibold text-mint-100 hover:bg-mint-700;
}
button:focus-visible,
input:focus-visible,
summary:focus-visible,
textarea:focus-visible {
  outline: 3px solid #147d6a;
  outline-offset: 3px;
}
</style>
