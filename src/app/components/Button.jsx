import React from 'react'

const Button = ({text,cn}) => {
  return (
    <div className={`
      bg-transparent border border-white rounded-3xl text-white
      flex items-center justify-center cursor-pointer
      hover:bg-gray-200 hover:text-gray-900 transition-all duration-300
      ${cn}
    `}>
      {text}
    </div>
  )
}

export default Button