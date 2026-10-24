const fs=require('fs'),vm=require('vm'),assert=require('assert');
const root=require('path').join(__dirname,'../dist/');
const stub=()=>({innerHTML:'',value:'',style:{},classList:{add(){},remove(){},toggle(){}},setAttribute(){},removeAttribute(){},addEventListener(){},querySelectorAll(){return []},showModal(){this.open=true},close(){this.open=false}});
const els=new Map();const el=s=>{if(!els.has(s))els.set(s,stub());return els.get(s)};
const store={};const context={window:{addEventListener(){}},document:{querySelector:el,querySelectorAll(){return []},addEventListener(){},body:{style:{}}},localStorage:{getItem(k){return store[k]||null},setItem(k,v){store[k]=v}},location:{hash:''},history:{replaceState(){}},setTimeout(){},clearTimeout(){},console};
vm.createContext(context);vm.runInContext(fs.readFileSync(root+'data.js','utf8'),context);vm.runInContext(fs.readFileSync(root+'app.js','utf8'),context);
const run=s=>vm.runInContext(s,context);
assert.equal(run('filteredDishes().length'),15);
let checks=0;
for (const budget of [10,15,20,30]) for(const taste of ['不限','不辣','微辣','素食']) for(const wait of [5,10,15,30]){
 const result=run(`recommendationCandidates(${JSON.stringify({budget,taste,wait})})`);
 for(const d of result){assert(d.available);assert(d.price<=budget);assert(d.wait<=wait);if(taste==='素食')assert(d.tags.includes('素食'));else if(taste!=='不限')assert.equal(d.flavor,taste);}
 checks++;
}
run("state.chips.add('budget');state.chips.add('mild');state.chips.add('quick')");
for(const d of run('filteredDishes()')){assert(d.price<=15);assert.equal(d.flavor,'不辣');assert(d.wait<=10)}
run('resetFilters();state.query="不可能存在的菜品"');assert.equal(run('filteredDishes().length'),0);
run('resetFilters();toggleSave(1);state.view="saved"');assert.equal(run('filteredDishes().length'),1);assert(JSON.parse(store['fandian-v1-saved']).includes(1));
run('toggleSave(1)');assert.equal(run('filteredDishes().length'),0);
run('state.view="discover";state.sort="price"');let sorted=run('filteredDishes()');for(let i=1;i<sorted.length;i++)assert(sorted[i].price>=sorted[i-1].price);
run('userReviews.push({dishId:1,rating:5,name:"测",text:"测试评论至少八字"})');assert.equal(run('dishStats(getDish(1)).reviews'),129);
assert.equal(run('esc("<img src=x onerror=alert(1)> & \\\" ")'),'&lt;img src=x onerror=alert(1)&gt; &amp; &quot; ');
for(const a of context.window.FANDIAN_DATA.alerts)assert(context.window.FANDIAN_DATA.dishes.some(d=>d.id===a.dishId));
console.log(`PASS: ${checks} recommendation combinations, strict constraints, combined filters, empty results, favorites roundtrip, sort, review statistics, escaping and data links.`);

const data=context.window.FANDIAN_DATA;
assert.equal(data.windows.length,8);
const assigned=[];
for(const w of data.windows){for(const id of w.dishIds){const d=data.dishes.find(d=>d.id===id);assert(d);assert.equal(d.canteen,w.canteen);assert.equal(d.floor,w.floor);assert.equal(d.window,w.window);assigned.push(id)}}
assert.equal(new Set(assigned).size,data.dishes.length);assert.equal(assigned.length,data.dishes.length);
run('resetFilters();state.query="家常小炒"');assert.equal(run('filteredDishes().length'),2);
console.log("PASS: 8 windows, unique dish membership, location consistency, window-name search.");
