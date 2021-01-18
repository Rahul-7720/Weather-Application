const http = require("http");
const fs = require("fs");
var requests = require ("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const port = process.env.PORT || 3001

const replaceVal = (tempval, orgVal) => {
    let temperatue = tempval.replace("{%tempval%}",orgVal.main.temp);
    temperatue = temperatue.replace("{%tempmin%}",orgVal.main.temp_min);
    temperatue = temperatue.replace("{%tempmax%}",orgVal.main.temp_max);
    temperatue = temperatue.replace("{%location%}",orgVal.name);
    temperatue = temperatue.replace("{%country%}",orgVal.sys.country);
    temperatue = temperatue.replace("{%tempstatus%}",orgVal.weather[0].main); 
    return temperatue;
};

const server = http.createServer((req,res) => {
     if(req.url=="/") {
        requests("http://api.openweathermap.org/data/2.5/weather?q=Bokaro&appid=4af2e6212bc5e7ea9f6d096410c3af11",)
        .on("data", (chunk) => {
           const objData = JSON.parse(chunk);
           const arrData = [objData];       
           /*console.log(arrData[0].main.temp);
           console.log(arrData);*/
           const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
             //console.log(val.main);  
             res.write(realTimeData);
        //console.log(realTimeData);
      })
        .on("end", (err) => {
          if (err) return console.log("connection closed due to errors", err);
          res.end();
        });
     } 
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`)
})

