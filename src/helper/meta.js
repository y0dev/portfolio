function updateMeta(title, description, image, type, url)
{
    
    document.querySelector('link[rel="canonical"]').setAttribute("href", url);
    document.querySelector('meta[property="og:url"]').setAttribute("content", url);

    document.querySelector('meta[property="og:type"]').setAttribute("content", type);

    document.querySelector('title').innerText = title;//setAttribute("content", title);
    document.querySelector('meta[property="og:title"]').setAttribute("content", title);
    document.querySelector('meta[property="twitter:title"]').setAttribute("content", title);

    document.querySelector('meta[property="og:image"]').setAttribute("content", `https://www.devontaereid.com/${image}`);
    document.querySelector('meta[property="twitter:image"]').setAttribute("content", `https://www.devontaereid.com/${image}`);

    document.querySelector('meta[name="description"]').setAttribute("content", description);
    document.querySelector('meta[property="og:description"]').setAttribute("content", description);
    document.querySelector('meta[property="twitter:description"]').setAttribute("content", description);
} 

// function addMeta(title, description, image, type, url) {
//     const properties = ["og:type", "og:title", "og:description", "og:image",
//         "twitter:title", "twitter:description", "twitter:image"]
//     properties.forEach((property, _) => {
//         let meta = document.createElement('meta');
//         if (property.includes('title'))
//         {
//             meta.property = property;
//             meta.key = property;
//             meta.content = title;   
//         }
//         else if (property.includes('description'))
//         {
//             meta.property = property;
//             meta.key = property;
//             meta.content = description; 
//         }
//         else if (property.includes('image') && image !== '')
//         {
//             meta.property = property;
//             meta.key = property;
//             meta.content = image; 
//         }
//         else if (property.includes('type'))
//         {
//             meta.property = property;
//             meta.key = property;
//             meta.content = type; 
//         }
//         else if (property.includes('image'))
//         {
//             meta.property = property;
//             meta.key = property;
//             meta.content = image; 
//         }
        
//         document.getElementsByTagName('head')[0].appendChild(meta); 
//     });
    
//     let meta = document.createElement('link');
//     meta.rel = 'canonical';
//     meta.href = url;
//     document.getElementsByTagName('head')[0].appendChild(meta);
    
//     meta = document.createElement('title');
//     meta.innerText = title;
//     document.getElementsByTagName('head')[0].appendChild(meta);

//     meta = document.createElement('meta');
//     meta.name = 'author';
//     meta.content = 'Devontae Reid';
//     document.getElementsByTagName('head')[0].appendChild(meta);

//     meta = document.createElement('meta');
//     meta.property = 'og:site_name';
//     meta.content = 'Devontae Reid';
//     document.getElementsByTagName('head')[0].appendChild(meta);

//     meta = document.createElement('meta');
//     meta.property = 'og:url';
//     meta.content = url;
//     document.getElementsByTagName('head')[0].appendChild(meta);
    
//     meta = document.createElement('meta');
//     meta.property = 'twitter:card';
//     meta.content = 'summary_large_image';
//     document.getElementsByTagName('head')[0].appendChild(meta);

//     meta = document.createElement('meta');
//     meta.property = 'twitter:site';
//     meta.content = '@_yodev_';
//     document.getElementsByTagName('head')[0].appendChild(meta);
// }

export default updateMeta