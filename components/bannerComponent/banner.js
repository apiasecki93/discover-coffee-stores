import banerCssModule from './banner.module.css';

export default function Banner(props) {

    return (
        <div className={banerCssModule.container}>
            <h1 className={banerCssModule.title}>
                <span className={banerCssModule.title1}>Coffe </span>
                <span className={banerCssModule.title2}>Connoisseur</span>
            </h1>
            <p className={banerCssModule.subTitle}>Discover your local coffe shops!</p>
            <div className={banerCssModule.buttonWrapper}>
                <button className={banerCssModule.button} onClick={props.handleOnClick}>{props.buttonText}</button>    
            </div>
        </div>
    )
}