//? https://datatracker.ietf.org/doc/html/rfc7578#section-1

const http = require("http");
const https = require("https");
const { URL } = require("url");
const Buffer = require("buffer").Buffer;
const { bufferCmp, bufferSearch } = require("./buffer.util");

// const http_Agent = http.Agent({ keepAlive: true });
// const http_clientReqeust = http.ClientRequest();

// //server
// const http_server = http.Server();
// const http_ServerResponse = http.ServerResponse();
// const http_IncomingMessage = http.IncomingMessage();
// const http_OutgoingMessage = http.OutgoingMessage();

const http_METHODS = http.METHODS;
const http_STATUS_CODES = http.STATUS_CODES;

// apiRequstWithRequest();
function apiRequstWithRequest() {
  const postData = JSON.stringify({
    msg: "hello world",
  });

  //https://reqres.in/api/users/2
  //what are the options for the request
  const options = {
    method: "GET",
    hostname: "reqres.in",
    path: "/api/users",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  const req = http.request(options, (res) => {
    console.log(
      "Status:",
      `${res.statusCode}`,
      http.STATUS_CODES[res.statusCode]
    );

    console.log("typeof statusCode::", typeof res.statusCode);
    // redirection is happening with status code 3xx
    if (res.statusCode.toString().startsWith("3") && res.headers.location) {
      console.log("redirecting....");

      const redirectURI = new URL(res.headers.location);
      if (redirectURI.protocol === "https:") {
        https
          .request(redirectURI, (res) => {
            //  'content-type': 'application/json; charset=utf-8',
            //   'content-length': '280',
            //   console.log("headers_redirect::", res.headers);
            let chunkPlace = 0;
            const responseBuffer = Buffer.alloc(
              parseInt(res.headers["content-length"])
            );
            res.on("data", (chunk) => {
              //     console.log(chunk.toString());
              console.log("chun---------------------");
              responseBuffer.write(chunk.toString(), chunkPlace);
              chunkPlace = chunkPlace + chunk.length;
            });

            //on end response
            res.on("end", () => {
              if (
                res.headers["content-type"] ===
                "application/json; charset=utf-8"
              ) {
                //
                //type is of json
                console.log(
                  "responseBuffer::",
                  JSON.parse(responseBuffer.toString())
                );
              }
              console.log("rediection data end");
            });
          })
          .on("error", (e) => {
            console.log("e.message_redirect::", e.message);
          })
          .end();
        return;
      }

      const redirectionReq = http.request(res.headers.location);
      redirectionReq.on("data", (chunk) => {
        console.log(chunk.toString());
      });
      //?end event
      redirectionReq.on("end", () => {
        console.log("No more data in response.");
      });
    }
    console.log("Headers:", res.headers);
    //fires when the chunks are received
    //?data event
    res.on("data", (chunk) => {
      console.log(chunk.toString());
    });
    //?end event
    res.on("end", () => {
      console.log("No more data in response.");
    });
  });

  req.on("error", (e) => {
    console.log("e.message", e.message);
  });
  // req.write(postData); doenn't need postData::getMethod
  req.end();
}

//allowed origins list
const allowedOrigins = ["http://localhost:8080", "http://127.0.0.1:8080"];

const server = http.createServer((req, res) => {
  //before everything else set headers
  if (allowedOrigins.includes(req.headers.origin)) {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
  }
  // if not upload method send cannot get the file
  if (req.url != "/upload") {
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("status", "401");
    res.write(`Cannot ${req.method} ${req.url}`);
    res.end();
    return;
  }

  bodyParser(req);
  console.log("req.url::", req.url);
  // console.log("req", req);
  //telling browser it's fine to have request from any origin
  console.log("req.headers.origin", req.headers.origin);

  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify({ msg: "uploaded" }));
  res.end();
});
server.listen(3000, () => {
  console.log("listening on port 3000");
});

//parse request.body form request
function bodyParser(req) {
  let count;
  //check if content type is multipart/form-data
  if (!req.headers["content-type"].startsWith("multipart/form-data")) return;

  //body informations
  let multipartBoundery = req.headers["content-type"].split("boundary=")[1];
  let contentLength = req.headers["content-length"];

  //if content type or mutlipartBoundar doens't exist then
  // we can't process the request.
  if (!contentLength || !multipartBoundery)
    throw new Error("Invalid Content-Type");

  //parse formdata

  //request.body;
  let reqBody = "";
  let chunkPlace = 0;

  req.on("data", (chunk) => {
    //one chunk is equals to the content length;
    if (chunk.length == contentLength) {
      let boundaryBuffer = Buffer.from(multipartBoundery);
      let contentBuffer = Buffer.from(chunk);
      console.log("....boudaryBuffer to compare....");
      let dataPoints = bufferSearch(contentBuffer, boundaryBuffer);
      console.log(dataPoints);
      console.log("we have total ", dataPoints.length - 1, " fields");
    }
    if (chunkPlace == 0) {
    }

    // console.log(chunk.toString());

    chunkPlace++;
  });

  req.on("end", () => {
    console.log("-----------THE-END-REQUEST--------");
  });
}
