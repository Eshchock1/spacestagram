import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/feed.module.css";
import axios from "axios";
import Post from "../components/post";

const Home: NextPage = () => {
  const apikey = "BkltarX2SapKEI0XAP7R1z1SqM80I9GhjFbn0B9G";
  const [featured, setFeatured] = useState([]);
  const [feed, setFeed] = useState([]);
  const [gridColumns, setGridColumns] = useState(0);
  const [filter, setFilter] = useState("All");
  const allFilters =
    "orion, International Space Station, hubble, Mars 2020, space x, apollo, history";

  useEffect(() => {
    let today = new Date();
    today.setDate(today.getDate() - 15);
    let dateString =
      today.getFullYear().toString() +
      "-" +
      (today.getMonth() + 1).toString() +
      "-" +
      today.getDate().toString();
    axios
      .get(
        `https://api.nasa.gov/planetary/apod?api_key=${apikey}&start_date=${dateString}`
      )
      .then((res) => {
        setFeatured(res.data.reverse());
      });
  }, []);

  useEffect(() => {
    if (filter == "All") {
      axios
        .get(
          `https://images-api.nasa.gov/search?keywords=${allFilters}&media_type=image&page=1`
        )
        .then((res) => {
          setFeed(res.data.collection.items);
        });
    } else {
      axios
        .get(
          `https://images-api.nasa.gov/search?keywords=${filter}&media_type=image&page=1`
        )
        .then((res) => {
          setFeed(res.data.collection.items);
        });
    }
  }, [filter]);

  function resizeGrid() {
    if (document) {
      const container = document.getElementsByClassName(
        styles.grid
      )[0] as HTMLElement;
      const container2 = document.getElementsByClassName(
        styles.grid
      )[1] as HTMLElement;
      if (window.innerWidth > 1024) {
        const columns = Math.floor(
          container.offsetWidth / ((17 * 0.8 + 4) * 16)
        );
        setGridColumns(columns);
        container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        container2.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
      } else {
        const columns = Math.floor(
          container.offsetWidth / ((17 * 0.8 + 4) * 16)
        );
        setGridColumns(columns);
        container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        container2.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
      }
    }
  }

  useEffect(() => {
    resizeGrid();
    window.addEventListener("resize", resizeGrid, false);
    return () => {
      window.removeEventListener("resize", resizeGrid, false);
    };
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Spacestagram</title>
        <meta
          name="Spacestagram"
          content="Image sharing platform built on NASA’s image APIs for Shopify's front end developer intern challenge"
        />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className={styles.main}>
        <div className={styles.contentWrapper}>
          <div className={styles.featured}>
            <h1 className={styles.title}>Spacestagram&apos;s Featured Posts</h1>
            <div className={styles.grid}>
              {featured.map((post: any, key: number) => {
                return (
                  post.title &&
                  post.explanation &&
                  post.url &&
                  post.media_type == "image" &&
                  (key < gridColumns || key == 0) && (
                    <div key={key} className={styles.postWrapper}>
                      <Post
                        id={"apod-" + post.date}
                        title={post.title}
                        description={post.explanation}
                        creator={post.copyright}
                        image={post.url}
                        date={post.date}
                      />
                    </div>
                  )
                );
              })}
            </div>
          </div>
          <div className={styles.feed}>
            <h1 className={styles.title}>Your Feed</h1>
            <div className={styles.filters}>
              <div
                onClick={() => setFilter("All")}
                className={filter === "All" ? styles.active : ""}
              >
                All
              </div>
              <div
                onClick={() => setFilter("Orion")}
                className={filter === "Orion" ? styles.active : ""}
              >
                Orion
              </div>
              <div
                onClick={() => setFilter("International Space Station")}
                className={
                  filter === "International Space Station" ? styles.active : ""
                }
              >
                Space Station
              </div>
              <div
                onClick={() => setFilter("hubble")}
                className={filter === "hubble" ? styles.active : ""}
              >
                Hubble
              </div>
              <div
                onClick={() => setFilter("space x")}
                className={filter === "space x" ? styles.active : ""}
              >
                SpaceX
              </div>
              <div
                onClick={() => setFilter("history")}
                className={filter === "history" ? styles.active : ""}
              >
                Historic
              </div>
              <div
                onClick={() => setFilter("Mars 2020")}
                className={filter === "Mars 2020" ? styles.active : ""}
              >
                Mars
              </div>
              <div
                onClick={() => setFilter("apollo")}
                className={filter === "apollo" ? styles.active : ""}
              >
                Apollo
              </div>
            </div>
            <div className={styles.grid}>
              {feed.map((post: any, key: number) => {
                return (
                  post.data[0] &&
                  post.data[0].nasa_id &&
                  post.links[0].href &&
                  post.data[0].description &&
                  post.data[0].title &&
                  post.data[0].date_created && (
                    <Post
                      key={key}
                      id={post.data[0].nasa_id}
                      title={post.data[0].title}
                      description={post.data[0].description}
                      creator={post.data[0].center}
                      image={post.links[0].href}
                      date={post.data[0].date_created}
                    />
                  )
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;