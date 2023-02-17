import React from 'react';
import { Helmet } from "react-helmet";

function HeaderMeta(props) {
    return (
       <Helmet>
            {/* <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#000000" /> */}
            <title>{props.title}</title>
            <link rel="canonical" href={props.url} />
            <meta name="description" content={props.description}/>
            <meta name="author" content="Devontae Reid"/>
            <meta key="og:type" property="og:type" content={props.type}/>
            <meta key="og:title" property="og:title" content={props.title}/>
            <meta key="og:url" property="og:url" content={props.url}/>
            <meta key="og:description" property="og:description" content={props.description} />
            <meta key="og:site_name" property="og:site_name" content="Devontae Reid"/>
            <meta key="og:image" property="og:image" href={props.image} content={`${props.image}`} />
            <meta key="twitter:title" property="twitter:title" content={props.title}/>
            <meta key="twitter:description" property="twitter:description" content={props.description}/>
            <meta key="twitter:image" property="twitter:image" href={props.image} content={`${props.image}`}/>
            <meta key="twitter:card" property="twitter:card" content="'summary_large_image"/>
            <meta key="twitter:site" property="twitter:site" content="'@_yodev_" />
            {/* <link rel="apple-touch-icon" sizes="120x120" href={props.image}/>
            <link rel="apple-touch-icon" sizes="120x120" href={props.image}/>
            <link rel="apple-touch-icon" sizes="144x144" href={props.image}/>
            <link rel="apple-touch-icon" sizes="152x152" href={props.image}/>
            <link rel="apple-touch-icon" sizes="180x180" href={props.image}/>
            <link rel="icon" type="image/png" href={props.image} sizes="16x16"/>
            <link rel="icon" type="image/png" href={props.image} sizes="96x96"/>
            <link rel="icon" type="image/png" href={props.image} sizes="192x192"/>
            <link rel="icon" type="image/png" href={props.image} sizes="228x228"/>
            <link rel="icon" type="image/png" href={props.image} sizes="230x230"/> */}
            </Helmet>
    )
}

export default HeaderMeta