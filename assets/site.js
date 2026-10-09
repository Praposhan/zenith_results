// PRAPOSHAN site behaviour: market (India/US), mobile menu, reveal on scroll, simple sign-up forms.
(function () {
  var root = document.documentElement;
  function detectMarket() {
    try { var saved = localStorage.getItem('praposhan_market'); if (saved === 'in' || saved === 'us') return saved; } catch (e) {}
    try { var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; if (/Kolkata|Calcutta/.test(tz)) return 'in'; } catch (e) {}
    return 'us';
  }
  function setMarket(m) {
    root.setAttribute('data-market', m);
    try { localStorage.setItem('praposhan_market', m); } catch (e) {}
    document.querySelectorAll('.market button').forEach(function (b) { b.classList.toggle('on', b.dataset.m === m); });
  }
  setMarket(detectMarket());

  document.addEventListener('DOMContentLoaded', function () {
    setMarket(root.getAttribute('data-market'));
    document.querySelectorAll('.market button').forEach(function (b) {
      b.addEventListener('click', function () { setMarket(b.dataset.m); });
    });
    var btn = document.querySelector('.menu-btn'), nav = document.querySelector('.nav');
    if (btn && nav) btn.addEventListener('click', function () { nav.classList.toggle('open'); });

    var els = document.querySelectorAll('.rv');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { rootMargin: '0px 0px -8% 0px' });
      els.forEach(function (el) { io.observe(el); });
    } else { els.forEach(function (el) { el.classList.add('in'); }); }

    // Email sign-up forms (journal, PRAPOSHAN Rx waitlist) → same Apps Script as the quiz
    var ENDPOINT = 'https://script.google.com/macros/s/AKfycbzYmVyEqOMn4P66AaIl57hzWnCiYv08IY_gErJDM7qwYu6XkWyx3w8ycJbvgZGVHjM7/exec';
    document.querySelectorAll('form[data-signup]').forEach(function (f) {
      f.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var email = (f.querySelector('input[type=email]') || {}).value || '';
        var msg = f.parentNode.querySelector('.form-msg');
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { if (msg) msg.textContent = 'Please enter a valid email.'; return; }
        fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', body: JSON.stringify({ action: 'newsletter_signup', email: email, context: f.dataset.signup }) })
          .catch(function () {});
        if (msg) msg.textContent = f.dataset.signup === 'rx' ? "You're on the list. We'll write when PRAPOSHAN Rx opens." : "You're in. New articles will come to your inbox.";
        f.reset();
      });
    });
  });
})();
