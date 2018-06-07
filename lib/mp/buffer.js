class Buffer {
  constructor() {
    this.buffer = [];
    this.limit = 700000;
  }

  pop() {
    let currentSize = 0;
    const { buffer, limit } = this;
    const temp = {};

    while( buffer.length > 0 && currentSize < limit ) {
      let buf = buffer[0]
      let { key, data, size } = buf;
      currentSize += size;
      if (currentSize > limit) {
        break;
      }
      buffer.shift();

      temp[key] = data;
    }
    return temp;
  }

  push(data) {
    const keys = Object.keys(data);
    const { buffer } = this;

    keys.forEach((key) => {
      const dataPart = data[key]
      let str = JSON.stringify(dataPart);
      let size = str.length + key.length;

      let index = buffer.findIndex(buf => buf.key === key);
      let newBuf = {
        key,
        size,
        data: dataPart
      };

      if (index !== -1) {
        buffer[index] = newBuf;
      } else{
        buffer.push(newBuf);
      }
      
    });
  }

  isEmpty() {
    return this.buffer.length === 0;
  }
}

module.exports = Buffer;