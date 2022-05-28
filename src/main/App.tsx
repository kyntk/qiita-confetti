import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'

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

const App = () => {
  const { width, height } = useWindowSize()
  const [userName, setUserName] = useState<UserName>(undefined)
  const [enabled, setEnabled] = useState(false)

  const found =
    typeof window !== 'undefined' &&
    window.location.pathname.match(articlePageRegExp)
  const author = (found && found[1]) || ''

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

  useEffect(() => {
    if (typeof chrome.storage === 'undefined') return setEnabled(true)

    chrome.storage.local
      .get('enabled')
      .then(({ enabled }) => setEnabled(enabled))

    chrome.storage.onChanged.addListener((changes, namespace) => {
      const { enabled } = changes
      if (typeof enabled === 'undefined' || namespace !== 'local') return
      if (enabled.newValue !== enabled) setEnabled(enabled.newValue)
    })
  }, [])

  if (!userName?.length || author !== userName) return null

  const lgtm = getLgtm(userName) || 0
  const num = Math.log(lgtm + 1) * 1000

  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={num}
      recycle={enabled}
      style={{ position: 'fixed', zIndex: 10 }}
    />
  )
}

export default App
