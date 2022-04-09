import React from 'react'
import ReactDOM from 'react-dom'

const Option = () => {
  console.log('option')
  return <>hoge</>
}

ReactDOM.render(
  <React.StrictMode>
    <Option />
  </React.StrictMode>,
  document.body.appendChild(document.createElement('div'))
)
