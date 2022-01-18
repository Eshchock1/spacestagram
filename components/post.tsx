import React, { FC, useEffect, useRef, useContext, useState} from 'react'
import styles from '../styles/post.module.css'
import {BiShareAlt} from 'react-icons/bi'
import {AiOutlineHeart, AiFillHeart} from 'react-icons/ai'
import { useRouter } from 'next/router'
const Post: FC<{ 
    id:string;
    title:string;
    description:string;
    creator:string|null;
    date:string;
    image:string;
}> = ({id, title, description, creator, date, image}) => {

    const router = useRouter()
    const [liked, setLiked] = useState(false) 

    const formatText = (text:string, length:number) => {
      if (text.length < length) {
        return text
      }
      else {
        return text.substring(0, length) + "..."
      }
    }

    const formatDate = (str:string) => {
      let date = new Date(str)
      return date.getFullYear().toString() + "-" + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString()) + "-" + (date.getDate() < 10 ? "0" + date.getDate().toString() : date.getDate().toString())    }

    useEffect(()=>{
      const isLiked = localStorage.getItem(id)
      if (isLiked == "true") {
        setLiked(true)
      }
      else {
        setLiked(false)
      }
    }, [id])

    const likeAritfact = () => {
      if (liked) {
        setLiked(false)
        localStorage.setItem(id, "false")
      }
      else {
        setLiked(true)
        localStorage.setItem(id, "true")
      }
    }

    return (
      <div className={styles.postContainer}>
          <div className={styles.imageContainer}>
            <img src={image}/>
            <div className={styles.like} onClick={()=>likeAritfact()}>{liked?<AiFillHeart color="#FF5656"/>:<AiOutlineHeart/>}</div>
          </div>
          <div className={styles.descriptionContainer}>
            <div className={styles.creator}><h4>{creator?formatText(creator, 20):"Unknown"}</h4></div>
            <div className={styles.share}><BiShareAlt/></div>  
            <span>{formatDate(date)}</span>
            <h1>{formatText(title, 55)}</h1>
            <p>{formatText(description, 65)}</p>
            <button className={styles.visit} onClick={()=>router.push("/" + id)}>Visit</button>
          </div>
      </div>
    )
}

export default Post