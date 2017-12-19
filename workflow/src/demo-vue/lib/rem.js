;(function(win) {
  var h;
  var docEl = document.documentElement;
  function setUnitA(){
    win.rem = docEl.getBoundingClientRect().width / 40;
    docEl.style.fontSize = win.rem + 'px';
  }
  win.addEventListener('resize', function() {
    clearTimeout(h);
    h = setTimeout(setUnitA, 300);
  }, false);
  win.addEventListener('pageshow', function(e) {
    if (e.persisted) {
      clearTimeout(h);
      h = setTimeout(setUnitA, 300);
    }
  }, false);

  setUnitA();
})(window);



