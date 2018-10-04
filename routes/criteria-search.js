const express = require('express');
const criteriaSearch  = express.Router();
const queryString = require('query-string');
const axios = require('axios');
const _ = require('lodash');

/* GET home page */
criteriaSearch.get('/criteria-search', (req, res, next) => {
  res.render('criteriasearch');
});

// POST form
criteriaSearch.post('/criteria-search', (req, res, next) => {
  console.log("req.body: ");
  console.log(req.body);
  // console.log("req.body.codePostal[0]: " + req.body.codePostal[0]);  
  // console.log("req.body.codeApe: " + req.body.codeApe);
  
  // console.log("------codeAPE");
  // console.log(req.body.codeApe);
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

  // ----------UNI HTTP REQUEST----------
  // Put results of POST form in proper format
  // Put proper formatted results in variable
  // let codeAPE = queryString.stringify({"refine.code_ape": req.body.codeApe});
  // let codeRegion = queryString.stringify({"refine.region": req.body.region});
  // let codeDepartement = queryString.stringify({"refine.num_dept": req.body.num_dept});
  // let codeTrancheCA2017 = queryString.stringify({"refine.tranche_ca_millesime_1": req.body.tranche_CA_2017});
  // let codeTrancheCA2016 = queryString.stringify({"refine.tranche_ca_millesime_2": req.body.tranche_CA_2016});
  
  // let allLabels = codeAPE+"&"+codeRegion+"&"+codeDepartement+"&"+codeTrancheCA2017+"&"+codeTrancheCA2016;
  // if (req.body.codePostal) {
  //   let codePostal = queryString.stringify({"refine.code_postal": req.body.codePostal});
  //   allLabels += "&" + codePostal;
  // }
  // console.log("allLabels:");
  // console.log(allLabels);
  

  // Create URL with variable

if (typeof req.body.codeApe === 'string') {
  var codeApe = []
  codeApe.push(req.body.codeApe);
} else {
  var codeApe = req.body.codeApe;
}
console.log("----CodeApe----");
console.log(codeApe);

if (typeof req.body.region === 'string') {
  var region = []
  region.push(req.body.region)
} else {
  var region = req.body.region;
}
console.log("----Region----");
console.log(region);
if (typeof req.body.num_dept === 'string') {
  var num_dept = []
  num_dept.push(req.body.num_dept)
} else {
  var num_dept = req.body.num_dept;
}
if (typeof req.body.tranche_CA_2017 === 'string') {
  var tranche_CA_2017 = []
  tranche_CA_2017.push(req.body.tranche_CA_2017)
} else {
  var tranche_CA_2017 = req.body.tranche_CA_2017;
}
if (typeof req.body.tranche_CA_2016 === 'string') {
  var tranche_CA_2016 = []
  tranche_CA_2016.push(req.body.tranche_CA_2016)
} else {
  var tranche_CA_2016 = req.body.tranche_CA_2016;
}

// var label = document.querySelectorAll('.class')
// label.forEach(one => {
//   one.onclick = function () {
//     allLabels.push(one.value)
//   }
// })

let allRequests = [];
let allLabels = "";
(codeApe || [null]).forEach(elt => {
  console.log('forEach1');
  console.log(elt);
  (region || [null]).forEach(elt1 => {
  console.log('forEach2');
  console.log(elt1);
    (num_dept || [null]).forEach(elt2 => {
    console.log('forEach3');
    console.log(elt2);
      (tranche_CA_2017 || [null]).forEach(elt3 => {
        console.log('forEach4');
        console.log(elt3);
        (tranche_CA_2016 || [null]).forEach(elt4 => {
          console.log('forEach5');
          console.log(elt4);
          if (!elt == '') {
            let codeAPE = queryString.stringify({"refine.code_ape": elt});
            allLabels += '&'
            allLabels += codeAPE
          } else {console.log('elt not working');
          }
          if (!elt1 == '') {
            let codeRegion = queryString.stringify({"refine.region": elt1});
            allLabels += '&'
            allLabels += codeRegion
          } else {console.log('elt1 not working');
          }
          if (!elt2 == '') {
            let codeDepartement = queryString.stringify({"refine.num_dept": elt2});
            allLabels += '&'
            allLabels += codeDepartement
          } else {console.log('elt2 not working');
          }
          if (!elt3 == '') {
            let codeTrancheCA2017 = queryString.stringify({"refine.tranche_ca_millesime_1": elt3});
            allLabels += '&'
            allLabels += codeTrancheCA2017
          } else {console.log('elt3 not working');
          }
          if (!elt4 == '') {
            let codeTrancheCA2016 = queryString.stringify({"refine.tranche_ca_millesime_2": elt4});
            allLabels += '&'
            allLabels += codeTrancheCA2016
          } else {console.log('elt4 not working');
          }
          console.log('-----allLabelsstringy-----');
          console.log(allLabels);
          allRequests.push(axios.get(`https://opendata.datainfogreffe.fr/api/records/1.0/search/?dataset=chiffres-cles-2017&rows=-1${allLabels}`));
          allLabels = "";
        })
      })
    })
  })
})
Promise.all(allRequests)
.then(responses => {
  console.log("-----response-----");
  console.log(responses[0].data.records);
  let displayResults = _.flatten(responses.map(o=>o.data.records));
  console.log(displayResults);
  res.render('displayresults', {displayResults})
})             

// console.log("-----AllRequests-----");
// console.log(allRequests);


    // array.forEach(element => {CodeApe [1 2 3]
    //   array.forEach(element => {Code 1 + Region [1 2 3]
        
    //     array.forEach(element => { Code 1 + Region 1 + CA [1 2 3]
    //       return let results = 
    //         array.push(result.get(refine.code_ape=1&refine.millesime))
          
    //     });
    //   });
    // });

  // Launch HTTP request to this URL
  // result.get()
  // .then(response => {
  //   let displayResults = response.data.records;
  //   console.log("Length records: " + response.data.records.length);
  //   console.log("Length records[0]: ");
  //   console.log(response.data.records[0]);
  //   // console.log(response);
  //   // console.log('records[0]: ');
  //   // console.log(response.data.records[0]);
  //   const allTranches = response.data.records.map(elt => elt.fields.tranche_ca_millesime_1);
    
  //   var filteredTranches = allTranches.filter(function(item, pos){
  //     return allTranches.indexOf(item)=== pos; // Si le premier index de l'élément est également sa position alors on affiche cet élement (condition true). Sinon on ne l'affiche pas (parce que la position est false)
  //   });
  
  //   res.render('displayresults', {displayResults})
  //   res.render('apecodes', {filteredApeCodes})
  // })
  // .catch(function (error) {
  //   console.log(error);
  // });
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