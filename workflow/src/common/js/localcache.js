/**
 * 本地缓存
 */
define('localcache', function (require, exports, module) {
  var _cacheThisModule_;
  var storage = window.localStorage,
    prefix = '$lc_',
    defaultSet = {
      expires: 1440
    };
  if (!storage) {
    return {
      getItem: function () {
      },
      setItem: function () {
      }
    };
  }
  for (var k in storage) {
    try {
      if (k.indexOf(prefix) === 0) {
        getStorageObj(k);
      }
    } catch (e) {
    }
  }

  function JsonToStr(o) {
    if (o == undefined) {
      return "";
    }
    if (JSON && JSON.stringify) {
      return JSON.stringify(o);
    } else {
      var r = [];
      if (typeof o == "string") return "\"" + o.replace(/([\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
      if (typeof o == "object") {
        if (!o.sort) {
          for (var i in o)
            r.push("\"" + i + "\":" + JsonToStr(o[i]));
          if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
            r.push("toString:" + o.toString.toString());
          }
          r = "{" + r.join() + "}"
        } else {
          for (var i = 0; i < o.length; i++)
            r.push(JsonToStr(o[i]))
          r = "[" + r.join() + "]";
        }
        return r;
      }
      return o.toString().replace(/\"\:/g, '":""');
    }
  }

  function clearStorage() {
    for (var k in storage) {
      if (k.indexOf(prefix) === 0) {
        storage.removeItem(k);
      }
    }
  }

  function removeStorage(name) {
    storage.removeItem(prefix + name);
  }

  function setStorage(name, value, expires) {
    var timeNow = new Date(),
      timeNowUnix = timeNow.getTime(),
      absExpires;
    expires = parseInt(expires ? expires : defaultSet.expires);
    absExpires = timeNow.setMinutes(timeNow.getMinutes() + expires);
    if (name && absExpires > timeNowUnix) {
      storage.removeItem(prefix + name);
      storage.setItem(prefix + name, JsonToStr({
        name: name,
        value: value,
        expires: absExpires
      }));
    }
  }

  function getStorageObj(name) {
    var storageObj, timeNow = new Date();
    if (JSON && JSON.parse) {
      storageObj = JSON.parse(storage.getItem(name));
    } else {
      storageObj = eval('(' + storage.getItem(name) + ')');
    }
    if (storageObj && timeNow.getTime() < storageObj.expires) {
      return storageObj;
    } else {
      storage.removeItem(name);
      return null;
    }
  }

  function getStorage(name) {
    var storageObj = getStorageObj(prefix + name);
    return storageObj ? storageObj.value : null;
  }

  exports.set = function (name, value, expires) {
    try {
      setStorage(name, value, expires);
      return this;
    } catch (e) {
    }
  }
  exports.setItem = function (name, value, expires) {
    try {
      setStorage(name, value, expires);
      return this;
    } catch (e) {
    }
  }
  exports.get = function (name) {
    try {
      return getStorage(name);
    } catch (e) {
    }
  }
  exports.getItem = function (name) {
    try {
      return getStorage(name);
    } catch (e) {
    }
  }
  exports.remove = function (name) {
    try {
      removeStorage(name);
      return this;
    } catch (e) {
    }
  }
  exports.clear = function () {
    try {
      clearStorage();
      return this;
    } catch (e) {
    }
  }
  exports.setDefault = function (cfg) {
    for (var k in cfg) {
      if (defaultSet[k]) defaultSet[k] = cfg[k];
    }
  };

  exports.getAllKeys = function () {
    var keys = [];
    for (var itemName in localStorage) {
      if (itemName.indexOf(prefix) > -1) {
        keys.push(itemName);
      }
    }

    return keys;
  }
});