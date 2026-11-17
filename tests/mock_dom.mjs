/**
 * Gramin PocketLab — Lightweight DOM & HTML Parser Mock for Node.js Testing
 * Specifically supports hierarchical querySelector/querySelectorAll, event bubbling,
 * form/radio inputs, and element attributes.
 */

export class MockElement {
  constructor(tagName = 'DIV', parent = null) {
    this.tagName = tagName.toUpperCase();
    this.parent = parent;
    this.children = [];
    this.attributes = new Map();
    this.listeners = new Map();
    this.style = {};
    this._innerHTML = '';
    this._textContent = '';
    this.disabled = false;
    this.checked = false;
    this.value = '';
    this.type = '';
    this.name = '';
    this.id = '';
    this.className = '';
  }

  getContext(type) {
    return {
      clearRect: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      stroke: () => {},
      fill: () => {},
      fillText: () => {},
      measureText: () => ({ width: 50 }),
      fillRect: () => {},
      setLineDash: () => {},
      arc: () => {},
      closePath: () => {},
      save: () => {},
      restore: () => {},
      translate: () => {},
      scale: () => {},
      rotate: () => {},
      strokeStyle: '#000',
      fillStyle: '#000',
      lineWidth: 1
    };
  }

  get classList() {
    const self = this;
    return {
      add(...cls) {
        const classes = new Set(self.className.split(/\s+/).filter(Boolean));
        cls.forEach(c => classes.add(c));
        self.className = [...classes].join(' ');
      },
      remove(...cls) {
        const classes = new Set(self.className.split(/\s+/).filter(Boolean));
        cls.forEach(c => classes.delete(c));
        self.className = [...classes].join(' ');
      },
      toggle(cls, force) {
        const classes = new Set(self.className.split(/\s+/).filter(Boolean));
        if (force === true) classes.add(cls);
        else if (force === false) classes.delete(cls);
        else if (classes.has(cls)) classes.delete(cls);
        else classes.add(cls);
        self.className = [...classes].join(' ');
      },
      contains(cls) {
        return self.className.split(/\s+/).includes(cls);
      }
    };
  }

  get dataset() {
    const ds = {};
    for (const [k, v] of this.attributes) {
      if (k.startsWith('data-')) {
        const camelKey = k.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        ds[camelKey] = v;
      }
    }
    return ds;
  }

  setAttribute(k, v) {
    this.attributes.set(k, String(v));
    if (k === 'id') this.id = String(v);
    if (k === 'class') this.className = String(v);
    if (k === 'name') this.name = String(v);
    if (k === 'type') this.type = String(v);
    if (k === 'value') this.value = String(v);
    if (k === 'disabled') this.disabled = true;
    if (k === 'checked') this.checked = true;
  }

  getAttribute(k) {
    if (k === 'id') return this.id || null;
    if (k === 'class') return this.className || null;
    return this.attributes.has(k) ? this.attributes.get(k) : null;
  }

  removeAttribute(k) {
    this.attributes.delete(k);
    if (k === 'disabled') this.disabled = false;
    if (k === 'checked') this.checked = false;
  }

  hasAttribute(k) {
    return this.attributes.has(k);
  }

  addEventListener(event, fn) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(fn);
  }

  removeEventListener(event, fn) {
    if (this.listeners.has(event)) {
      this.listeners.set(event, this.listeners.get(event).filter(f => f !== fn));
    }
  }

  dispatchEvent(eventObj) {
    const eventType = eventObj.type;
    if (!eventObj.target) eventObj.target = this;

    // Call listeners on current element
    if (this.listeners.has(eventType)) {
      const cbs = [...this.listeners.get(eventType)];
      for (const fn of cbs) {
        fn.call(this, eventObj);
      }
    }

    // Bubble up to parent if bubbles !== false
    if (eventObj.bubbles !== false && this.parent) {
      this.parent.dispatchEvent(eventObj);
    }
  }

  click() {
    this.dispatchEvent({ type: 'click', target: this, bubbles: true });
  }

  focus() {
    // Focus placeholder
  }

  getContext(type) {
    if (type === '2d') {
      const dummyContext = {
        canvas: this,
        fillStyle: '#000',
        strokeStyle: '#000',
        lineWidth: 1,
        font: '10px sans-serif',
        textAlign: 'left',
        textBaseline: 'top'
      };
      return new Proxy(dummyContext, {
        get(target, prop) {
          if (prop in target) return target[prop];
          return () => {};
        },
        set(target, prop, val) {
          target[prop] = val;
          return true;
        }
      });
    }
    return null;
  }

  getBoundingClientRect() {
    return { width: 600, height: 240, top: 0, left: 0 };
  }

  closest(selector) {
    let curr = this;
    while (curr) {
      if (curr.matches && curr.matches(selector)) {
        return curr;
      }
      curr = curr.parent;
    }
    return null;
  }

  matches(sel) {
    sel = sel.trim();
    if (sel.startsWith('#')) {
      return this.id === sel.slice(1);
    }
    if (sel.startsWith('.')) {
      const cls = sel.slice(1);
      return this.classList.contains(cls);
    }
    if (sel.startsWith('[') && sel.endsWith(']')) {
      const inner = sel.slice(1, -1);
      const [attr, val] = inner.split('=').map(s => s.replace(/['"]/g, '').trim());
      if (val !== undefined) {
        return this.getAttribute(attr) === val;
      }
      return this.hasAttribute(attr);
    }
    return this.tagName.toLowerCase() === sel.toLowerCase();
  }

  querySelector(selector) {
    const list = this.querySelectorAll(selector);
    return list.length > 0 ? list[0] : null;
  }

  querySelectorAll(selector) {
    selector = selector.trim();
    const results = [];

    const search = (node) => {
      for (const child of node.children) {
        if (child.matches && child.matches(selector)) {
          results.push(child);
        }
        search(child);
      }
    };

    search(this);
    return results;
  }

  get textContent() {
    if (this.children.length === 0) {
      return this._textContent;
    }
    return this.children.map(c => c.textContent).join(' ');
  }

  set textContent(val) {
    this._textContent = String(val);
    this.children = [];
  }

  get innerHTML() {
    return this._innerHTML;
  }

  set innerHTML(html) {
    this._innerHTML = html;
    this.children = [];
    parseHtmlInto(html, this);
  }
}

/**
 * Lightweight HTML parser constructing a MockElement hierarchy.
 */
export function parseHtmlInto(html, parentElement) {
  if (!html || typeof html !== 'string') return;

  const tagRegex = /<\/?([a-zA-Z0-9\-]+)([^>]*)>|([^<]+)/g;
  let match;
  let currentParent = parentElement;

  const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

  while ((match = tagRegex.exec(html)) !== null) {
    const fullTag = match[0];
    const tagName = match[1];
    const tagAttrs = match[2];
    const textContent = match[3];

    if (textContent) {
      const trimmed = textContent.trim();
      if (trimmed) {
        const textNode = new MockElement('#TEXT', currentParent);
        textNode._textContent = trimmed;
        currentParent.children.push(textNode);
      }
    } else if (fullTag.startsWith('</')) {
      // Closing tag: pop up if parent matches
      if (currentParent !== parentElement && currentParent.parent) {
        currentParent = currentParent.parent;
      }
    } else if (fullTag.startsWith('<')) {
      // Opening tag
      const element = new MockElement(tagName, currentParent);
      if (tagAttrs) {
        const attrRegex = /([a-zA-Z0-9\-]+)(?:=["']([^"']*)["'])?/g;
        let attrMatch;
        while ((attrMatch = attrRegex.exec(tagAttrs)) !== null) {
          const attrName = attrMatch[1];
          const attrVal = attrMatch[2] !== undefined ? attrMatch[2] : '';
          element.setAttribute(attrName, attrVal);
        }
      }

      currentParent.children.push(element);

      const isVoid = voidTags.has(tagName.toLowerCase()) || fullTag.endsWith('/>');
      if (!isVoid) {
        currentParent = element;
      }
    }
  }
}
