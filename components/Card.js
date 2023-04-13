import { useState } from "react"

const Card = ({frontContent, backContent, flip}) => {
  
  return (
    <div className={`flip-card`}>
      <div className={`flip-card-inner ${flip && 'flip-it'}`}>
        <div className={`flip-card-front`}>{frontContent}</div>
        <div className={`flip-card-back `}>{backContent}</div>
      </div>
    </div>
  )
}

export default Card