/**
 * parse the form-data here
 * @param {import("http").IncomingMessage} req - request object for headers
 */
function bodyParser(req) {
  //check it's valid data parsing.
  if (!req.headers["content-type"].startsWith("multipart/form-data")) return;

  //body informations
  let multipartBoundery = req.headers["content-type"].split("boundary=")[1];
  let contentLength = req.headers["content-length"];

  //if content type or mutlipartBoundar doens't exist then
  // we can't process the request.
  if (!contentLength || !multipartBoundery)
    throw new Error("Invalid Content-Type");

  req.on("data", (chunk) => {
    //data chunk here
  });
  req.on("end", () => {
    console.log("----------THE-END---------");
  });
}
module.exports = bodyParser;
