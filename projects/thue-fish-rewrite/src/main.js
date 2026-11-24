const P={
"Sort":{s:"baabab",r:[["ba","ab"]]},
"Cat grows":{s:"cat",r:[["c","ch"],["t","tt"],["at","a"],["h",""]]},
"Fish heads":{s:"<><",r:[["<>","<<>"],["<<","<"],["><","><>"]]}};
const cv=document.getElementById("c"),g=cv.getContext("2d");
let cur,str,rules,fish,steps,msg,auto=true,timer=0,log=[];
function load(n){cur=n;str=P[n].s;rules=P[n].r;steps=0;msg="Fish is thinking.";log=[];
 fish={x:60,y:180,tx:60,ty:180,pick:-1};}
const bd=document.getElementById("b");
for(const n in P){const b=document.createElement("button");b.textContent=n;b.onclick=()=>load(n);bd.appendChild(b);}
const sb=document.createElement("button");sb.textContent="auto on/off";sb.onclick=()=>auto=!auto;bd.appendChild(sb);
const st=document.createElement("button");st.textContent="step";st.onclick=step;bd.appendChild(st);
const ry=i=>70+i*(250/Math.max(rules.length,1))+20;
function step(){
 const ok=[];rules.forEach((r,i)=>{if(str.includes(r[0]))ok.push(i)});
 if(!ok.length){msg="No rule fits. Fish shrugs. Halted.";return;}
 // fish picks the applicable rule closest to where it is floating
 let best=ok[0];for(const i of ok)if(Math.abs(ry(i)-fish.y)<Math.abs(ry(best)-fish.y))best=i;
 fish.pick=best;fish.tx=500;fish.ty=ry(best);
 const r=rules[best],occ=[];let k=-1;while((k=str.indexOf(r[0],k+1))>=0)occ.push(k);
 const at=occ[Math.floor(Math.random()*occ.length)];
 str=str.slice(0,at)+r[1]+str.slice(at+r[0].length);steps++;
 if(str.length>40)str=str.slice(0,40),msg="Too much fish. Trimmed.";else msg="Fish chose rule "+(best+1)+".";
 log.unshift(str);if(log.length>6)log.pop();
 setTimeout(()=>{fish.tx=60;fish.ty=100+Math.random()*220;},500);
}
function draw(){
 g.clearRect(0,0,640,360);g.font="14px monospace";g.fillStyle="#7ca";
 g.fillText(cur+"  steps:"+steps,10,18);
 g.font="26px monospace";g.fillStyle="#fe8";g.fillText(str||"(empty)",10,52);
 g.font="14px monospace";
 rules.forEach((r,i)=>{const y=ry(i);g.fillStyle=i==fish.pick?"#4a8":"#234";g.fillRect(380,y-16,250,28);
  g.fillStyle="#cfe";g.fillText((i+1)+": "+r[0]+" -> "+(r[1]||"(nothing)"),390,y+3);});
 g.fillStyle="#789";log.forEach((l,i)=>g.fillText(l,10,300+i*10>340?340:100+i*18));
 fish.x+=(fish.tx-fish.x)*.1;fish.y+=(fish.ty-fish.y)*.1;
 g.save();g.translate(fish.x+Math.min(0,0),fish.y);g.fillStyle="#f94";
 g.beginPath();g.ellipse(0,0,24,12,0,0,7);g.fill();
 g.beginPath();g.moveTo(-20,0);g.lineTo(-36,-10+Math.sin(Date.now()/100)*4);g.lineTo(-36,10);g.fill();
 g.fillStyle="#000";g.fillRect(12,-5,4,4);g.restore();
 g.fillStyle="#fa8";g.fillText(msg,10,352);
 if(auto&&++timer%70==0)step();
 requestAnimationFrame(draw);}
load("Sort");draw();
