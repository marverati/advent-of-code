const { absMod } = require("../_util");

class Ring extends Array {
  constructor(size, valueOrGenerator) {
    super(size);
    const generator = valueOrGenerator instanceof Function ? valueOrGenerator : () => valueOrGenerator;
    for (let i = 0; i < size; i++) {
      this[i] = generator();
    }
    this.i0 = 0;
  }

  shift(byIndices = 1) {
    this.i0 += byIndices;
  }

  unshift() {
    throw new Error("Unshift not supported");
  }

  get(i) {
    return this[ absMod(this.i0 + i, this.length) ];
  }

  set(i, v) {
    this[ absMod(this.i0 + i, this.length) ] = v;
  }

  forEach(handler) {
    for (let i = 0; i < this.length; i++) {
      handler(this.get(i), i);
    }
  }

  map(mapFunc) {
    return new Ring(this.length, (i) => mapFunc(this.get(i)));
  }

  toArray() {
    const arr = new Array(this.length);
    for (let i = 0; i < this.length; i++) {
      arr[i] = this.get(i);
    }
    return arr;
  }

  slice() {
    return this.clone();
  }

  clone() {
    return this.map(v => v);
  }

  find(func) {
    for (let i = 0; i < this.length; i++) {
      const v = this.get(i);
      if (func(v)) {
        return v;
      }
    }
    return null;
  }

  findIndex(func) {
    for (let i = 0; i < this.length; i++) {
      if (func(this.get(i))) {
        return i;
      }
    }
    return -1;
  }
}