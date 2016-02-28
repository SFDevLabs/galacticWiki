
/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

function getFixedSelectionCoords() {
  var win = win || window;
  var doc = win.document;
  var sel = doc.selection, range, rects, rect;
  var x = 0, y = 0;
  if (sel) {
      if (sel.type != "Control") {
          range = sel.createRange();
          range.collapse(true);
          x = range.boundingLeft;
          y = range.boundingTop;
      }
  } else if (win.getSelection) {
      sel = win.getSelection();
      if (sel.rangeCount) {
          range = sel.getRangeAt(0).cloneRange();
          if (range.getClientRects) {
              range.collapse(true);
              rects = range.getClientRects();
              if (rects.length > 0) {
                  rect = rects[0];
              }
              x = rect.left;
              y = rect.top;
          }
          // Fall back to inserting a temporary element
          if (x == 0 && y == 0) {
              var span = doc.createElement("span");
              if (span.getClientRects) {
                  // Ensure span has dimensions and position by
                  // adding a zero-width space character
                  span.appendChild( doc.createTextNode("\u200b") );
                  range.insertNode(span);
                  rect = span.getClientRects()[0];
                  x = rect.left;
                  y = rect.top;
                  var spanParent = span.parentNode;
                  spanParent.removeChild(span);

                  // Glue any broken text nodes back together
                  spanParent.normalize();
              }
          }
      }
  }
  return { x: x, y: y };
}

var Utils = {
  /**
   * Get page coords in absolute position.
  */ 
  getSelectionCoords: function(){
    const coords = getFixedSelectionCoords()
    const x = coords.x + document.body.scrollLeft;
    const y = coords.y + document.body.scrollTop;
    return [x, y]
  },
  /**
   * Get selection coordinates for page.
  */ 
  closest: function(el, selector) {
      var matchesFn;

      // find vendor prefix
      ['matches','webkitMatchesSelector','mozMatchesSelector','msMatchesSelector','oMatchesSelector'].some(function(fn) {
          if (typeof document.body[fn] == 'function') {
              matchesFn = fn;
              return true;
          }
          return false;
      })

      // traverse parents
      while (el!==null) {
          parent = el.parentElement;
          if (parent!==null && parent[matchesFn](selector)) {
              return parent;
          }
          el = parent;
      }

      return null;
  }
}

module.exports = Utils;