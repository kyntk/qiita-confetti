const userInput = document.getElementById(
  'userInput'
) as HTMLInputElement | null
const button = document.getElementById('submitBUtton')

button?.addEventListener('click', () => {
  if (!userInput?.value) return
  chrome.storage.local.set({ userName: userInput.value })
})

export {}
