/* ==========================================================================
   季亦飞 · AIGC 电商视觉设计作品集 —— 交互
   纯原生 JS，无任何第三方依赖。
   原则：所有内容在不执行 JS 时也必须完整可见可读。
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- 1. 移动端导航抽屉 ---------- */
  var toggle = document.getElementById('navToggle');
  var drawer = document.getElementById('drawer');

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && drawer) {
    toggle.addEventListener('click', function () {
      var open = drawer.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // 点抽屉里的链接后自动收起
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeDrawer();
    });
    // Esc 收起
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDrawer();
    });
    // 回到桌面宽度时收起，避免状态残留
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1080) closeDrawer();
    });
  }

  /* ---------- 2. 滚动时导航加实心背景 ---------- */
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 24) nav.style.background = 'rgba(14,13,12,.92)';
      else nav.style.background = 'rgba(14,13,12,.72)';
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- 3. 滚动出现动画 ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('is-in');
            io.unobserve(en.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      // 不支持 IO 的浏览器：直接显示，不留空白
      reveals.forEach(function (el) { el.classList.add('is-in'); });
    }
  }

  /* ---------- 4. 图片放大（Lightbox） ---------- */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCap');
  var lbClose = document.getElementById('lbClose');
  var lastFocus = null;

  function openLb(src, cap, alt) {
    if (!lb || !lbImg) return;
    lbImg.src = src;
    lbImg.alt = alt || cap || '作品图片放大';
    if (lbCap) lbCap.textContent = cap || '';
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lastFocus = document.activeElement;
    if (lbClose) lbClose.focus();
  }

  function closeLb() {
    if (!lb) return;
    lb.classList.remove('is-open');
    lbImg.src = '';
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  // 所有带 data-zoom 的图都可点开
  document.querySelectorAll('[data-zoom]').forEach(function (el) {
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    var img = el.querySelector('img');
    var cap = el.getAttribute('data-cap') || '';
    var alt = img ? img.getAttribute('alt') : '';

    el.addEventListener('click', function () {
      openLb(el.getAttribute('data-zoom'), cap, alt);
    });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLb(el.getAttribute('data-zoom'), cap, alt);
      }
    });
  });

  if (lb) {
    // 点遮罩关闭（点内容区不关）
    lb.addEventListener('click', function (e) {
      if (e.target === lb) closeLb();
    });
    if (lbClose) lbClose.addEventListener('click', closeLb);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb.classList.contains('is-open')) closeLb();
    });
  }

  /* ---------- 5. 打印 / 导出 PDF ---------- */
  document.querySelectorAll('[data-print]').forEach(function (btn) {
    btn.addEventListener('click', function () { window.print(); });
  });

  /* ---------- 6. 年份 ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
