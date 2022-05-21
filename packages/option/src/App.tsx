import { ChangeEvent, useEffect, useState } from 'react'
import './App.css'

function App() {
  const [disabled, setDisabled] = useState(false)
  useEffect(() => {
    if (typeof chrome.storage === 'undefined') return
    chrome.storage.local
      .get('enabled')
      .then(({ enabled }) => setDisabled(enabled === false))
  }, [])

  const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
    setDisabled(e.currentTarget.checked)
    chrome.storage?.local?.set({ enabled: !e.currentTarget.checked })
  }
  return (
    <div className='App'>
      <label>
        <input
          type='checkbox'
          name='enabled'
          checked={disabled}
          onChange={handleCheck}
        />
        記事を読みたい
      </label>
    </div>
  )
}

export default App
