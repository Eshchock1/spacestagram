import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../styles/postid.module.css";
import axios from "axios";
import { IoReturnUpBack } from "react-icons/io5";
import { BiShareAlt } from "react-icons/bi";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FiExternalLink } from 'react-icons/fi'

const PostPage: NextPage = () => {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [shareLinkCopied, setShareLinkCopied] = useState<boolean>(false);

  const [title, setTitle] = useState(null);
  const [date, setDate] = useState(null);
  const [description, setDescription] = useState(null);
  const [image, setImage] = useState(null);
  const [creator, setCreator] = useState(null);
  const apikey = "BkltarX2SapKEI0XAP7R1z1SqM80I9GhjFbn0B9G";

  useEffect(() => {
    if (router.query.postid) {
      if ((router.query.postid as string).substring(0, 5) == "apod-") {
        axios
          .get(
            `https://api.nasa.gov/planetary/apod?api_key=${apikey}&date=${(
              router.query.postid as string
            ).substring(5)}`
          )
          .then((res) => {
            if (res.data.media_type == "image") {
              setTitle(res.data.title);
              setDate(res.data.date);
              setDescription(res.data.explanation);
              setImage(res.data.url);
              setCreator(res.data.copyright);
              const isLiked = localStorage.getItem(
                router.query.postid as string
              );
              setLiked(isLiked == "true");
            } else {
              router.replace("/");
            }
          })
          .catch((err) => {
            router.replace("/");
          });
      } else {
        axios
          .get(
            `https://images-api.nasa.gov/search?nasa_id=${router.query.postid}`
          )
          .then((res) => {
            if (res.data.collection.items[0].data[0].media_type == "image") {
              setTitle(res.data.collection.items[0].data[0].title);
              setDate(res.data.collection.items[0].data[0].date_created);
              setDescription(res.data.collection.items[0].data[0].description);
              setImage(res.data.collection.items[0].links[0].href);
              setCreator(res.data.collection.items[0].data[0].center);
              const isLiked = localStorage.getItem(
                router.query.postid as string
              );
              setLiked(isLiked == "true");
            } else {
              router.replace("/");
            }
          })
          .catch((err) => {
            router.replace("/");
          });
      }
    }
  }, [router.query.postid]);

  useEffect(() => {
    window.addEventListener("resize", handleImageResize, false);
    return () => {
      window.removeEventListener("resize", handleImageResize, false);
    };
  }, []);

  useEffect(() => {
    if (image) {
      handleImageResize();
    }
  }, [image]);

  useEffect(() => {
    if (shareLinkCopied) {
      setTimeout(() => {
        setShareLinkCopied(false);
      }, 2000);
    }
  }, [shareLinkCopied]);

  const likeAritfact = () => {
    if (liked) {
      setLiked(false);
      localStorage.setItem(router.query.postid as string, "false");
    } else {
      setLiked(true);
      localStorage.setItem(router.query.postid as string, "true");
    }
  };

  function handleImageResize() {
    if (document && document.getElementsByTagName("IMG")[0]) {
      let image = document.getElementsByTagName("IMG")[0];
      let imageAspectRatio =
        (image as HTMLImageElement).naturalWidth /
        (image as HTMLImageElement).naturalHeight;
      let container = document.getElementsByClassName(styles.imageContainer)[0];
      let containerAspectRatio = container.clientWidth / container.clientHeight;
      if (imageAspectRatio > containerAspectRatio) {
        image.classList.add(styles.restrictWidth);
        image.classList.remove(styles.restrictHeight);
      } else {
        image.classList.remove(styles.restrictWidth);
        image.classList.add(styles.restrictHeight);
      }
    }
  }

  const formatDate = (str: string) => {
    let date = new Date(str);
    return (
      date.getFullYear().toString() +
      "-" +
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1).toString()
        : (date.getMonth() + 1).toString()) +
      "-" +
      (date.getDate() < 10
        ? "0" + date.getDate().toString()
        : date.getDate().toString())
    );
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Post | Spacestagram</title>
        <meta
          name={title ? "Spacestagram | " + title : "Spacestagram"}
          content={
            description
              ? description
              : "Image sharing platform built on NASA’s image APIs for Shopify's front end developer intern challenge"
          }
        />
        <link rel="icon" href="/favicon.png" />
      </Head>

      {title && date && image && description && (
        <main className={styles.main}>
          <div className={styles.leftWrapper}>
            <button className={styles.return} onClick={() => router.replace("/")}>
              <IoReturnUpBack size={24} />
              &nbsp; Return to feed
            </button>
            <div className={styles.imageContainer}>
              <img onLoad={()=>handleImageResize()} alt="not found" src={image} />
            </div>
          </div>
          <div className={styles.rightWrapper}>
            <div className={styles.like} onClick={() => likeAritfact()}>
              {liked ? <AiFillHeart color="#FF5656" /> : <AiOutlineHeart />}
            </div>
            <div
              className={styles.share}
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setShareLinkCopied(true);
              }}
            >
              {shareLinkCopied ? "link copied" : <BiShareAlt />}
            </div>
            <div className={styles.original} onClick={() => window.open(image)}>
              {<FiExternalLink />}
            </div>
            <h4>A picture by {creator ? creator : "Unknown"}</h4>
            <h1>{title}</h1>
            <p>{description}</p>
            <span>{formatDate(date)}</span>
          </div>
        </main>
      )}
    </div>
  );
};

export default PostPage;