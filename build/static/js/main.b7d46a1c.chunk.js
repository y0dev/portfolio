(this.webpackJsonpportfolio=this.webpackJsonpportfolio||[]).push([[0],[,,,,,,,,,function(e){e.exports=JSON.parse('[{"title":"Chronicle.io","category":"Programming","content":"Have you ever been study a subject or about something in the past and recently tried to figure out what website you visited while studying that topic,but can\'t remember the website. With this tool,you can track your search history with ease with out all the extra searching. Still in progress. This is a mockup design.","preview_links":{"github":"https://github.com/y0dev/ologyDigitalFrontend"},"image":"https://i.ibb.co/yXCV9zD/histo-link-landing-v1.png","favorite":"Favorites"},{"title":"PrayerChain","category":"Programming","content":"Need a way to pray for those in need or those who ask for prayer. This application will allow you to pray for those people by way of reminder.","preview_links":{},"image":"","favorite":"Favorites"},{"title":"CMS-Ology","category":"Programming","content":"I Content Management System with the hopes to provide users with the capability to launch their blog or website. With this services users can create a popup shop where they can sell items that they made. Or talk about the hot topics and share with friends on your blog.","preview_links":{},"image":""},{"title":"Dev\'s Hotel Registry","category":"Programming","content":"A simple iOS project that was used to test Swift programming language at release in 2017","preview_links":{"github":"https://github.com/y0dev/DevHotel"},"image":""}]')},,,,,function(e,t,n){},function(e,t,n){},,function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var s=n(1),c=n.n(s),i=n(8),o=n.n(i),r=(n(14),n(2)),l=n(3),a=n(6),j=n(5),d=n(4),h=(n(15),n(0)),m=function(e){Object(j.a)(n,e);var t=Object(d.a)(n);function n(){var e;return Object(r.a)(this,n),(e=t.call(this)).state={menu_color:"",menu_bg_color:""},e.handleScroll=e.handleScroll.bind(Object(a.a)(e)),e.toggleMenu=e.toggleMenu.bind(Object(a.a)(e)),e}return Object(l.a)(n,[{key:"componentDidMount",value:function(){window.addEventListener("scroll",this.handleScroll)}},{key:"componentWillUnmount",value:function(){window.removeEventListener("scroll",this.handleScroll)}},{key:"handleScroll",value:function(e){var t=document.getElementById("nav-bar");document.documentElement.style.setProperty("--menu-color","#000000"),document.documentElement.style.setProperty("--menu-background-color","rgba(255, 255, 255, 0)"),t.style.position="fixed",t.style.top=20,t.style.left=0,0===window.scrollY?(document.documentElement.style.setProperty("--menu-background-color","#FFFFFF"),t.style.position="relative"):window.scrollY>=1&&window.scrollY<500?document.documentElement.style.setProperty("--menu-color","#FFFFFF"):window.scrollY>=500&&window.scrollY<550?document.documentElement.style.setProperty("--menu-background-color","rgba(255, 255, 255, 0.43)"):window.scrollY>=550&&window.scrollY<600?document.documentElement.style.setProperty("--menu-background-color","rgba(255, 255, 255, 0.863)"):window.scrollY>=600&&document.documentElement.style.setProperty("--menu-background-color","#FFFFFF"),this.setState({menu_color:document.documentElement.style.getPropertyValue("--menu-color"),menu_bg_color:document.documentElement.style.getPropertyValue("--menu-background-color")})}},{key:"toggleMenu",value:function(e){var t=document.getElementById("menu-button"),n=document.getElementById("side-menu");"menu-button"!==e.target.id&&"menu-line"!==e.target.className||(t.classList.toggle("active"),n.classList.toggle("show"));var s=document.documentElement.style.getPropertyValue("--menu-color"),c=document.documentElement.style.getPropertyValue("--menu-background-color");console.log(s,c),t.classList.contains("active")&&"#FFFFFF"===s&&"rgba(255, 255, 255, 0)"===c?(document.documentElement.style.setProperty("--menu-color","#000000"),document.documentElement.style.setProperty("--menu-background-color","rgba(255, 255, 255, 1)")):t.classList.contains("active")||(document.documentElement.style.setProperty("--menu-color",this.state.menu_color),document.documentElement.style.setProperty("--menu-background-color",this.state.menu_bg_color))}},{key:"closeMenu",value:function(e){if("side-link"===e.target.className){var t=document.getElementById("menu-button"),n=document.getElementById("side-menu");t.classList.toggle("active"),n.classList.toggle("show")}}},{key:"render",value:function(){return Object(h.jsx)("div",{id:"nav-bar",onScroll:this.handleScroll,className:"navbar",children:Object(h.jsxs)("nav",{children:[Object(h.jsxs)("div",{className:"main-menu",children:[Object(h.jsxs)("div",{className:"logo",children:[Object(h.jsx)("img",{src:"https://i.ibb.co/HY4dx9s/headshot.jpg",alt:"headshot"}),Object(h.jsx)("h3",{children:"Devontae Reid"})]}),Object(h.jsxs)("div",{id:"menu-button",className:"hamburger-menu",onClick:this.toggleMenu,children:[Object(h.jsx)("span",{className:"menu-line"}),Object(h.jsx)("span",{className:"menu-line"}),Object(h.jsx)("span",{className:"menu-line"}),Object(h.jsx)("span",{className:"menu-line"})]}),Object(h.jsxs)("ul",{children:[Object(h.jsx)("li",{children:Object(h.jsx)("a",{href:"#intro",children:"Home"})}),Object(h.jsx)("li",{children:Object(h.jsx)("a",{href:"#about-me",children:"About"})}),Object(h.jsx)("li",{children:Object(h.jsx)("a",{href:"#projects",children:"Projects"})}),Object(h.jsx)("li",{children:Object(h.jsx)("a",{href:"https://devssite.net/",children:"Blog"})}),Object(h.jsx)("li",{children:Object(h.jsx)("a",{href:"#contact-me",children:"Contact"})})]})]}),Object(h.jsx)("div",{id:"side-menu",className:"side-menu",children:Object(h.jsxs)("ul",{children:[Object(h.jsx)("li",{children:Object(h.jsx)("a",{className:"side-link",onClick:this.closeMenu,href:"#intro",children:"Home"})}),Object(h.jsx)("li",{children:Object(h.jsx)("a",{className:"side-link",onClick:this.closeMenu,href:"#about-me",children:"About"})}),Object(h.jsx)("li",{children:Object(h.jsx)("a",{className:"side-link",onClick:this.closeMenu,href:"#projects",children:"Projects"})}),Object(h.jsx)("li",{children:Object(h.jsx)("a",{className:"side-link",onClick:this.closeMenu,href:"https://devssite.net/",children:"Blog"})}),Object(h.jsx)("li",{children:Object(h.jsx)("a",{className:"side-link",onClick:this.closeMenu,href:"#contact-me",children:"Contact"})})]})})]})})}}]),n}(s.Component),u=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,26)).then((function(t){var n=t.getCLS,s=t.getFID,c=t.getFCP,i=t.getLCP,o=t.getTTFB;n(e),s(e),c(e),i(e),o(e)}))};n(17);var b=function(){return Object(h.jsx)("div",{className:"footer",children:Object(h.jsxs)("footer",{children:[Object(h.jsxs)("div",{className:"upper-section",children:[Object(h.jsxs)("div",{className:"my-info",children:[Object(h.jsx)("h2",{children:"Devontae Reid"}),Object(h.jsx)("p",{children:"A Full-Stack Web Developer building the Frontend of Websites and Web Applications that leads to the success of the overall product"})]}),Object(h.jsxs)("div",{className:"socials",children:[Object(h.jsx)("h2",{children:"Social"}),Object(h.jsxs)("ul",{children:[Object(h.jsx)("li",{children:Object(h.jsx)("a",{href:"https://www.linkedin.com/in/devontaereid/",children:Object(h.jsx)("ion-icon",{name:"logo-linkedin"})})}),Object(h.jsx)("li",{children:Object(h.jsx)("a",{href:"https://twitter.com/_yodev_",children:Object(h.jsx)("ion-icon",{name:"logo-twitter"})})}),Object(h.jsx)("li",{children:Object(h.jsx)("a",{href:"https://github.com/y0dev",children:Object(h.jsx)("ion-icon",{name:"logo-github"})})})]})]})]}),Object(h.jsx)("div",{className:"lower-section",children:Object(h.jsx)("div",{className:"copyright",children:Object(h.jsxs)("p",{children:["\xa9 Copyright 2021. Made by ",Object(h.jsx)("span",{children:"Devontae Reid"})]})})})]})})};n(18);var p=function(){return Object(h.jsxs)("section",{id:"intro",children:[Object(h.jsxs)("div",{className:"container",children:[Object(h.jsxs)("div",{className:"name",children:[Object(h.jsxs)("h2",{children:["Hi, I'm ",Object(h.jsx)("span",{children:"Devontae Reid"})]}),Object(h.jsx)("p",{children:"A Full-Stack Web Developer building the Frontend of Websites and Web Applications that leads to the success of the overall product"})]}),Object(h.jsxs)("a",{className:"reflective_bttn",href:"#projects",children:[Object(h.jsx)("span",{}),Object(h.jsx)("span",{}),Object(h.jsx)("span",{}),Object(h.jsx)("span",{}),"Projects"]})]}),Object(h.jsx)("div",{className:"mouse"})]})};n(19);var g=function(){return Object(h.jsx)("section",{id:"about-me",children:Object(h.jsxs)("div",{className:"content",children:[Object(h.jsx)("h2",{children:"A Glisp of Who I Am"}),Object(h.jsxs)("p",{children:["I am a Software Engineer currently working in embedded systems. From the start I started off in iOS development and from there grew to enjoy web development both Front-End and Back-End. Who would have known User Interface would be a love/hate relationship. The struggle of coming up with inspiration while at the same time enjoying the finish product. I am proficient in the following languages:",Object(h.jsx)("span",{className:"highlight",children:"HTML, CSS, JavaScript, C/C++, and Python"}),"The frameworks I currently work in is ",Object(h.jsx)("span",{className:"highlight",children:"ReactJS and VueJs"}),"."]}),Object(h.jsx)("p",{children:"In my free time I work on cool projects while experimenting with new technologies. Currently I'm working on an some api's that will also include a chrome extension the will be written in NodeJS."}),Object(h.jsxs)("p",{children:["If I'm not programming you will find me reading my bible or spending time with my family. The bible has brought me so much wisdom when it comes to life along with teaching me about the grace of God. My collections of books are growing I believe I'm north of 100 books in my collection. Here's a list of my study resources",Object(h.jsx)("span",{className:"highlight",children:Object(h.jsx)("a",{className:"web-link",href:"https://www.desiringgod.org/",children:"Desiring God"})}),"  ,",Object(h.jsxs)("span",{className:"highlight",children:[Object(h.jsx)("a",{className:"web-link",href:"https://www.gty.org/",children:"Grace To You"})," "]})," , and",Object(h.jsx)("span",{className:"highlight",children:Object(h.jsx)("a",{className:"web-link",href:"https://www.truthforlife.org/",children:" Truth for Life"})}),"."]}),Object(h.jsxs)("ul",{className:"icons",children:[Object(h.jsx)("li",{children:Object(h.jsx)("img",{id:"vuejs",src:"assets/icons/vue.png",alt:"vuejs"})}),Object(h.jsx)("li",{children:Object(h.jsx)("img",{id:"reactjs",src:"assets/icons/reactjs.png",alt:"reactjs"})}),Object(h.jsx)("li",{children:Object(h.jsx)("img",{id:"node",src:"assets/icons/node.png",alt:"node"})}),Object(h.jsx)("li",{children:Object(h.jsx)("img",{id:"python",src:"assets/icons/python.png",alt:"python"})}),Object(h.jsx)("li",{children:Object(h.jsxs)("a",{href:"assets/Devontae+Reid+Resume.pdf",className:"reflective_bttn",download:!0,children:[Object(h.jsx)("span",{}),Object(h.jsx)("span",{}),Object(h.jsx)("span",{}),Object(h.jsx)("span",{}),"Resume"]})})]})]})})},O=(n(20),n(9));n(21);var x=function(e){var t,n,s,c=[];if(e.project.content&&(t=Object(h.jsx)("p",{children:e.project.content})),e.project.image&&(n=Object(h.jsx)("img",{className:"cover-image",src:e.project.image,alt:"{props.project.title}"})),e.project.read&&(s=Object(h.jsx)("button",{className:"more",children:"Read More"})),e.project.preview_links)for(var i=0;i<e.project.preview_links.length;i++)c.push(Object(h.jsx)("a",{href:e.preview_link[i],children:Object(h.jsx)("img",{src:"/assets/icons/{props.preview_link[i].png}",alt:"img"})}));return Object(h.jsxs)("div",{className:"module-container module",children:[Object(h.jsxs)("header",{children:[Object(h.jsxs)("div",{className:"title-type",children:[Object(h.jsx)("h1",{children:e.project.title}),Object(h.jsx)("div",{className:"type-meta",children:e.project.category})]}),Object(h.jsx)("div",{className:"custom-icons",children:c})]}),t,n,s]})},v=(n(22),function(e){Object(j.a)(n,e);var t=Object(d.a)(n);function n(){return Object(r.a)(this,n),t.apply(this,arguments)}return Object(l.a)(n,[{key:"componentDidUpdate",value:function(){}},{key:"render",value:function(){return Object(h.jsx)("div",{onClick:this.props.handleChange,className:"filter_tag ".concat(this.props.state?"type-meta-active":"type-meta"),children:this.props.type})}}]),n}(c.a.Component)),y=function(e){Object(j.a)(n,e);var t=Object(d.a)(n);function n(){var e;return Object(r.a)(this,n),(e=t.call(this)).state={selectedType:"In Production",criteria:["In Production","Programming"]},e.toggleCriteria=e.toggleCriteria.bind(Object(a.a)(e)),e}return Object(l.a)(n,[{key:"filtered",value:function(){var e=this;return O.filter((function(t){return"In Production"===e.state.selectedType?"Favorites"===t.favorite:t.category===e.state.selectedType}))}},{key:"toggleCriteria",value:function(e){this.setState({selectedType:e.target.innerHTML})}},{key:"render",value:function(){var e=this,t=this.state.criteria.map((function(t,n){return Object(h.jsx)("li",{children:Object(h.jsx)(v,{type:t,state:t===e.state.selectedType,handleChange:e.toggleCriteria})},n)})),n=this.filtered().map((function(e,t){return Object(h.jsx)(x,{project:e},t)}));return Object(h.jsxs)("section",{id:"projects",children:[Object(h.jsx)("h1",{className:"section-title",children:"Projects"}),Object(h.jsx)("ul",{className:"criteria-list",children:t}),Object(h.jsx)("div",{className:"project-container",children:n})]})}}]),n}(c.a.Component),f=(n(23),n(24),function(e){Object(j.a)(n,e);var t=Object(d.a)(n);function n(){return Object(r.a)(this,n),t.apply(this,arguments)}return Object(l.a)(n,[{key:"render",value:function(){return Object(h.jsx)("div",{id:"contact-me",children:Object(h.jsxs)("div",{className:"contact-container",children:[Object(h.jsx)("h2",{children:"Contact Me"}),Object(h.jsx)("p",{children:"Have a question or want to work together?"}),Object(h.jsxs)("form",{action:"https://formsubmit.co/5b4a6d6ac9785996e30f9641322bfb99",method:"POST",children:[Object(h.jsx)("input",{type:"hidden",name:"_subject",value:"New submission!"}),Object(h.jsx)("div",{className:"row100",children:Object(h.jsx)("div",{className:"col",children:Object(h.jsxs)("div",{className:"inputBox",children:[Object(h.jsx)("input",{type:"text",name:"name",required:!0}),Object(h.jsx)("span",{className:"text",children:"Name"}),Object(h.jsx)("span",{className:"line"})]})})}),Object(h.jsxs)("div",{className:"row100",children:[Object(h.jsx)("div",{className:"col",children:Object(h.jsxs)("div",{className:"inputBox",children:[Object(h.jsx)("input",{type:"email",name:"email",required:!0}),Object(h.jsx)("span",{className:"text",children:"Email"}),Object(h.jsx)("span",{className:"line"})]})}),Object(h.jsx)("div",{className:"col",children:Object(h.jsxs)("div",{className:"inputBox",children:[Object(h.jsx)("input",{type:"tel",id:"phone",name:"phone",pattern:"[0-9]{3}-[0-9]{3}-[0-9]{4}",required:!0}),Object(h.jsxs)("span",{className:"text",children:["Phone",Object(h.jsx)("span",{className:"tempVal",children:": 123-456-7890"})]}),Object(h.jsx)("span",{className:"line"})]})})]}),Object(h.jsx)("div",{className:"row100",children:Object(h.jsx)("div",{className:"col",children:Object(h.jsxs)("div",{className:"inputBox textarea",children:[Object(h.jsx)("textarea",{type:"text",name:"message",required:!0}),Object(h.jsx)("span",{className:"text",children:"Type your message here..."}),Object(h.jsx)("span",{className:"line"})]})})}),Object(h.jsx)("div",{className:"row100",children:Object(h.jsx)("div",{className:"col",children:Object(h.jsx)("input",{type:"submit",value:"Send"})})})]})]})})}}]),n}(c.a.Component));o.a.render(Object(h.jsxs)(c.a.StrictMode,{children:[Object(h.jsx)(m,{}),Object(h.jsx)(p,{}),Object(h.jsx)(g,{}),Object(h.jsx)(y,{}),Object(h.jsx)(f,{}),Object(h.jsx)(b,{})]}),document.getElementById("root")),u()}],[[25,1,2]]]);
//# sourceMappingURL=main.b7d46a1c.chunk.js.map