(function(){
  // background video: if a base64 payload was injected (combined build),
  // convert it to a Blob URL — far more reliable for autoplay than a
  // huge inline data: URI, especially on mobile browsers.
  var bgVideo = document.getElementById('bgVideo');
  if(bgVideo && window.__BG_VIDEO_B64__){
    try{
      var raw = atob(window.__BG_VIDEO_B64__);
      var len = raw.length;
      var bytes = new Uint8Array(len);
      for(var i = 0; i < len; i++){ bytes[i] = raw.charCodeAt(i); }
      var blob = new Blob([bytes], {type:'video/mp4'});
      var url = URL.createObjectURL(blob);
      bgVideo.src = url;
      bgVideo.load();
      var tryPlay = function(){ bgVideo.play().catch(function(){}); };
      bgVideo.addEventListener('canplay', tryPlay, {once:true});
      tryPlay();
    }catch(e){}
  }

  var gate = document.getElementById('gate');
  var page = document.getElementById('page');
  var audio = document.getElementById('bgm');
  var musicBtn = document.getElementById('musicBtn');

  // stagger the hero name letters
  var heroH1 = document.querySelector('.hero h1');
  if(heroH1){
    var text = heroH1.textContent;
    heroH1.textContent = '';
    text.split('').forEach(function(ch, i){
      var span = document.createElement('span');
      span.className = 'letter-span';
      span.style.animationDelay = (i * 0.06) + 's';
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      heroH1.appendChild(span);
    });
  }

  // floating petals on the gate screen
  var field = document.querySelector('.petal-field');
  if(field){
    var glyphs = ['🌸','🌹','💗','✨'];
    for(var i = 0; i < 16; i++){
      var p = document.createElement('span');
      p.className = 'petal';
      p.textContent = glyphs[Math.floor(Math.random()*glyphs.length)];
      p.style.left = (Math.random()*100) + 'vw';
      p.style.fontSize = (14 + Math.random()*14) + 'px';
      var dur = 9 + Math.random()*10;
      p.style.animationDuration = dur + 's, ' + (dur*0.7) + 's';
      p.style.animationDelay = (-Math.random()*dur) + 's, 0s';
      field.appendChild(p);
    }
  }

  // twinkling sparkles on the gate screen
  var sparkleField = document.getElementById('sparkleField');
  if(sparkleField){
    var sparkleGlyphs = ['✨','⭐','💫'];
    for(var s = 0; s < 20; s++){
      var sp = document.createElement('span');
      sp.className = 'sparkle';
      sp.textContent = sparkleGlyphs[Math.floor(Math.random()*sparkleGlyphs.length)];
      sp.style.left = (Math.random()*100) + 'vw';
      sp.style.fontSize = (8 + Math.random()*12) + 'px';
      var sDur = 5 + Math.random()*6;
      var sTwinkle = 1.4 + Math.random()*1.8;
      sp.style.animationDuration = sDur + 's, ' + sTwinkle + 's';
      sp.style.animationDelay = (-Math.random()*sDur) + 's, ' + (-Math.random()*sTwinkle) + 's';
      sparkleField.appendChild(sp);
    }
  }

  // gently rising hearts & sparkles behind the hero name
  var heroField = document.getElementById('heroSparkles');
  if(heroField){
    var heroGlyphs = ['💗','✨','🌸'];
    for(var h = 0; h < 12; h++){
      var hs = document.createElement('span');
      hs.textContent = heroGlyphs[Math.floor(Math.random()*heroGlyphs.length)];
      hs.style.left = (Math.random()*100) + '%';
      hs.style.fontSize = (10 + Math.random()*14) + 'px';
      var hDur = 8 + Math.random()*8;
      var hTwinkle = 2 + Math.random()*2;
      hs.style.animationDuration = hDur + 's, ' + hTwinkle + 's';
      hs.style.animationDelay = (-Math.random()*hDur) + 's, ' + (-Math.random()*hTwinkle) + 's';
      heroField.appendChild(hs);
    }
  }

  // little heart burst when the gate is tapped open
  function heartBurst(){
    var glyphs = ['❤️','💖','💗','💕'];
    for(var b = 0; b < 12; b++){
      var hb = document.createElement('span');
      hb.className = 'heart-burst';
      hb.textContent = glyphs[Math.floor(Math.random()*glyphs.length)];
      hb.style.fontSize = (16 + Math.random()*18) + 'px';
      hb.style.setProperty('--dx', (Math.random()*220 - 110) + 'px');
      hb.style.setProperty('--rot', (Math.random()*50 - 25) + 'deg');
      hb.style.animationDelay = (Math.random()*0.25) + 's';
      gate.appendChild(hb);
      (function(el){ setTimeout(function(){ el.remove(); }, 1600); })(hb);
    }
  }

  function playAudio(){
    audio.play().then(function(){
      musicBtn.classList.remove('paused');
    }).catch(function(){});
  }

  document.getElementById('gateBtn').addEventListener('click', function(){
    heartBurst();
    gate.classList.add('hide');
    page.classList.add('show');
    playAudio();
    var bgVideoEl = document.getElementById('bgVideo');
    if(bgVideoEl){ bgVideoEl.play().catch(function(){}); }
    setTimeout(function(){ gate.remove(); }, 1100);
  });

  musicBtn.addEventListener('click', function(){
    if(audio.paused){ playAudio(); }
    else { audio.pause(); musicBtn.classList.add('paused'); }
  });

  // scroll reveal for gallery + letter, staggered per photo
  var revealEls = document.querySelectorAll('.reveal');
  var galleryFigs = document.querySelectorAll('.gallery figure');
  galleryFigs.forEach(function(fig, i){
    fig.style.transitionDelay = (i * 0.09) + 's';
  });
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.15});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  // flower rain over the gallery section
  var flowerField = document.getElementById('flowerRain');
  if(flowerField){
    // tulips, lotus, rose, sunflower are prominent; a few others mixed in lightly
    var mainFlowers = ['🌷','🌷','🪷','🪷','🌹','🌹','🌻','🌻'];
    var otherFlowers = ['🌸','💮','🏵️'];
    var bag = mainFlowers.concat(mainFlowers, otherFlowers);
    for(var i = 0; i < 34; i++){
      var fl = document.createElement('span');
      fl.textContent = bag[Math.floor(Math.random()*bag.length)];
      fl.style.left = (Math.random()*100) + '%';
      fl.style.fontSize = (16 + Math.random()*16) + 'px';
      fl.style.opacity = (0.55 + Math.random()*0.35).toFixed(2);
      var dur = 10 + Math.random()*12;
      fl.style.animationDuration = dur + 's, ' + (dur*0.8) + 's';
      fl.style.animationDelay = (-Math.random()*dur) + 's, 0s';
      flowerField.appendChild(fl);
    }
  }

  // gallery lightbox
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  galleryFigs.forEach(function(fig){
    fig.addEventListener('click', function(){
      var src = fig.querySelector('img').getAttribute('src');
      lightboxImg.setAttribute('src', src);
      lightbox.classList.add('open');
    });
  });
  function closeLightbox(){ lightbox.classList.remove('open'); }
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function(e){
    if(e.target === lightbox){ closeLightbox(); }
  });

  // days together counter — animated count-up
  try{
    var start = new Date(2023,3,24); // April 24, 2023
    var now = new Date();
    var target = Math.floor((now - start) / (1000*60*60*24));
    var daysEl = document.getElementById('daysNum');
    var count = 0;
    var stepTime = Math.max(8, Math.floor(1400 / target));
    var timer = setInterval(function(){
      count += Math.ceil(target / 120);
      if(count >= target){
        count = target;
        clearInterval(timer);
        daysEl.classList.add('popped');
      }
      daysEl.textContent = count.toLocaleString();
    }, stepTime);
  }catch(e){}
})();