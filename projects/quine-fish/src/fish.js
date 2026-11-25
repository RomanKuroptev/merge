function out(t){window.printed=t;document.getElementById('out').textContent=t;}
window.addEventListener('load',function(){
var v=document.getElementById('verdict');
var src=document.getElementById('q').textContent;
v.textContent=(src===window.printed)?'MATCH. The fish ate itself and said the same thing.':'No match. The fish is lying.';
});