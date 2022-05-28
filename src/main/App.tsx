import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'
import { ConfettiAmountOptions, isAmountValue } from '../popup/App'

const articlePageRegExp = /^\/(\w+)\/items\/[\w\d]{20}$/i
const likeRegExp = (userName: string) =>
  new RegExp(`/${userName}/items/[\\w\\d]{20}/likers$`, 'i')

type UserName = string | undefined

const getUserNameFromStrage = async (): Promise<string | null> => {
  if (typeof chrome.storage === 'undefined') return null

  const { userName } = await chrome.storage.local.get('userName')
  return userName as string
}

const getLgtm = (userName: string) => {
  const tag = Array.from(document.getElementsByTagName('a')).find((tag) =>
    likeRegExp(userName).test(tag.href)
  )

  return Number(tag?.innerText)
}

const getAmountIndicator = (
  lgtm: number,
  amount: ConfettiAmountOptions
): number => {
  if (lgtm === 0) return 0
  const baseNum = Math.log(lgtm + 1) * 1000

  if (amount === 'large') {
    return baseNum * 2
  } else if (amount === 'hyperLarge') {
    return baseNum * 4
  }
  return baseNum
}

const App = () => {
  const { width, height } = useWindowSize()
  const [userName, setUserName] = useState<UserName>(undefined)
  const [amount, setAmount] = useState<ConfettiAmountOptions>('default')

  const found =
    typeof window !== 'undefined' &&
    window.location.pathname.match(articlePageRegExp)
  const author = (found && found[1]) || ''

  // Set username
  useEffect(() => {
    if (userName?.length || (import.meta.env.PROD && !found)) return

    getUserNameFromStrage().then((userName) => {
      if (userName) return setUserName(userName)

      const inputUserName = window.prompt(
        'あなたのユーザー名を入力してください',
        ''
      )
      chrome.storage?.local?.set({ userName: inputUserName })
      inputUserName && setUserName(inputUserName)
    })
  }, [])

  // Set amount
  useEffect(() => {
    if (typeof chrome.storage === 'undefined') return

    chrome.storage.local
      .get('amount')
      .then(
        ({ amount }) => amount && isAmountValue(amount) && setAmount(amount)
      )

    chrome.storage.onChanged.addListener((changes, namespace) => {
      const { amount } = changes
      if (typeof amount === 'undefined' || namespace !== 'local') return
      if (amount.newValue !== amount) setAmount(amount.newValue)
    })
  }, [])

  if (!userName?.length || author !== userName) return null

  const lgtm = getLgtm(userName) || 0

  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={getAmountIndicator(lgtm, amount)}
      recycle={amount !== 'little'}
      style={{ position: 'fixed', zIndex: 10 }}
    />
  )
}

export default App
