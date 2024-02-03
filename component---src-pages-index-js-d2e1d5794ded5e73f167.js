"use strict";(self.webpackChunktest_conducir_buenos_aires=self.webpackChunktest_conducir_buenos_aires||[]).push([[678],{1476:function(e,t,n){n.d(t,{Z:function(){return g}});var l=n(5785),a=n(7294);var s=e=>{let{children:t}=e;return a.createElement("div",{className:"w-full p-4"},a.createElement("main",{role:"main",className:"w-full flex flex-col content-center justify-center"},a.createElement("div",{className:"w-full sm:w-1/2 lg:w-1/3 bg-gray-50 rounded-xl m-auto"},a.createElement("div",{className:"bg-white rounded shadow px-4 pt-5 pb-4 sm:p-6 sm:pb-4"},t))))},r=n(5825);var c=e=>{let{question:t,language:n}=e;const l="0"!==n;return a.createElement(a.Fragment,null,a.createElement("p",{className:"text-xl mb-2"},t.text),l?a.createElement("p",{className:"text-sm text-gray-600 mb-2"},(0,r.i)(t.text)):l&&a.createElement("p",{className:"text-sm text-red-600 mb-2"},"нет перевода"),t.img?a.createElement("img",{className:"mt-6 rounded-sm",src:t.img,alt:t.text}):null)};var u=e=>{let{language:t,onChange:n}=e;return a.createElement("div",null,a.createElement("label",{htmlFor:"underline_select",className:"sr-only"},"Underline select"),a.createElement("select",{id:"underline_select",defaultValue:t,onChange:e=>n(e.target.value),style:{textAlignLast:"right"},className:"block w-full text-sm text-gray-500 focus:outline-none"},a.createElement("option",{value:"0"},"Без перевода (выбор языка)"),a.createElement("option",{value:"ru"},"Русский")))};var m=e=>{let{stat:t}=e;return a.createElement("div",{className:"text-xs"},"вопросов: ",t.total,", выучено: ",t.total-t.queued)};var o=e=>{let{number:t,language:n,onUpdateLang:l,stat:s}=e;return a.createElement("div",{className:"mb-8"},a.createElement("div",{className:"flex flex-row items-center justify-between"},a.createElement("h3",{className:"text-sm"},"Вопрос ",t),a.createElement(u,{language:n,onChange:l})),a.createElement("div",null,a.createElement(m,{stat:s})))};var i=e=>{let{responses:t,language:n,isAnswered:l,selected:s,onSelect:c}=e;return a.createElement("ul",{className:"mt-6"},t.map(((e,t)=>{let u="text-gray-900";l&&e.correct&&(u="text-green-700");const m="0"!==n;return a.createElement("li",{className:"mb-4",key:t},a.createElement("div",{className:"flex items-center"},a.createElement("input",{id:`default-radio-${t}`,type:"radio",value:"",checked:t===s,name:"default-radio",onChange:()=>c(t),className:"w-4 h-4 focus:ring-0"}),a.createElement("label",{htmlFor:`default-radio-${t}`,className:`ml-3 ms-2 text-sm font-medium ${u}`},e.text)),m?a.createElement("p",{className:"text-sm mb-6 text-gray-600"},(0,r.i)(e.text)):m&&a.createElement("p",{className:"text-sm mb-6 text-red-600"},"нет перевода"))})))};var d=e=>{let{isAnswered:t,selected:n,onAnswer:l,onNext:s}=e;const r=e=>{let{children:t}=e;return a.createElement("div",{className:"flex flex-row justify-center mt-10"},t)};if(t)return a.createElement(r,null,a.createElement("button",{onClick:()=>s(),className:"bg-gray-100 hover:bg-gray-200 text-black font-bold py-2 px-4 rounded"},"Следующий вопрос"));let c="bg-green-700 hover:bg-green-800 text-white",u="Проверить ответ";return null===n&&(c="bg-gray-300 hover:bg-gray-400 text-black",u="Выберите ответ"),a.createElement(r,null,a.createElement("button",{onClick:()=>l(),disabled:null===n,className:`${c} font-bold py-2 px-4 rounded`},u))};var g=e=>{let{questions:t,postfix:n}=e;const r=()=>{return{index:0,language:"0",selectedAnswer:null,isAnswered:!1,stat:{questions:{},total:t.length},queue:(e=Object.keys(t),e.map((e=>({value:e,sort:Math.random()}))).sort(((e,t)=>e.sort-t.sort)).map((e=>{let{value:t}=e;return t})))};var e};let u="undefined"!=typeof window&&localStorage.getItem(`state${n}`);u=u?JSON.parse(u):r();const[m,g]=a.useState(u),x=e=>{const t={...m,...e};"undefined"!=typeof window&&localStorage.setItem(`state${n}`,JSON.stringify(t)),g(t)};if(!m.queue.length)return a.createElement(s,null,a.createElement("div",{className:"mb-5"},"Ты все выучил, поздравляю!"),a.createElement("button",{onClick:()=>x(r()),className:"bg-gray-100 hover:bg-gray-200 text-black font-bold py-2 px-4 rounded mb-5"},"Сбросить"));const E=t[m.index];return a.createElement(a.Fragment,null,a.createElement(s,null,a.createElement(o,{number:Number(m.index)+1,language:m.language,onUpdateLang:e=>x({language:e}),stat:{...m.stat,queued:m.queue.length}}),a.createElement(c,{question:E,language:m.language}),a.createElement(i,{responses:E.responses,language:m.language,isAnswered:m.isAnswered,selected:m.selectedAnswer,onSelect:e=>!m.isAnswered&&x({selectedAnswer:e})}),a.createElement(d,{isAnswered:m.isAnswered,selected:m.selectedAnswer,onAnswer:()=>{let e={...m.stat},t=(0,l.Z)(m.queue);e.questions[m.index]||(e.questions[m.index]=0),E.responses[m.selectedAnswer].correct?e.questions[m.index]++:e.questions[m.index]=0,e.questions[m.index]>3&&(delete e.questions[m.index],t.splice(t.indexOf(String(m.index)),1)),x({isAnswered:!0,stat:e,queue:t})},onNext:()=>{const e=m.queue.length?m.queue[Math.floor(Math.random()*m.queue.length)]:null;x({index:e,selectedAnswer:null,isAnswered:!1})}})))}},6558:function(e,t,n){n.r(t),n.d(t,{Head:function(){return r}});var l=n(7294),a=n(4938),s=n(1476);t.default=()=>{const e=(0,a.t)();return l.createElement(s.Z,{questions:e,postfix:""})};const r=()=>l.createElement("title",null,"Test Conducir Buenos Aires, Category B")}}]);
//# sourceMappingURL=component---src-pages-index-js-d2e1d5794ded5e73f167.js.map