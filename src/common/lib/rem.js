;(function (win) {
    let h;
    let docEl = document.documentElement;
    function setUnitA () {
      let w = docEl.getBoundingClientRect().width;
      let r = 40;
      if (w === 412) {
        r = (412 / 375) * 40;
      }
      win.rem = w / r;
      docEl.style.fontSize = win.rem + 'px';
    }
  
    win.addEventListener('resize', function () {
      clearTimeout(h);
      h = setTimeout(setUnitA, 300);
    }, false);
    win.addEventListener('pageshow', function (e) {
      if (e.persisted) {
        clearTimeout(h);
        h = setTimeout(setUnitA, 300);
      }
    }, false);
  
    setUnitA();
  })(window);
  