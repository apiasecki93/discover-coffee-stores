import { useRouter } from "next/router"
import Link from "next/link"
import Head from "next/head"
import Image from "next/image"

//import coffeeStoresData from "../../data/coffee-stores.json"
import Router from "next/router"

//css
import styles from "./coffe-store.module.css"
import cls from 'classnames'

import { fetchCoffeeStores } from "../../lib/coffee-stores"



export async function getStaticProps(staticProps) { //getStaticProps for an individual page, in this case selected coffe link from index will return for current restaturant
    const params = staticProps.params; // alternativly we could destructure params from staticProps with getStaticProps({params})
    //console.log(params)

    const  coffeeStores = await fetchCoffeeStores();
    const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
        return coffeeStore.id.toString() === params.id//<params.id> dynamic id from staticProps.params
    });
    return {
        props: {
            coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
        },
  }
}

export async function getStaticPaths() { // this function is for getting paths for all pages, in this case we have only one page, so we return only one path
    // first example with hard coded params, in second example we will make dynamic params
        // return {
        //     paths: [
        //         // { params: { id: "0" } },
        //         // { params: { id: "1" } },
        //         // { params: {id: '300'} },
        //     ],  //params are commented because falback is tru and that why I'm using if statment with router.isFallback to display "loading.." data 
        //     fallback: true,
        // }

        //dynamic params example
    const  coffeeStores = await fetchCoffeeStores();

    const paths = coffeeStores.map((coffeeStore) => {
        return {
            params: {
                id: coffeeStore.id.toString(),
            },
        };
    });
    return {
        paths,
        fallback: true,
    };
}

export default function CoffeeStore(props) {
    const router = useRouter()
    //console.log(router)
    
    if (router.isFallback) {
        return <div>Loading</div>
    }
    const {location,  name, neighbourhood, imgUrl} = props.coffeeStore // destructure from props.coffeeStore and it has to be after loading state to give a time to load data first before access 

    console.log(location, 'location')
    const handleUpvoteButton = () => {
        console.log("Handle upvote button")
    }


    return (
        <div className={styles.layout}>
            <Head>
                <title>{name}</title>
            </Head>
            <div className={styles.container}>
                <div className={styles.col1}>
                    <div className={styles.backToHomeLink}>
                        {/* Coffe Store Page {router.query.id}  */}
                       

                        <Link href="/"><a>&#8666;  Back to Home</a></Link>
                    </div>
                    <div className={styles.nameWrapper}>
                        <h1 className={styles.name}>{name}</h1>
                    </div>
                    <Image src={imgUrl || 'https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80'} width={600} height={360} className={styles.storeImg} alt={name}/>
                </div>
                 <div className={cls("glass", styles.col2)}>
                    <div className={styles.iconWrapper}>
                        <Image src="/static/icons/pinDrop.svg" width="24" height="24" className={styles.icon} alt=""/>
                        <p className={styles.text}>{ location.address }</p>
                    </div>
                    { location.neighborhood &&
                    <div className={styles.iconWrapper}>
                        <Image src="/static/icons/nearMe.svg" width="24" height="24" className={styles.icon} alt=""/>
                        <p className={styles.text}>{location.neighborhood}</p>
                    </div>
                    }
                    <div className={styles.iconWrapper}>
                        <Image src="/static/icons/thumbUp.svg" width="24" height="24" className={styles.icon} alt=""/>
                        <p className={styles.text}>1</p>
                    </div>

                    <button className={styles.upvoteButton} onClick={handleUpvoteButton}>Up Vote!</button>
                </div>
            </div>
        </div>
    )
}