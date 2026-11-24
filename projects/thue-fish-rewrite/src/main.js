const P={
"Sort":{s:"baabab",r:[["ba","ab"]]},
"Cat grows":{s:"cat",r:[["c","ch"],["t","tt"],["at","a"],["h",""]]},
"Fish heads":{s:"<><",r:[["<>","<<>"],["<<","<"],["><","><>"]]},
"Fish loop":{s:"a",r:[["a","aa"],["aa","a"],["a","b"],["b","a"]]}};
const cv=document.getElementById("c"),g=cv.getContext("2d");
let cur,str,rules,fish,steps,msg,auto=true,timer=0,log=[],snacks=[],mood=0.6,ac=null;
function blip(f1,f2,d){try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();
 const o=ac.createOscillator(),v=ac.createGain(),t=ac.currentTime;
 o.type="square";o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(f2,t+d);
 v.gain.setValueAtTime(.08,t);v.gain.exponentialRampToValueAtTime(.001,t+d);
 o.connect(v);v.connect(ac.destination);o.start(t);o.stop(t+d);}catch(e){}}
function load(n,o){cur=n;o=o||P[n];str=o.s;rules=o.r;steps=0;msg="Fish is thinking.";log=[];snacks=[];
 fish={x:60,y:180,tx:60,ty:180,pick:-1};}
const bd=document.getElementById("b");
for(const n in P){const b=document.createElement("button");b.textContent=n;b.onclick=()=>load(n);bd.appendChild(b);}
const sb=document.createElement("button");sb.textContent="auto on/off";sb.onclick=()=>auto=!auto;bd.appendChild(sb);
const st=document.createElement("button");st.textContent="step";st.onclick=step;bd.appendChild(st);
const ed=document.createElement("div");
ed.innerHTML='<input id="e" size="28" value="abab | ba>ab ; ab>b"> <button id="eb">load mine</button> <span style="color:#789">click the sea = fish snack</span>';
document.body.insertBefore(ed,cv);
document.getElementById("eb").onclick=()=>{
 const t=document.getElementById("e").value.split("|");
 const r=(t[1]||"").split(";").map(x=>x.split(">")).filter(x=>x.length==2).map(x=>[x[0].trim(),x[1].trim()]).filter(x=>x[0]);
 if(!r.length){msg="Fish cannot read that. Use: start | a>b ; c>d";return;}
 load("Yours",{s:t[0].trim(),r:r});};
cv.onclick=e=>{const q=cv.getBoundingClientRect(),k=640/q.width;
 if(snacks.length<5){snacks.push({x:(e.clientX-q.left)*k,y:(e.clientY-q.top)*k});blip(500,900,.08);}};
const ry=i=>70+i*(250/Math.max(rules.length,1))+20;
function step(){
 const ok=[];rules.forEach((r,i)=>{if(str.includes(r[0]))ok.push(i)});
 if(!ok.length){msg="No rule fits. Fish shrugs. Halted.";mood=Math.max(0,mood-.02);return;}
 const sn=snacks.length?snacks[0]:null,ay=sn?sn.y:fish.y;
 let best=ok[0];for(const i of ok)if(Math.abs(ry(i)-ay)<Math.abs(ry(best)-ay))best=i;
 fish.pick=best;fish.tx=sn?sn.x:500;fish.ty=sn?sn.y:ry(best);
 const r=rules[best],occ=[];let k=-1;while((k=str.indexOf(r[0],k+1))>=0)occ.push(k);
 const at=occ[Math.floor(Math.random()*occ.length)];
 str=str.slice(0,at)+r[1]+str.slice(at+r[0].length);steps++;
 msg="Fish chose rule "+(best+1)+(sn?" (bribed with snack).":".");
 if(sn){snacks.shift();mood=Math.min(1,mood+.25);blip(300,80,.2);}
 else{mood=Math.max(0,mood-(steps>15?.03:.01));blip(200,260,.04);}
 if(str.length>40)str=str.slice(0,40),msg="Too much fish. Trimmed.";
 if(cur=="Fish loop"&&steps>=15)msg=steps>=40?"Fish is bored. Fish wants out.":"This never ends. Fish knows.";
 log.unshift(str);if(log.length>6)log.pop();
 setTimeout(()=>{fish.tx=60;fish.ty=100+Math.random()*220;},500);
}
function draw(){
 g.clearRect(0,0,640,360);g.font="14px monospace";g.fillStyle="#7ca";
 g.fillText(cur+"  steps:"+steps,10,18);
 g.fillStyle="#789";g.fillText("mood",480,18);
 g.fillStyle="#234";g.fillRect(525,7,100,12);
 g.fillStyle=mood>.6?"#4a8":mood>.3?"#cb4":"#c54";g.fillRect(525,7,100*mood,12);
 g.fillText(mood>.6?":)":mood>.3?":|":":(",600,36);
 g.font="26px monospace";g.fillStyle="#fe8";g.fillText(str||"(empty)",10,52);
 g.font="14px monospace";
 rules.forEach((r,i)=>{const y=ry(i);g.fillStyle=i==fish.pick?"#4a8":"#234";g.fillRect(380,y-16,250,28);
  g.fillStyle="#cfe";g.fillText((i+1)+": "+r[0]+" -> "+(r[1]||"(nothing)"),390,y+3);});
 g.fillStyle="#789";log.forEach((l,i)=>g.fillText(l,10,100+i*18));
 g.fillStyle="#c96";snacks.forEach(s=>{g.beginPath();g.arc(s.x,s.y,5,0,7);g.fill();});
 fish.x+=(fish.tx-fish.x)*.1;fish.y+=(fish.ty-fish.y)*.1;
 g.save();g.translate(fish.x,fish.y);g.fillStyle="#f94";
 g.beginPath();g.ellipse(0,0,24,12,0,0,7);g.fill();
 g.beginPath();g.moveTo(-20,0);g.lineTo(-36,-10+Math.sin(Date.now()/100)*4);g.lineTo(-36,10);g.fill();
 g.fillStyle="#000";g.fillRect(12,-5,4,4);g.restore();
 g.fillStyle="#fa8";g.fillText(msg,10,352);
 if(auto&&++timer%70==0)step();
 requestAnimationFrame(draw);}
load("Sort");draw();
