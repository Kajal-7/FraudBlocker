import React from 'react'
import styles from './Box.module.css'
const Box = (props) => {
  return (
    <div className={styles.box} style={{display:'flex', justifyContent:'center', alignItems:'center'}}>{props.children}</div>
  )
}

export default Box