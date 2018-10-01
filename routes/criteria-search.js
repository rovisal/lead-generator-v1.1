const express = require('express');
const criteriaSearch  = express.Router();
const queryString = require('query-string');
const axios = require('axios');



/* GET home page */
criteriaSearch.get('/criteria-search', (req, res, next) => {
  res.render('criteriasearch');
});

// POST form
criteriaSearch.post('/criteria-search', (req, res, next) => {
  console.log("req.body: ");
  console.log(req.body);
  // console.log("req.body.codePostal[0]: " + req.body.codePostal[0]);  
  console.log("req.body.codeApe: " + req.body.codeApe);
  
  // console.log("req.body.codeApe[0]: " + req.body.codeApe[0]);
  // const allLabels = [req.body.codePostal, req.body.codeApe];
  // const selectedLabels = "";
  // allLabels.forEach(function(elt) {
  //   if(!elt === undefined) {
  //     // selectedLabels.push(elt)
  //     let label = elt[:9];
  //     let temporary = queryString.stringify({'&refine.${label}': elt});
  //     selectedLabels += temporary;
  //   }
  // })

  // Put results of POST form in proper format
  // Put proper formatted results in variable
  let codeAPE = queryString.stringify({"refine.code_ape": req.body.codeApe});
  let codeRegion = queryString.stringify({"refine.region": req.body.region});
  let codeDepartement = queryString.stringify({"refine.num_dept": req.body.num_dept});
  let codeTrancheCA2017 = queryString.stringify({"refine.tranche_ca_millesime_1": req.body.tranche_CA_2017});
  let codeTrancheCA2016 = queryString.stringify({"refine.tranche_ca_millesime_2": req.body.tranche_CA_2016});
  
  let allLabels = codeAPE+"&"+codeRegion+"&"+codeDepartement+"&"+codeTrancheCA2017+"&"+codeTrancheCA2016;
  if (req.body.codePostal) {
    let codePostal = queryString.stringify({"refine.code_postal": req.body.codePostal});
    allLabels += "&" + codePostal;
  }
  
  console.log("allLabels:");
  console.log(allLabels);
  

  // Create URL with variable
  const result = axios.create({
    baseURL: `https://opendata.datainfogreffe.fr/api/records/1.0/search/?dataset=chiffres-cles-2017&rows=-1&${allLabels}`})
    
    // array.forEach(element => {CodeApe [1 2 3]
    //   array.forEach(element => {Code 1 + Region [1 2 3]
        
    //     array.forEach(element => { Code 1 + Region 1 + CA [1 2 3]
    //       return let results = 
    //         array.push(result.get(refine.code_ape=1&refine.millesime))
          
    //     });
    //   });
    // });

  // Launch HTTP request to this URL
  result.get()
  .then(response => {
    let displayResults = response.data.records;
    console.log("Length records: " + response.data.records.length);
    console.log("Length records[0]: ");
    console.log(response.data.records[0]);
    // console.log(response);
    // console.log('records[0]: ');
    // console.log(response.data.records[0]);
    const allTranches = response.data.records.map(elt => elt.fields.tranche_ca_millesime_1);
    
    var filteredTranches = allTranches.filter(function(item, pos){
      return allTranches.indexOf(item)=== pos; // Si le premier index de l'élément est également sa position alors on affiche cet élement (condition true). Sinon on ne l'affiche pas (parce que la position est false)
    });
    

    // console.log("-----------allRegions-----------");
    // console.log(allRegions);

    console.log("-----------filteredTranches-----------");
    console.log(filteredTranches);

    res.render('displayresults', {displayResults})
    // res.render('apecodes', {filteredApeCodes})
  })
  .catch(function (error) {
    console.log(error);
  });
})

module.exports = criteriaSearch;


/////////////////////



// let stockTicket = "amzn";
// document.getElementById("getstockinfo").onclick = function(){
//   let stockTicket = document.getElementById("stockticket").value ;   
  // getStockInfo(`${stockTicket}/chart`);
// }

// function getStockInfo(id) {
//   stockInfo.get(id)
//   .then(function (response) {
//     console.log(response);
//     printTheChart(response.data);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });
// }