import { inject } from 'vue'

export function useToast() {
  const $toast = inject('$toast')
  const dark = inject('dark')

  const toast = (message, options) =>
    $toast(message, {
      styles: { background: dark.value ? '#111' : '#fff' },
      ...options,
    })

  return { toast }
}
