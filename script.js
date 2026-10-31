/* A Little Surprise for You 💗 — vanilla JS, no backend needed */
(() => {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const pages = [...document.querySelectorAll('.page')];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Official Spotify track: "Blush" by Taba Chake (verified on open.spotify.com) */
  const SPOTIFY_TRACK_ID = '5FKau0mX86PvGu3EbWn7qX';

  /* ---------- Page navigation ---------- */
  function go(index) {
    pages.forEach((p, i) => {
      p.hidden = i !== index;
      p.classList.toggle('in', i === index);
    });
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    const heading = pages[index].querySelector('h1, h2');
    if (heading) heading.focus({ preventScroll: true }); // keyboard / screen-reader friendly
    if (index === 2) setTimeout(() => burst(innerWidth / 2, innerHeight / 3, 40), 350);
  }

  /* ---------- Heart / confetti burst ---------- */
  const EMOJI = ['💗', '💖', '💕', '✨', '🎀', '🌸', '⭐'];
  function burst(x, y, count = 12) {
    if (reduceMotion) return;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.textContent = EMOJI[Math.floor(Math.random() * EMOJI.length)];
      el.setAttribute('aria-hidden', 'true');
      Object.assign(el.style, {
        position: 'fixed', left: x + 'px', top: y + 'px', fontSize: 14 + Math.random() * 18 + 'px',
        pointerEvents: 'none', zIndex: 50
      });
      document.body.appendChild(el);
      const angle = Math.random() * Math.PI * 2, dist = 60 + Math.random() * 160;
      el.animate(
        [{ transform: 'translate(-50%,-50%) scale(.3)', opacity: 1 },
         { transform: `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist + 60}px)) scale(1) rotate(${Math.random() * 360}deg)`, opacity: 0 }],
        { duration: 900 + Math.random() * 700, easing: 'cubic-bezier(.2,.8,.3,1)' }
      ).onfinish = () => el.remove();
    }
  }
  // Little sparkle on every button press
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.btn');
    if (b) { const r = b.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 8); }
  });

  /* ---------- Background floating hearts ---------- */
  const floaters = $('#floaters');
  if (!reduceMotion) {
    ['💗', '💕', '✨', '🌸', '💖', '🎀'].forEach((emoji, k) => {
      for (let i = 0; i < 3; i++) {
        const s = document.createElement('span');
        s.textContent = emoji;
        s.style.cssText = `--x:${Math.random() * 96}%;--s:${14 + Math.random() * 18}px;--d:${12 + Math.random() * 12}s;--delay:${-Math.random() * 20 + k}s`;
        floaters.appendChild(s);
      }
    });
  }

  /* ---------- PAGE 1 ---------- */
  const noBox = $('#noBox'), input = $('#yesInput'), oops = $('#oops');

  $('#yesBtn').addEventListener('click', () => go(1));

  $('#noBtn').addEventListener('click', () => {
    noBox.hidden = false;
    noBox.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    setTimeout(() => input.focus({ preventScroll: true }), 350);
  });

  // The user must type "yes" (any case, stray spaces ignored)
  $('#yesForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const answer = input.value.trim().toLowerCase().replace(/\s+/g, '');
    if (answer === 'yes') {
      oops.textContent = '';
      go(1);
    } else {
      oops.textContent = 'Heheee, type YES properly, cutie! 🤭💗';
      input.classList.remove('shake'); void input.offsetWidth; input.classList.add('shake');
      input.focus();
    }
  });

  /* ---------- PAGE 2 ---------- */
  $('#resultBtn').addEventListener('click', () => go(2));

  /* ---------- PAGE 3: gallery ---------- */
  document.querySelectorAll('.polaroid').forEach((fig) => {
    const img = fig.querySelector('img');
    const markMissing = () => fig.classList.add('missing'); // shows the cute placeholder
    img.addEventListener('error', markMissing);
    if (img.complete && img.naturalWidth === 0) markMissing();

    const wiggle = () => {
      fig.classList.add('pop-it');
      setTimeout(() => fig.classList.remove('pop-it'), 900);
      const r = fig.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2, 10);
    };
    fig.addEventListener('click', wiggle);                       // touch + mouse
    fig.addEventListener('keydown', (e) => {                     // keyboard
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); wiggle(); }
    });
  });

  /* ---------- Replay (music keeps going — it lives outside the pages) ---------- */
  $('#replayBtn').addEventListener('click', () => {
    noBox.hidden = true; input.value = ''; oops.textContent = '';
    go(0);
  });

  /* ---------- Spotify music sticker ---------- */
  const music = $('#music'), musicBtn = $('#musicBtn'), slot = $('#embedSlot'), fallback = $('#fallback');
  let embedLoaded = false;

  function loadEmbed() {
    // Created only after the visitor opens the player: nothing loads or plays on page open.
    const frame = document.createElement('iframe');
    frame.src = `https://open.spotify.com/embed/track/${SPOTIFY_TRACK_ID}?utm_source=generator&theme=0`;
    frame.title = 'Spotify player: Blush by Taba Chake';
    frame.allow = 'encrypted-media; clipboard-write';
    frame.loading = 'lazy';
    frame.addEventListener('load', () => { embedLoaded = true; fallback.hidden = true; });
    slot.appendChild(frame);
    // If Spotify is blocked (ad-blocker, offline, strict network), show the fallback note
    setTimeout(() => { if (!embedLoaded) fallback.hidden = false; }, 7000);
  }

  musicBtn.addEventListener('click', () => {
    const opening = !music.classList.contains('open');
    music.classList.toggle('open', opening);
    musicBtn.setAttribute('aria-expanded', String(opening));
    musicBtn.textContent = opening ? 'Close player 💗' : 'Play our song 🎧💗';
    if (opening && !slot.firstChild) loadEmbed();
    // Closing only collapses the card visually, so a song already playing is not reset.
  });
})();
