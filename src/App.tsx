import Confetti from 'react-confetti'

export default () => {
  const isBrowser = typeof window === 'undefined'
  const width = isBrowser ? window.innerWidth : 2000
  const height = isBrowser ? window.innerHeight : 1500
  const lgtm = 0
  const num = Math.log(lgtm + 1) * 1000

  return <Confetti width={width} height={height} numberOfPieces={num} />
}
