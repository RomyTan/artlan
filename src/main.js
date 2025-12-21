import './style.css'
import { initLaniakea } from './laniakea.js'

// 1. FUNGSI JAM DIGITAL
function updateClock() {
  const clockElement = document.getElementById('clock');
  if (clockElement) {
    const now = new Date();
    const options = { 
      timeZone: 'Asia/Jakarta', 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    };
    const timeString = now.toLocaleTimeString('en-GB', options);
    clockElement.textContent = timeString;
  }
}
setInterval(updateClock, 1000);
updateClock();

// 2. LOGIKA MATRIX SCRAMBLE
const letters = "abcdefghijklmnopqrstuvwxyz";

function scramble(element, finalText) {
  let iteration = 0;
  if (!element) return; 
  
  if (element.matrixInterval) clearInterval(element.matrixInterval);

  element.matrixInterval = setInterval(() => {
    element.innerText = finalText
      .split("")
      .map((letter, index) => {
        if (finalText[index] === "\n") return "\n";
        if (index < iteration) return finalText[index];
        return letters[Math.floor(Math.random() * 26)];
      })
      .join("");

    if (iteration >= finalText.length) {
      clearInterval(element.matrixInterval);
      element.innerText = finalText;
    }
    
    iteration += (finalText.length > 10) ? 1 : 1 / 2.5;
  }, 30);
}

// 3. LOGIKA UTAMA (INTRO, HOVER & SWIPE)
window.addEventListener("DOMContentLoaded", () => {
  // Jalankan Canvas Laniakea
  initLaniakea();

  const heroTitle = document.querySelector(".hero h1 .T1");
  const heroSubtitle = document.querySelector(".hero h1 .T2");
  const heroCategory = document.querySelector(".detail-item:first-child p");
  const t3Elements = document.querySelectorAll(".hero h1 .T3");
  const navLinks = document.querySelectorAll(".nav-links a");
  const projectItems = document.querySelectorAll(".project-item");

  // A. ANIMASI INTRO (WELCOME -> FINAL)
  setTimeout(() => {
    const heroSpans = document.querySelectorAll(".hero h1 span");
    heroSpans.forEach(span => {
      const finalText = span.dataset.final;
      if (finalText) scramble(span, finalText);
    });
  }, 500);

  // B. ANIMASI NAVBAR
  navLinks.forEach(link => {
    link.onmouseenter = event => {
      const targetText = event.target.dataset.value;
      if (targetText) scramble(event.target, targetText);
    };
  });

  // C. LOGIKA DESKTOP (HOVER)
  if (window.innerWidth > 768) {
    projectItems.forEach(item => {
      item.addEventListener("mouseenter", () => {
        t3Elements.forEach(el => el.classList.add("fade-out"));
        if (item.dataset.title) scramble(heroTitle, item.dataset.title);
        if (item.dataset.subtitle) scramble(heroSubtitle, item.dataset.subtitle);
        if (item.dataset.category) scramble(heroCategory, item.dataset.category);
      });

      item.addEventListener("mouseleave", () => {
        t3Elements.forEach(el => el.classList.remove("fade-out"));
        if (heroTitle) scramble(heroTitle, heroTitle.dataset.final);
        if (heroSubtitle) scramble(heroSubtitle, heroSubtitle.dataset.final);
        if (heroCategory) scramble(heroCategory, "CREATIVE\nDESIGNER");
      });
    });
  }

  // D. LOGIKA MOBILE (SWIPE / INTERSECTION OBSERVER)
  if (window.innerWidth <= 768) {
    const observerOptions = {
      root: document.querySelector('.project-grid'), // Sesuai nama class kontainer swipe lo
      threshold: 0.6 // Trigger pas item project dapet 60% visibilitas di layar
    };

    const mobileObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const item = entry.target;
          // Trigger scramble otomatis saat di-swipe ke tengah layar
          if (item.dataset.title) scramble(heroTitle, item.dataset.title);
          if (item.dataset.subtitle) scramble(heroSubtitle, item.dataset.subtitle);
          if (item.dataset.category) scramble(heroCategory, item.dataset.category);
          
          // Efek fade-out T3 (SINCE 2011) pas mulai swipe
          t3Elements.forEach(el => el.classList.add("fade-out"));
        }
      });
    }, observerOptions);

    projectItems.forEach(item => mobileObserver.observe(item));
  }
});