let url ="https://www.espncricinfo.com/series/ipl-2020-21-1210595"
let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");

request(url,cb);
let directoryPath = path.join("C:\\Users\\onkar\\OneDrive\\Desktop\\web d pep\\web scrapping espncricinfo\\ACTIVITY 3","IPL");
function cb(error,response,html){
    if(error){
        console.log(error);
    }
    else if(response.statusCode == 404){
        console.log("Page Not found")
    }
else{
    // console.log(html);
    // console.log("html:",);
   
 } dataExtracter(html);
}   
function dataExtracter(html){
    let searchTool = cheerio.load(html);
    //css selector -> elem 
    let viewresulLink = searchTool(".widget-items.cta-link").find("a").attr("href");
    let completeLink = "https://www.espncricinfo.com" + viewresulLink;
    
      request(completeLink,viewresult);
}

function viewresult(error,response,html){
    if(error){
        console.log(error);
    }
    else if(response.statusCode == 404){
        console.log("Page Not found")
    }
else{
    
    getInformation(html);
 } 

}

   
function getInformation(html){
   
    let isIPL = fs.existsSync(directoryPath)
    if(isIPL){
        console.log("IPL file already found 🤦‍♂️");
        return;
    }
    fs.mkdirSync(directoryPath);

    let searchTool = cheerio.load(html);
     
     let scoreCard = searchTool(`a[data-hover="Scorecard"]`);
   for(let i =0 ;i <scoreCard.length;i++){
        let allLinks = "https://www.espncricinfo.com" + searchTool(scoreCard[i]).attr("href");
        
        request(allLinks,batsman);
   }
}
function batsman(error,response,html){
    if(error){
        console.log(error);
    }
    else if(response.statusCode == 404){
        console.log("Page Not found")
    }
else{
    
     batsmanInfo(html);
 } 
}
function batsmanInfo(html){
let searchTool = cheerio.load(html);
let teamName=  searchTool(".name-link p");
let batsmanTable = searchTool(".table.batsman");
 for(let i=0; i<batsmanTable.length;i++){
     let rows = searchTool(batsmanTable[i]).find("tbody tr");
     let state = searchTool(teamName[i]).text();
     let teamPath = path.join(directoryPath,state);
     let Teamispresent = fs.existsSync(teamPath);
     if(Teamispresent){

     }
     else{
         fs.mkdirSync(teamPath);
     }
     

                
     for(let j=0; j<rows.length-1;j++){
        let cols = searchTool(rows[j]).find("td");
        let isBatsManRow = searchTool(cols[0]).hasClass("batsman-cell");
        if(isBatsManRow == true){
       
          let name = searchTool(cols[0]).text();
          let run = searchTool(cols[2]).text();
          let ball = searchTool(cols[3]).text();
          let fours = searchTool(cols[5]).text();
          let six = searchTool(cols[6]).text();
          let strikeRate = searchTool(cols[7]).text();
        //   console.log(name + " " + run +" " + ball+" " + fours+" " +six+ " " + strikeRate);
         let info = {
         "name": name,
         "run":run,
         "ball":ball,
         "fours":fours,
         "six":six,
         "strikeRate": strikeRate
        }
      let array = [];
      array.push(info);
            

         let jsoninfo = JSON.stringify(array);
          let playerInfo = path.join(teamPath,name + ".json");
          let playerAlready = fs.existsSync(playerInfo);
           
          if(playerAlready){
               let content = fs.readFileSync(playerInfo);
               let jsoncontent = JSON.parse(content);
               jsoncontent.push(info);
               let modified = JSON.stringify(jsoncontent);
               fs.writeFileSync(playerInfo, modified);
          }
          else{
                 fs.writeFileSync(playerInfo,jsoninfo);
          }
         

     }
        //   console.log(name);
     }
 }

}
