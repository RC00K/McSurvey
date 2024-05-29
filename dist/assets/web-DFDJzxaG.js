import{W as P,e as x,E}from"./index-xbms31QN.js";function m(w){const e=w.split("/").filter(t=>t!=="."),r=[];return e.forEach(t=>{t===".."&&r.length>0&&r[r.length-1]!==".."?r.pop():r.push(t)}),r.join("/")}function R(w,e){w=m(w),e=m(e);const r=w.split("/"),t=e.split("/");return w!==e&&r.every((i,n)=>i===t[n])}class g extends P{constructor(){super(...arguments),this.DB_VERSION=1,this.DB_NAME="Disc",this._writeCmds=["add","put","delete"],this.downloadFile=async e=>{var r,t;const i=x(e,e.webFetchExtra),n=await fetch(e.url,i);let s;if(!e.progress)s=await n.blob();else if(!(n!=null&&n.body))s=new Blob;else{const c=n.body.getReader();let o=0;const d=[],h=n.headers.get("content-type"),y=parseInt(n.headers.get("content-length")||"0",10);for(;;){const{done:f,value:p}=await c.read();if(f)break;d.push(p),o+=(p==null?void 0:p.length)||0;const b={url:e.url,bytes:o,contentLength:y};this.notifyListeners("progress",b)}const u=new Uint8Array(o);let l=0;for(const f of d)typeof f>"u"||(u.set(f,l),l+=f.length);s=new Blob([u.buffer],{type:h||void 0})}return{path:(await this.writeFile({path:e.path,directory:(r=e.directory)!==null&&r!==void 0?r:void 0,recursive:(t=e.recursive)!==null&&t!==void 0?t:!1,data:s})).uri,blob:s}}}async initDb(){if(this._db!==void 0)return this._db;if(!("indexedDB"in window))throw this.unavailable("This browser doesn't support IndexedDB");return new Promise((e,r)=>{const t=indexedDB.open(this.DB_NAME,this.DB_VERSION);t.onupgradeneeded=g.doUpgrade,t.onsuccess=()=>{this._db=t.result,e(t.result)},t.onerror=()=>r(t.error),t.onblocked=()=>{console.warn("db blocked")}})}static doUpgrade(e){const t=e.target.result;switch(e.oldVersion){case 0:case 1:default:t.objectStoreNames.contains("FileStorage")&&t.deleteObjectStore("FileStorage"),t.createObjectStore("FileStorage",{keyPath:"path"}).createIndex("by_folder","folder")}}async dbRequest(e,r){const t=this._writeCmds.indexOf(e)!==-1?"readwrite":"readonly";return this.initDb().then(i=>new Promise((n,s)=>{const o=i.transaction(["FileStorage"],t).objectStore("FileStorage")[e](...r);o.onsuccess=()=>n(o.result),o.onerror=()=>s(o.error)}))}async dbIndexRequest(e,r,t){const i=this._writeCmds.indexOf(r)!==-1?"readwrite":"readonly";return this.initDb().then(n=>new Promise((s,a)=>{const h=n.transaction(["FileStorage"],i).objectStore("FileStorage").index(e)[r](...t);h.onsuccess=()=>s(h.result),h.onerror=()=>a(h.error)}))}getPath(e,r){const t=r!==void 0?r.replace(/^[/]+|[/]+$/g,""):"";let i="";return e!==void 0&&(i+="/"+e),r!==""&&(i+="/"+t),i}async clear(){(await this.initDb()).transaction(["FileStorage"],"readwrite").objectStore("FileStorage").clear()}async readFile(e){const r=this.getPath(e.directory,e.path),t=await this.dbRequest("get",[r]);if(t===void 0)throw Error("File does not exist.");return{data:t.content?t.content:""}}async writeFile(e){const r=this.getPath(e.directory,e.path);let t=e.data;const i=e.encoding,n=e.recursive,s=await this.dbRequest("get",[r]);if(s&&s.type==="directory")throw Error("The supplied path is a directory.");const a=r.substr(0,r.lastIndexOf("/"));if(await this.dbRequest("get",[a])===void 0){const h=a.indexOf("/",1);if(h!==-1){const y=a.substr(h);await this.mkdir({path:y,directory:e.directory,recursive:n})}}if(!i&&!(t instanceof Blob)&&(t=t.indexOf(",")>=0?t.split(",")[1]:t,!this.isBase64String(t)))throw Error("The supplied data is not valid base64 content.");const o=Date.now(),d={path:r,folder:a,type:"file",size:t instanceof Blob?t.size:t.length,ctime:o,mtime:o,content:t};return await this.dbRequest("put",[d]),{uri:d.path}}async appendFile(e){const r=this.getPath(e.directory,e.path);let t=e.data;const i=e.encoding,n=r.substr(0,r.lastIndexOf("/")),s=Date.now();let a=s;const c=await this.dbRequest("get",[r]);if(c&&c.type==="directory")throw Error("The supplied path is a directory.");if(await this.dbRequest("get",[n])===void 0){const h=n.indexOf("/",1);if(h!==-1){const y=n.substr(h);await this.mkdir({path:y,directory:e.directory,recursive:!0})}}if(!i&&!this.isBase64String(t))throw Error("The supplied data is not valid base64 content.");if(c!==void 0){if(c.content instanceof Blob)throw Error("The occupied entry contains a Blob object which cannot be appended to.");c.content!==void 0&&!i?t=btoa(atob(c.content)+atob(t)):t=c.content+t,a=c.ctime}const d={path:r,folder:n,type:"file",size:t.length,ctime:a,mtime:s,content:t};await this.dbRequest("put",[d])}async deleteFile(e){const r=this.getPath(e.directory,e.path);if(await this.dbRequest("get",[r])===void 0)throw Error("File does not exist.");if((await this.dbIndexRequest("by_folder","getAllKeys",[IDBKeyRange.only(r)])).length!==0)throw Error("Folder is not empty.");await this.dbRequest("delete",[r])}async mkdir(e){const r=this.getPath(e.directory,e.path),t=e.recursive,i=r.substr(0,r.lastIndexOf("/")),n=(r.match(/\//g)||[]).length,s=await this.dbRequest("get",[i]),a=await this.dbRequest("get",[r]);if(n===1)throw Error("Cannot create Root directory");if(a!==void 0)throw Error("Current directory does already exist.");if(!t&&n!==2&&s===void 0)throw Error("Parent directory must exist");if(t&&n!==2&&s===void 0){const d=i.substr(i.indexOf("/",1));await this.mkdir({path:d,directory:e.directory,recursive:t})}const c=Date.now(),o={path:r,folder:i,type:"directory",size:0,ctime:c,mtime:c};await this.dbRequest("put",[o])}async rmdir(e){const{path:r,directory:t,recursive:i}=e,n=this.getPath(t,r),s=await this.dbRequest("get",[n]);if(s===void 0)throw Error("Folder does not exist.");if(s.type!=="directory")throw Error("Requested path is not a directory");const a=await this.readdir({path:r,directory:t});if(a.files.length!==0&&!i)throw Error("Folder is not empty");for(const c of a.files){const o="".concat(r,"/").concat(c.name);(await this.stat({path:o,directory:t})).type==="file"?await this.deleteFile({path:o,directory:t}):await this.rmdir({path:o,directory:t,recursive:i})}await this.dbRequest("delete",[n])}async readdir(e){const r=this.getPath(e.directory,e.path),t=await this.dbRequest("get",[r]);if(e.path!==""&&t===void 0)throw Error("Folder does not exist.");const i=await this.dbIndexRequest("by_folder","getAllKeys",[IDBKeyRange.only(r)]);return{files:await Promise.all(i.map(async s=>{let a=await this.dbRequest("get",[s]);return a===void 0&&(a=await this.dbRequest("get",[s+"/"])),{name:s.substring(r.length+1),type:a.type,size:a.size,ctime:a.ctime,mtime:a.mtime,uri:a.path}}))}}async getUri(e){const r=this.getPath(e.directory,e.path);let t=await this.dbRequest("get",[r]);return t===void 0&&(t=await this.dbRequest("get",[r+"/"])),{uri:(t==null?void 0:t.path)||r}}async stat(e){const r=this.getPath(e.directory,e.path);let t=await this.dbRequest("get",[r]);if(t===void 0&&(t=await this.dbRequest("get",[r+"/"])),t===void 0)throw Error("Entry does not exist.");return{type:t.type,size:t.size,ctime:t.ctime,mtime:t.mtime,uri:t.path}}async rename(e){await this._copy(e,!0)}async copy(e){return this._copy(e,!1)}async requestPermissions(){return{publicStorage:"granted"}}async checkPermissions(){return{publicStorage:"granted"}}async _copy(e,r=!1){let{toDirectory:t}=e;const{to:i,from:n,directory:s}=e;if(!i||!n)throw Error("Both to and from must be provided");t||(t=s);const a=this.getPath(s,n),c=this.getPath(t,i);if(a===c)return{uri:c};if(R(a,c))throw Error("To path cannot contain the from path");let o;try{o=await this.stat({path:i,directory:t})}catch(u){const l=i.split("/");l.pop();const f=l.join("/");if(l.length>0&&(await this.stat({path:f,directory:t})).type!=="directory")throw new Error("Parent directory of the to path is a file")}if(o&&o.type==="directory")throw new Error("Cannot overwrite a directory with a file");const d=await this.stat({path:n,directory:s}),h=async(u,l,f)=>{const p=this.getPath(t,u),b=await this.dbRequest("get",[p]);b.ctime=l,b.mtime=f,await this.dbRequest("put",[b])},y=d.ctime?d.ctime:Date.now();switch(d.type){case"file":{const u=await this.readFile({path:n,directory:s});r&&await this.deleteFile({path:n,directory:s});let l;!(u.data instanceof Blob)&&!this.isBase64String(u.data)&&(l=E.UTF8);const f=await this.writeFile({path:i,directory:t,data:u.data,encoding:l});return r&&await h(i,y,d.mtime),f}case"directory":{if(o)throw Error("Cannot move a directory over an existing object");try{await this.mkdir({path:i,directory:t,recursive:!1}),r&&await h(i,y,d.mtime)}catch(l){}const u=(await this.readdir({path:n,directory:s})).files;for(const l of u)await this._copy({from:"".concat(n,"/").concat(l.name),to:"".concat(i,"/").concat(l.name),directory:s,toDirectory:t},r);r&&await this.rmdir({path:n,directory:s})}}return{uri:c}}isBase64String(e){try{return btoa(atob(e))==e}catch(r){return!1}}}g._debug=!0;export{g as FilesystemWeb};
