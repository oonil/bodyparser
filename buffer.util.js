/**
 * compare two buffers you can provide begin and end of first buffer
 * @param {Buffer} buffer1 - buffer1 from which we have to search buffer2
 * @param {Buffer} buffer2 - buffer2 to search
 * @param {Number} begin
 * @param {Number} end
 * @returns
 */
function bufferCmp(buffer1, buffer2, begin, end) {
  //if size is less than  same return
  if (buffer1.length < buffer2.length)
    throw new Error("buffer size is small then search buffer");

  //check each buffer byte
  for (let i = begin; i < end; i++) {
    //
    if (buffer1[i] != buffer2[i - begin]) return false;
  }
  return true;
}

/**
 *  find searchBuffer in mainBuffer return array of positions;
 * @param {Buffer} mainBuffer
 * @param {Buffer} searchBuffer
 */
function bufferSearch(mainBuffer, searchBuffer) {
  //searchbuffer in main buffer;
  //search buffer is small.
  if (mainBuffer.length < searchBuffer.length) {
    throw new Error("main buffer is smaller then search buffer");
  }

  //both buffer are of same size check if both are same.
  if (searchBuffer.length == mainBuffer.length) {
    console.log("buffer are of same size");
    return bufferCmp(mainBuffer, searchBuffer, 0, mainBuffer.length);
  }

  /** @type {array} */
  let foundPoints = [];

  //now search for this buffer.
  //1st atleast search for intial characters
  for (let i = 0; i < mainBuffer.length; i++) {
    if (mainBuffer[i] == searchBuffer[0]) {
      if (bufferCmp(mainBuffer, searchBuffer, i, i + searchBuffer.length)) {
        foundPoints.push(i);
      }
    }
  }
  return foundPoints;
}

module.exports = { bufferCmp, bufferSearch };
