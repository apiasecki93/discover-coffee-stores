import { useRouter } from "next/router"
import Link from "next/link"
import Head from "next/head"
import Image from "next/image"
import useSWR from "swr"

//css
import styles from "./coffe-store.module.css"
import cls from 'classnames'

import { fetchCoffeeStores } from "../../lib/coffee-stores"
import { StoreContext } from '../../store/store-context'
import {useContext, useState, useEffect} from 'react'
import { isEmpty, fetcher } from "../../utils";



export async function getStaticProps(staticProps) {
  const params = staticProps.params;
  //console.log("params");
  //console.log(params);

  const coffeeStores = await fetchCoffeeStores();
  const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
    return coffeeStore.id.toString() === params.id; //dynamic [id]
  });
  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    },
  };
}

export async function getStaticPaths() {
  //console.log("STep getStaticPaths");
  const coffeeStores = await fetchCoffeeStores();
  // console.log(coffeeStores);
  const paths = coffeeStores.map((coffeeStore) => {
    return {
      params: { id: coffeeStore.toString() },
    };
  });
  return {
    // paths: [{ params: { id: "0" } }, { params: { id: "1" } }],
    paths,
    // no 404 page
    fallback: true,
  };
}

const CoffeeStore = (initialProps) => {
  const router = useRouter();
 // console.log(router.query , 'line 54 [id]')
  const id = router.query.id;
  //console.log( id);

  // get props from intialProps and the found ones

  //console.log(initialProps.coffeeStore, 'line 58 coffeeStore');

 
  
  const [coffeeStore, setCoffeeStore] = useState(
    initialProps.coffeeStore || {}
    );
  
  
  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  
  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      //console.log("coffeeStore");
      //console.log(coffeeStore);
      const { id, name, voting,  imgUrl, neighborhood, address } = coffeeStore;
      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          voting: 0,
          imgUrl,
          neighbourhood: neighborhood || "",
          address: address || "",
        }),
      });
      const dbCoffeeStore = await response.json();
      //console.log("dbCoffeeStore ind [id] line 101", dbCoffeeStore);
    } catch (error) {
      console.error("Error creating coffee store", error);
    }
  };

  useEffect(() => {
     //console.log("STep useEffect");
    // console.log("initialProps.coffeeStore");
     //console.log("[id] initial props line 110",initialProps.coffeeStore);
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        //("true, more stores found");
        const coffeeStoreFromContext = coffeeStores.find((coffeeStore) => {
          // if (coffeeStore.id.toString() === id) {
          //   console.log("found id", id);
          //   console.log("coffee store 97", coffeeStore);
          // }

          return coffeeStore.id.toString() === id; //dynamic [id]
        });

        // return {
        //   props: {
        //     coffeeStore: coffeeStoreFromContext ? coffeeStoreFromContext : {},
        //   },
        // };
        if (coffeeStoreFromContext) {
          // console.log(coffeeStoreFromContext);
          setCoffeeStore(coffeeStoreFromContext);
          handleCreateCoffeeStore(coffeeStoreFromContext);
        }
      }
    } else {
      // SSR - Server Side Rendering
      // the Stores loaded as default (without searching)
      handleCreateCoffeeStore(initialProps.coffeeStore);
      //console.log('entered else statement in [id].js line 135');
    }
  }, [id, coffeeStores, initialProps, initialProps.coffeeStore]);

  const [votingCount, setVotingCount] = useState(0);


  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher); //fetcher exported in utils.js


useEffect(() => {
    if (data && data.length > 0) {
      //console.log('data from SWR', data)
      setCoffeeStore(data[0])
      setVotingCount(data[0].voting)
    }
}, [data])


if (error) {
  return <div>Something went wrong retreving coffe store page [id] line 148</div>
}

  const handleUpvoteButton = async () => {
   // console.log("upvoted");

    try {
      //console.log("coffeeStore");
      const response = await fetch("/api/favouriteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });
      const dbCoffeeStore = await response.json(); //dbCoffeeStore return array of objects and it will be empty if the specific request do not go trough
      //console.log("dbCoffeeStore id [id] line 101", dbCoffeeStore);
      if (dbCoffeeStore && dbCoffeeStore.length > 0) { // if true then voting count can be incremented
        let count = votingCount + 1;
        setVotingCount(count);
      }
    } catch (error) {
        console.error("Error upvoting the coffee store", error);
    }
  };


  if (router.isFallback === true) {
    return <div>Loading...</div>;
  }

  if (coffeeStore) {
    const { address, location, name, imgUrl } = coffeeStore;
    
    return (
      <div className={styles.layout}>
        <Head>
          <title>{name}</title>
          <meta name="description" content={`${name} coffee store`}></meta>

        </Head>
        <div className={styles.container}>
          <div className={styles.col1}>
            <div className={styles.backToHomeLink}>
              <Link href="/">
                <a>
                  ←{" "}
                  <span style={{ textDecoration: "underline" }}>
                    Back to Home
                  </span>
                </a>
              </Link>
            </div>
            <div className={styles.nameWrapper}>
              <h1>{name}</h1>
            </div>
            <Image
            alt="banner image"
              src={
                imgUrl ||
                "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
              }
              width={600}
              height={360}
              className={styles.storeImg}
              
            />
          </div>
          {/* Col 2 */}
          <div className={cls("glass", styles.col2)}>
            <div className={styles.iconWrapper}>
              <Image
              
                src="/static/icons/pinDrop.svg"
                width={24}
                height={24}
                alt="Icon pinDrop"
              />
              <p className={styles.text}>{address}</p>
            </div>
            {location?.neighborhood && (
              <div className={styles.iconWrapper}>
                <Image
                  src="/static/icons/nearMe.svg"
                  width={24}
                  height={24}
                  alt="Icon nearMe"
                />
                <p className={styles.text}>{location.neighborhood}</p>
              </div>
            )}

            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/thumbUp.svg"
                width={24}
                height={24}
                alt="Icon thumbUp"
              />
              <p className={styles.text}>{votingCount}</p>
            </div>
            <button
              className={styles.upvoteButton}
              onClick={handleUpvoteButton}
            >
              Upvote
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.layout}>
        <Head>
          <title>{name}</title>
        </Head>
        <div className={styles.container}>
          <div className={styles.col1}>
            <div className={styles.backToHomeLink}>
              <Link href="/">
                <a>
                  ←{" "}
                  <span style={{ textDecoration: "underline" }}>
                    Back to Home
                  </span>
                </a>
              </Link>
            </div>
          </div>
          {/* Col 2 */}
        </div>
      </div>
    );
  }
};

export default CoffeeStore;

// We used Context for CSR (Client Side Rendering)using Dynamic routes to get the coffeeStore data from  the server when 