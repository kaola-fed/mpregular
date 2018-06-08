class Buffer {
  constructor() {
    this.buffer = [];
  }

  pop() {
    const { buffer, limit } = this;

    const res = this.buffer.reduce((res, buf) => {
      const { key, data } = buf;
      res[key] = data;
      return res;
    }, {});

    this.clear();

    return res;
  }

  push(data) {
    const keys = Object.keys(data);
    const { buffer } = this;

    keys.forEach((key) => {
      const dataPart = data[key]

      let index = buffer.findIndex(buf => buf.key === key);
      let newBuf = {
        key,
        data: dataPart
      };

      if (index !== -1) {
        buffer[index] = newBuf;
      } else{
        buffer.push(newBuf);
      }
      
    });
  }

  clear() {
    const temp = this.buffer;
    this.buffer = [];
    return temp;
  }

  isEmpty() {
    return this.buffer.length === 0;
  }
}

module.exports = Buffer;