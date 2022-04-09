import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'

const articlePageRegExp = (userName: string) =>
  new RegExp(`^/${userName}/items/[\\w\\d]{20}$`, 'i')
const likeRegExp = (userName: string) =>
  new RegExp(`/${userName}/items/[\\w\\d]{20}/likers$`, 'i')

type UserName = string | undefined

export default () => {
  const { width, height } = useWindowSize()
  const [userName, setUserName] = useState<UserName>(undefined)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const setUser = async () => {
        console.log('setUser')

        const { userName: strageUser } = await chrome.storage.local.get(
          'userName'
        )
        console.log('strageUser', strageUser)
        const userName: UserName = strageUser
          ? strageUser
          : window.prompt('あなたのユーザー名を入力してください', '')
        chrome.storage.local.set({ userName })
        setUserName(userName)
      }
      setUser()
    }
  }, [])

  if (typeof window === 'undefined') return null
  if (!userName?.length) return null
  if (!articlePageRegExp(userName).test(window.location.pathname)) return null

  const tag = Array.from(document.getElementsByTagName('a')).find((tag) =>
    likeRegExp(userName).test(tag.href)
  )

  const lgtm = Number(tag?.innerText) || 0
  const num = Math.log(lgtm + 1) * 1000

  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={num}
      style={{ position: 'fixed' }}
    />
  )
}
