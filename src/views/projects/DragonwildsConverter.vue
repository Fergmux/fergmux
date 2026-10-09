<template>
  <main class="converter min-h-screen px-5 pb-16 pt-20">
    <div class="mx-auto max-w-5xl">
      <header class="mb-7">
        <router-link to="/projects" class="text-sm text-mint-800 underline"
          >All projects</router-link
        >
        <h1
          class="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl"
        >
          Dragonwilds save converter
        </h1>
        <p class="mt-3 max-w-3xl text-lg leading-8">
          Access your PC Game Pass or Xbox world as a downloadable
          <code>.sav</code> file.
        </p>
        <p class="mt-2 text-mint-800">
          Conversion happens on your device. Your files are never uploaded or
          changed.
        </p>
      </header>

      <section class="panel" aria-labelledby="find-heading">
        <h2 id="find-heading" class="text-xl font-semibold">
          1. Find your saves
        </h2>
        <ol class="mt-4 list-decimal space-y-3 pl-5 leading-7">
          <li>
            Save your world and close Dragonwilds. Copy the whole
            <code>wgs</code> folder somewhere safe.
          </li>
          <li>
            On Windows, press <strong>Win + R</strong>, paste this path and
            press Enter:
          </li>
        </ol>
        <div class="path-box mt-3 flex flex-wrap items-center gap-3">
          <code class="min-w-0 flex-1 break-all">{{ savePath }}</code>
          <button class="secondary" @click="copyPath">
            {{ copied ? 'Copied' : 'Copy path' }}
          </button>
        </div>
        <p class="mt-4 leading-7">
          Choose the copied <strong>wgs folder</strong> below, or the long
          account folder inside it. Include <code>containers.index</code>, the
          <code>container.*</code> files and the large files with long names and
          no extension. They identify your worlds and their backups.
        </p>
        <details class="mt-4 leading-7">
          <summary class="cursor-pointer font-semibold text-mint-800">
            Playing on Xbox, or can’t find the folder?
          </summary>
          <p class="mt-3">
            For an Xbox console world, install Dragonwilds through the Xbox app
            on a Windows PC using the same Microsoft account. Let it sync, open
            the world to check your latest progress, then save and close the
            game. Cloud Gaming does not create these local files.
          </p>
          <p class="mt-2">
            If the exact path is missing, open
            <code>%LOCALAPPDATA%\Packages</code> and look for
            <code>JagexLimited.Dominion_…\SystemAppData\wgs</code>. Steam worlds
            already use <code>.sav</code> files. PS5 and Switch saves cannot be
            converted by this tool.
          </p>
        </details>
      </section>

      <section class="panel mt-5" aria-labelledby="choose-heading">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h2 id="choose-heading" class="text-xl font-semibold">
            2. Select your WGS files
          </h2>
          <span class="text-sm text-mint-700"
            >128 MiB per save · 256 MiB total</span
          >
        </div>
        <div class="mt-5 flex flex-wrap gap-3">
          <button class="action" :disabled="busy" @click="folderInput?.click()">
            Choose WGS folder
          </button>
          <button
            class="secondary"
            :disabled="busy"
            @click="filesInput?.click()"
          >
            Choose individual files
          </button>
          <button
            v-if="worlds.length || notices.length || error"
            class="secondary"
            :disabled="busy"
            @click="reset"
          >
            Clear
          </button>
        </div>
        <input
          ref="folderInput"
          class="hidden"
          type="file"
          webkitdirectory
          multiple
          aria-label="Select WGS folder"
          @change="selectFiles"
        />
        <input
          ref="filesInput"
          class="hidden"
          type="file"
          multiple
          aria-label="Select world and metadata files"
          @change="selectFiles"
        />
        <p class="mt-4 text-sm leading-6 text-mint-700">
          If your browser cannot select a folder, use individual files. Select
          the extensionless world file with <code>containers.index</code> and
          its <code>container.*</code> descriptor where possible. ZIP archives
          are not supported; extract them first.
        </p>
        <p role="status" aria-live="polite" class="mt-4">{{ status }}</p>
        <p v-if="error" role="alert" class="mt-3 text-red-200">{{ error }}</p>
        <details v-if="notices.length" class="mt-4 text-sm leading-6">
          <summary class="cursor-pointer text-mint-800">
            File checks ({{ notices.length }})
          </summary>
          <ul class="mt-3 list-disc space-y-2 break-words pl-5">
            <li v-for="(notice, i) in notices" :key="i">{{ notice }}</li>
          </ul>
        </details>
      </section>

      <section
        v-if="worlds.length"
        class="panel mt-5"
        aria-labelledby="download-heading"
      >
        <div class="flex flex-wrap items-center justify-between gap-4">
          <h2 id="download-heading" class="text-xl font-semibold">
            3. Download your world
          </h2>
          <label class="flex items-center gap-2 text-sm"
            ><input v-model="showBackups" type="checkbox" class="h-4 w-4" />
            Show backups ({{ backupCount }})</label
          >
        </div>
        <p class="mt-3 text-sm leading-6">
          Choose a <strong>Current</strong> world for your latest save. Backups are
          older snapshots. If status is unconfirmed, select the whole WGS folder
          to help identify it.
        </p>
        <p v-if="!visibleWorlds.length" class="mt-5">
          Only backups were found. Enable “Show backups” to inspect them, or
          select the complete WGS folder.
        </p>
        <article
          v-for="(world, i) in visibleWorlds"
          :key="world.source + i"
          class="world-row mt-5"
        >
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-3">
              <h3 class="break-all text-xl font-semibold text-white">
                {{ world.name }}
              </h3>
              <span
                class="badge"
                :class="{ warning: world.status !== 'Current' }"
                >{{ world.status }}</span
              >
            </div>
            <p class="mt-2 text-sm">
              {{ formatSize(world.bytes.length) }} · {{ world.format }} ·
              Modified {{ formatDate(world.modified) }}
            </p>
            <details class="mt-2 text-sm">
              <summary class="cursor-pointer text-mint-700">
                Source file
              </summary>
              <code class="mt-2 block break-all">{{ world.source }}</code>
            </details>
            <p
              v-if="world.status === 'Unconfirmed'"
              class="mt-3 text-sm text-amber-200"
            >
              World data passed validation. Metadata could not confirm whether
              this is current or a backup.
            </p>
            <p
              v-if="world.status === 'Backup'"
              class="mt-3 text-sm text-amber-200"
            >
              This is an older backup. Its download keeps the original world
              filename.
            </p>
          </div>
          <button class="action shrink-0" @click="download(world)">
            Download .sav
          </button>
        </article>
        <p class="mt-5 text-sm leading-6 text-mint-700">
          The Xbox wrapper, compression checksum, extracted size, SAVE structure
          and world name are checked. World and player data are preserved. These
          checks cannot verify gameplay.
        </p>
      </section>

    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { importWorlds, type ImportedWorld } from '@/lib/dragonwilds'

const savePath =
  '%LOCALAPPDATA%\\Packages\\JagexLimited.Dominion_srxstwq7wczqa\\SystemAppData\\wgs'
const folderInput = ref<HTMLInputElement>(),
  filesInput = ref<HTMLInputElement>()
const busy = ref(false),
  error = ref(''),
  status = ref(''),
  copied = ref(false)
const worlds = ref<ImportedWorld[]>([]),
  notices = ref<string[]>([]),
  showBackups = ref(false)
const backupCount = computed(
  () => worlds.value.filter((w) => w.status === 'Backup').length
)
const visibleWorlds = computed(() =>
  worlds.value.filter((w) => showBackups.value || w.status !== 'Backup')
)
const originalTitle = document.title
onMounted(() => {
  document.title = 'Dragonwilds Save Converter | Fergmux'
})
onUnmounted(() => {
  document.title = originalTitle
})

function reset() {
  worlds.value = []
  notices.value = []
  error.value = ''
  status.value = ''
  showBackups.value = false
}
async function selectFiles(event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files || [])
  input.value = ''
  if (!files.length || busy.value) return
  reset()
  busy.value = true
  status.value = 'Reading and checking saves on your device…'
  try {
    const result = await importWorlds(files)
    worlds.value = result.worlds
    notices.value = result.notices
    status.value = worlds.value.length
      ? `Found ${worlds.value.length} world save${worlds.value.length === 1 ? '' : 's'}.`
      : 'No supported world saves found. Choose the whole WGS folder, including its subfolders, or check the file messages below.'
  } catch (e) {
    error.value = (e as Error).message
    status.value = ''
  } finally {
    busy.value = false
  }
}
async function copyPath() {
  try {
    await navigator.clipboard.writeText(savePath)
    copied.value = true
  } catch {
    status.value =
      'Copy the path shown above manually; clipboard access is unavailable.'
  }
}
function download(world: ImportedWorld) {
  const url = URL.createObjectURL(
    new Blob([world.bytes.slice()], { type: 'application/octet-stream' })
  )
  const a = document.createElement('a')
  a.href = url
  a.download = `${world.name}.sav`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10000)
  status.value = `Download started: ${world.name}.sav${world.status === 'Backup' ? ' (older backup)' : ''}.`
}
function formatSize(size: number) {
  return `${(size / 1024).toLocaleString(undefined, { maximumFractionDigits: 1 })} KiB`
}
function formatDate(time: number) {
  return time ? new Date(time).toLocaleString() : 'unknown'
}
</script>

<style scoped>
.converter {
  background: linear-gradient(145deg, #0b132b, #141c36 55%, #173d48);
  color: #d9e8ef;
}
.panel {
  padding: 1.5rem;
  border: 1px solid #4b8895;
  border-radius: 0.5rem;
  background: #141c36;
  box-shadow: 0 8px 30px #0002;
}
.path-box {
  border: 1px solid #3a506b;
  border-radius: 0.375rem;
  padding: 0.875rem;
  background: #0b132b;
  font-size: 0.875rem;
  line-height: 1.7;
}
.action,
.secondary {
  min-height: 44px;
  padding: 0.65rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.9375rem;
  font-weight: 600;
}
.action {
  background: #65e0d4;
  color: #0b132b;
}
.action:hover {
  background: #6fffe9;
}
.secondary {
  border: 1px solid #4b8895;
  color: #65e0d4;
}
.secondary:hover {
  background: #1c2541;
}
button:focus-visible,
summary:focus-visible,
a:focus-visible {
  outline: 2px solid #6fffe9;
  outline-offset: 4px;
}
button:disabled {
  opacity: 0.5;
  cursor: wait;
}
.world-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid #3a506b;
}
.badge {
  padding: 0.2rem 0.6rem;
  border: 1px solid #4b8895;
  border-radius: 1rem;
  font-size: 0.875rem;
  color: #6fffe9;
}
.badge.warning {
  color: #fde68a;
  border-color: #8b7546;
}
li code {
  overflow-wrap: anywhere;
}
@media (max-width: 480px) {
  .panel {
    padding: 1rem;
  }
  .world-row > div {
    flex-basis: 100%;
  }
}
</style>
