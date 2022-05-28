import { ChangeEvent, useEffect, useState } from 'react'
import './App.css'

export type ConfettiAmountOptions = keyof typeof confettiAmount
const confettiAmount = {
  little: '少しだけ',
  default: 'デフォルト（× 1）',
  large: '多め（× 2）',
  hyperLarge: 'めちゃくちゃ多く（× 4）',
}

export const isAmountValue = (value: string): value is ConfettiAmountOptions =>
  Object.keys(confettiAmount).includes(value)

function App() {
  const [amount, setAmount] = useState<ConfettiAmountOptions>('default')
  useEffect(() => {
    if (typeof chrome.storage === 'undefined') return
    chrome.storage.local
      .get('amount')
      .then(
        ({ amount }) => amount && isAmountValue(amount) && setAmount(amount)
      )
  }, [])

  const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
    const amount = isAmountValue(e.currentTarget.value)
      ? e.currentTarget.value
      : 'default'
    setAmount(amount)
    chrome.storage?.local?.set({ amount })
  }

  return (
    <div className='App'>
      <h1 className='App-header'>Qiita Confetti</h1>
      <h2 className='App-subheader'>紙吹雪の量を調節する</h2>
      {Object.entries(confettiAmount).map(([key, label]) => (
        <label className='App-label'>
          <input
            type='radio'
            name={key}
            value={key}
            checked={amount === key}
            onChange={handleCheck}
          />
          {label}
        </label>
      ))}
    </div>
  )
}

export default App
