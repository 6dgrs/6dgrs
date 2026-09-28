(function () {
  'use strict';

  const TOKEN_PATTERN = /^[0-9a-f]{64}$/i;
  const panels = {
    ordinary: document.querySelector('[data-state="ordinary"]'),
    invitation: document.querySelector('[data-state="invitation"]'),
    unavailable: document.querySelector('[data-state="unavailable"]')
  };

  function show(state) {
    Object.entries(panels).forEach(([name, panel]) => {
      panel.hidden = name !== state;
    });
  }

  const query = new URLSearchParams(window.location.search);
  const fragment = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const suppliedToken = fragment.get('token') || query.get('token');

  if (!suppliedToken) {
    show('ordinary');
    return;
  }

  if (!TOKEN_PATTERN.test(suppliedToken)) {
    show('unavailable');
    return;
  }

  const token = suppliedToken.toLowerCase();
  if (query.has('token')) {
    window.history.replaceState(null, '', `/join#token=${token}`);
  }

  document.querySelector('[data-open-app]').href = `sixdgrs://join?token=${token}`;
  show('invitation');
}());
