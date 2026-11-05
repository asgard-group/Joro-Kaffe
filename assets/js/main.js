(function(){
  /* ---------- Ouvert / Fermé (heure de Paris) ---------- */
  var HOURS={0:null,1:[480,1080],2:[480,1080],3:[480,1080],4:[480,1080],5:[480,1080],6:[570,1080]}; /* minutes depuis minuit */
  var CLOSURES=[]; /* fermetures exceptionnelles, ex. ['2026-12-25','2027-01-01'] */
  /* horaires particuliers d’un jour (jours fériés…) : '2026-11-11': null = fermé, ou [début,fin] en minutes, ex. [570,1080] = 9h30-18h00 */
  var SPECIAL={'2026-11-11':null};
  var DAYS={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};
  var NAMES=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
  var fmt;
  try{fmt=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Paris',weekday:'short',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});}catch(e){fmt=null;}
  function now(){
    if(!fmt) return null;
    var p={};fmt.formatToParts(new Date()).forEach(function(x){p[x.type]=x.value;});
    return {d:DAYS[p.weekday],m:(+p.hour)*60+(+p.minute),iso:p.year+'-'+p.month+'-'+p.day};
  }
  function t(m){var h=Math.floor(m/60),mm=m%60;return h+'h'+(mm<10?'0':'')+mm;}
  function compute(){
    var n=now(); if(!n) return null;
    if(CLOSURES.indexOf(n.iso)>-1 || SPECIAL[n.iso]===null) return {state:'closed',text:'Fermé exceptionnellement aujourd’hui',d:n.d};
    var h=SPECIAL[n.iso]||HOURS[n.d];
    if(h && n.m>=h[0] && n.m<h[1]){
      var left=h[1]-n.m;
      return left<=30?{state:'soon',text:'Ferme bientôt · '+t(h[1]),d:n.d}:{state:'open',text:'Ouvert · jusqu’à '+t(h[1]),d:n.d};
    }
    if(h && n.m<h[0]) return {state:'closed',text:'Fermé · ouvre à '+t(h[0]),d:n.d};
    for(var i=1;i<=14;i++){
      var dt=new Date(Date.UTC(+n.iso.slice(0,4),+n.iso.slice(5,7)-1,+n.iso.slice(8,10)+i));
      var iso=dt.toISOString().slice(0,10), nd=dt.getUTCDay();
      if(CLOSURES.indexOf(iso)>-1 || SPECIAL[iso]===null) continue;
      var nh=SPECIAL[iso]||HOURS[nd];
      if(nh) return {state:'closed',text:'Fermé · ouvre '+(i===1?'demain':NAMES[nd])+' à '+t(nh[0]),d:n.d};
    }
    return null;
  }
  var last='';
  function render(){
    var s=compute(); if(!s) return;
    var key=s.state+s.text;
    document.querySelectorAll('.js-status').forEach(function(el){
      el.hidden=false;
      el.classList.toggle('is-open',s.state==='open');
      el.classList.toggle('is-soon',s.state==='soon');
      el.classList.toggle('is-closed',s.state==='closed');
      if(key!==last) el.querySelector('.st-txt').textContent=s.text;
    });
    last=key;
    document.querySelectorAll('.hours li').forEach(function(li){
      li.classList.toggle('today',li.getAttribute('data-d').split(',').indexOf(String(s.d))>-1);
    });
  }
  render(); setInterval(render,30000);

  /* ---------- Carte : sous-menu collant + sections repliables sur mobile ---------- */
  var mq=window.matchMedia('(min-width: 900px)');
  var cats=[].slice.call(document.querySelectorAll('details.cat'));
  function sync(){
    cats.forEach(function(d,i){ d.open = mq.matches ? true : (i===0); });
  }
  sync();
  (mq.addEventListener?mq.addEventListener('change',sync):mq.addListener(sync));
  cats.forEach(function(d){
    d.querySelector('summary').addEventListener('click',function(e){ if(mq.matches) e.preventDefault(); });
  });
  var chips=[].slice.call(document.querySelectorAll('.chips a'));
  var lockUntil=0;
  function setCurrent(id){
    chips.forEach(function(c){
      if(c.getAttribute('href')===id){c.setAttribute('aria-current','true');var box=c.parentNode;box.scrollTo&&box.scrollTo({left:c.offsetLeft-24,behavior:'smooth'});}
      else c.removeAttribute('aria-current');
    });
  }
  chips.forEach(function(a){
    a.addEventListener('click',function(e){
      var t=document.querySelector(a.getAttribute('href')); if(!t) return;
      e.preventDefault();
      lockUntil=Date.now()+1400; setCurrent(a.getAttribute('href'));
      if(!mq.matches) t.open=true;
      t.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
    });
  });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(!en.isIntersecting) return;
        if(Date.now()<lockUntil) return;
        setCurrent('#'+en.target.id);
      });
    },{rootMargin:'-25% 0px -65% 0px'});
    cats.forEach(function(d){io.observe(d);});
  }


  /* ---------- Carte : chargée au clic ---------- */
  var ml=document.getElementById('map-load');
  if(ml) ml.addEventListener('click',function(){
    var box=document.getElementById('mapbox'), f=document.createElement('iframe');
    f.title='Plan : Jöro Kaffé, 15 bis rue Jean-Baptiste Pigalle, 75009 Paris';
    f.src='https://www.google.com/maps?q=15+bis+rue+Jean-Baptiste+Pigalle+75009+Paris&hl=fr&z=17&output=embed';
    f.setAttribute('referrerpolicy','no-referrer-when-downgrade'); f.setAttribute('allowfullscreen','');
    box.appendChild(f); var ph=box.querySelector('.map-ph'); if(ph) ph.style.display='none';
  });

  /* ---------- Copier l’e-mail ---------- */
  var cm=document.getElementById('copy-mail');
  if(cm) cm.addEventListener('click',function(){
    var ok=document.getElementById('copy-ok'), addr='hello@joro-kaffe.com';
    function done(){ok.textContent='Adresse copiée : '+addr;}
    function fallback(){var r=document.createRange();r.selectNodeContents(document.querySelector('.ct-mail b'));var s=window.getSelection();s.removeAllRanges();s.addRange(r);try{document.execCommand('copy');done();}catch(e){ok.textContent='Sélectionnez et copiez l’adresse ci-dessus.';}}
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(addr).then(done,fallback);}else{fallback();}
  });

  /* ---------- Fenêtres légales ---------- */
  document.querySelectorAll('[data-dialog]').forEach(function(a){
    a.addEventListener('click',function(e){
      var d=document.getElementById(a.getAttribute('data-dialog'));
      if(d&&d.showModal){e.preventDefault();d.showModal();d.querySelector('.dlg-body').scrollTop=0;}
    });
  });
  document.querySelectorAll('.legal-dlg').forEach(function(d){
    d.querySelector('[data-close]').addEventListener('click',function(){d.close();});
    d.addEventListener('click',function(e){ if(e.target===d) d.close(); });
  });


  /* ---------- Accents composés pour Market Deco (stopgap) ---------- */
  (function(){
    var T={"À": ["A", "`", 0.1587, 0.2656], "Â": ["A", "ˆ", 0.0889, 0.1919], "Ä": ["A", "¨", 0.1138, 0.1919], "È": ["E", "`", 0.0957, 0.2656], "É": ["E", "´", 0.0957, 0.2656], "Ê": ["E", "ˆ", 0.0259, 0.1919], "Ë": ["E", "¨", 0.0508, 0.1919], "Î": ["I", "ˆ", -0.0859, 0.1919], "Ï": ["I", "¨", -0.061, 0.1919], "Ô": ["O", "ˆ", 0.2288, 0.1919], "Ö": ["O", "¨", 0.2537, 0.1919], "Ù": ["U", "`", 0.1482, 0.2656], "Û": ["U", "ˆ", 0.0784, 0.1919], "Ü": ["U", "¨", 0.1033, 0.1919], "Ç": ["C", ",", 0.1667, -0.1147]};
    var re=/[ÀÂÄÇÈÉÊËÎÏÔÖÙÛÜàâäçèéêëîïôöùûü]/g;
    function build(ch){
      var k=ch.toUpperCase(), d=T[k]; if(!d) return document.createTextNode(ch);
      var s=document.createElement('span'); s.className='ac'+(k==='Ç'?' cd':'');
      s.setAttribute('role','img'); s.setAttribute('aria-label',ch);
      s.setAttribute('data-a',d[1]); s.style.setProperty('--x',d[2]+'em'); s.style.setProperty('--y',d[3]+'em');
      var i=document.createElement('span'); i.setAttribute('aria-hidden','true'); i.textContent=d[0]; s.appendChild(i); return s;
    }
    function walk(n){
      for(var c=n.firstChild;c;){
        var nx=c.nextSibling;
        if(c.nodeType===3 && re.test(c.nodeValue)){
          re.lastIndex=0; var txt=c.nodeValue, f=document.createDocumentFragment(), last=0, m;
          while((m=re.exec(txt))){ if(m.index>last) f.appendChild(document.createTextNode(txt.slice(last,m.index))); f.appendChild(build(m[0])); last=m.index+1; }
          if(last<txt.length) f.appendChild(document.createTextNode(txt.slice(last)));
          c.parentNode.replaceChild(f,c);
        } else if(c.nodeType===1 && !c.classList.contains('ac')) walk(c);
        re.lastIndex=0; c=nx;
      }
    }
    document.querySelectorAll('.h2,.hero h1,.hcard h3,.sand h4,.dlg-head h2,.map-ad b').forEach(walk);
  })();

  /* ---------- Intro damier : nettoyage une fois terminée ---------- */
  var ck=document.querySelector('.ckw');
  function go(){document.documentElement.classList.add('go'); if(ck) setTimeout(function(){ck.parentNode&&ck.parentNode.removeChild(ck);},4000);}
  if(document.readyState==='complete') go(); else { window.addEventListener('load',go); setTimeout(go,3000); }
})();
