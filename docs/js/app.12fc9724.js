(function(e){function t(t){for(var r,l,u=t[0],c=t[1],i=t[2],s=0,b=[];s<u.length;s++)l=u[s],Object.prototype.hasOwnProperty.call(n,l)&&n[l]&&b.push(n[l][0]),n[l]=0;for(r in c)Object.prototype.hasOwnProperty.call(c,r)&&(e[r]=c[r]);v&&v(t);while(b.length)b.shift()();return o.push.apply(o,i||[]),a()}function a(){for(var e,t=0;t<o.length;t++){for(var a=o[t],r=!0,l=1;l<a.length;l++){var c=a[l];0!==n[c]&&(r=!1)}r&&(o.splice(t--,1),e=u(u.s=a[0]))}return e}var r={},n={app:0},o=[];function l(e){return u.p+"js/"+({about:"about"}[e]||e)+"."+{about:"c787ca3d"}[e]+".js"}function u(t){if(r[t])return r[t].exports;var a=r[t]={i:t,l:!1,exports:{}};return e[t].call(a.exports,a,a.exports,u),a.l=!0,a.exports}u.e=function(e){var t=[],a=n[e];if(0!==a)if(a)t.push(a[2]);else{var r=new Promise((function(t,r){a=n[e]=[t,r]}));t.push(a[2]=r);var o,c=document.createElement("script");c.charset="utf-8",c.timeout=120,u.nc&&c.setAttribute("nonce",u.nc),c.src=l(e);var i=new Error;o=function(t){c.onerror=c.onload=null,clearTimeout(s);var a=n[e];if(0!==a){if(a){var r=t&&("load"===t.type?"missing":t.type),o=t&&t.target&&t.target.src;i.message="Loading chunk "+e+" failed.\n("+r+": "+o+")",i.name="ChunkLoadError",i.type=r,i.request=o,a[1](i)}n[e]=void 0}};var s=setTimeout((function(){o({type:"timeout",target:c})}),12e4);c.onerror=c.onload=o,document.head.appendChild(c)}return Promise.all(t)},u.m=e,u.c=r,u.d=function(e,t,a){u.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},u.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},u.t=function(e,t){if(1&t&&(e=u(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(u.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)u.d(a,r,function(t){return e[t]}.bind(null,r));return a},u.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return u.d(t,"a",t),t},u.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},u.p="PenAndPhone/",u.oe=function(e){throw console.error(e),e};var c=window["webpackJsonp"]=window["webpackJsonp"]||[],i=c.push.bind(c);c.push=t,c=c.slice();for(var s=0;s<c.length;s++)t(c[s]);var v=i;o.push([0,"chunk-vendors"]),a()})({0:function(e,t,a){e.exports=a("cd49")},"15cd":function(e,t,a){},"9aa6":function(e,t,a){"use strict";a("15cd")},"9cdc":function(e,t,a){"use strict";a("c701")},c701:function(e,t,a){},cd49:function(e,t,a){"use strict";a.r(t);a("e260"),a("e6cf"),a("cca6"),a("a79d");var r=a("7a23"),n={id:"nav"},o=Object(r["f"])("Home"),l=Object(r["f"])(" | "),u=Object(r["f"])("About");function c(e,t,a,c,i,s){var v=Object(r["v"])("router-link"),b=Object(r["v"])("router-view");return Object(r["p"])(),Object(r["d"])(r["a"],null,[Object(r["g"])("div",n,[Object(r["g"])(v,{to:"/"},{default:Object(r["B"])((function(){return[o]})),_:1}),l,Object(r["g"])(v,{to:"/about"},{default:Object(r["B"])((function(){return[u]})),_:1})]),Object(r["g"])(b)],64)}a("9cdc");const i={};i.render=c;var s=i,v=a("9483");Object(v["a"])("".concat("PenAndPhone/","service-worker.js"),{ready:function(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered:function(){console.log("Service worker has been registered.")},cached:function(){console.log("Content has been cached for offline use.")},updatefound:function(){console.log("New content is downloading.")},updated:function(){console.log("New content is available; please refresh.")},offline:function(){console.log("No internet connection found. App is running in offline mode.")},error:function(e){console.error("Error during service worker registration:",e)}});a("d3b7");var b=a("8c4f"),d=a("cf05"),p=a.n(d),f={class:"home"},g=Object(r["g"])("img",{alt:"Vue logo",src:p.a},null,-1);function h(e,t,a,n,o,l){var u=Object(r["v"])("HelloWorld");return Object(r["p"])(),Object(r["d"])("div",f,[g,Object(r["g"])(u,{msg:"Welcome to Your Vue.js + TypeScript App"})])}var j=Object(r["C"])("data-v-79551b00");Object(r["s"])("data-v-79551b00");var m={class:"hello"},O=Object(r["e"])('<p data-v-79551b00> For a guide and recipes on how to configure / customize this project,<br data-v-79551b00> check out the <a href="https://cli.vuejs.org" target="_blank" rel="noopener" data-v-79551b00>vue-cli documentation</a>. </p><h3 data-v-79551b00>Installed CLI Plugins</h3><ul data-v-79551b00><li data-v-79551b00><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank" rel="noopener" data-v-79551b00>babel</a></li><li data-v-79551b00><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa" target="_blank" rel="noopener" data-v-79551b00>pwa</a></li><li data-v-79551b00><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-router" target="_blank" rel="noopener" data-v-79551b00>router</a></li><li data-v-79551b00><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-vuex" target="_blank" rel="noopener" data-v-79551b00>vuex</a></li><li data-v-79551b00><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank" rel="noopener" data-v-79551b00>eslint</a></li><li data-v-79551b00><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-unit-jest" target="_blank" rel="noopener" data-v-79551b00>unit-jest</a></li><li data-v-79551b00><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-typescript" target="_blank" rel="noopener" data-v-79551b00>typescript</a></li></ul><h3 data-v-79551b00>Essential Links</h3><ul data-v-79551b00><li data-v-79551b00><a href="https://vuejs.org" target="_blank" rel="noopener" data-v-79551b00>Core Docs</a></li><li data-v-79551b00><a href="https://forum.vuejs.org" target="_blank" rel="noopener" data-v-79551b00>Forum</a></li><li data-v-79551b00><a href="https://chat.vuejs.org" target="_blank" rel="noopener" data-v-79551b00>Community Chat</a></li><li data-v-79551b00><a href="https://twitter.com/vuejs" target="_blank" rel="noopener" data-v-79551b00>Twitter</a></li><li data-v-79551b00><a href="https://news.vuejs.org" target="_blank" rel="noopener" data-v-79551b00>News</a></li></ul><h3 data-v-79551b00>Ecosystem</h3><ul data-v-79551b00><li data-v-79551b00><a href="https://router.vuejs.org" target="_blank" rel="noopener" data-v-79551b00>vue-router</a></li><li data-v-79551b00><a href="https://vuex.vuejs.org" target="_blank" rel="noopener" data-v-79551b00>vuex</a></li><li data-v-79551b00><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener" data-v-79551b00>vue-devtools</a></li><li data-v-79551b00><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener" data-v-79551b00>vue-loader</a></li><li data-v-79551b00><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener" data-v-79551b00>awesome-vue</a></li></ul>',7);Object(r["q"])();var k=j((function(e,t,a,n,o,l){return Object(r["p"])(),Object(r["d"])("div",m,[Object(r["g"])("h1",null,Object(r["x"])(e.msg),1),O])})),w=Object(r["h"])({name:"HelloWorld",props:{msg:String}});a("9aa6");w.render=k,w.__scopeId="data-v-79551b00";var y=w,_=Object(r["h"])({name:"Home",components:{HelloWorld:y}});_.render=h;var P=_,x=[{path:"/",name:"Home",component:P},{path:"/about",name:"About",component:function(){return a.e("about").then(a.bind(null,"f820"))}}],A=Object(b["a"])({history:Object(b["b"])(),routes:x}),C=A,S=a("5502"),E=Object(S["a"])({state:{},mutations:{},actions:{},modules:{}});Object(r["c"])(s).use(E).use(C).mount("#app")},cf05:function(e,t,a){e.exports=a.p+"img/logo.82b9c7a5.png"}});
//# sourceMappingURL=app.12fc9724.js.map