const express = require('express');
const criteriaSearch  = express.Router();
const queryString = require('query-string');
const axios = require('axios');
const _ = require('lodash');
const excel = require('node-excel-export');

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

function formatNum(chaine) {
  resu = chaine.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  console.log(chaine)
  console.log('res', resu)
  return resu;
};  

Promise.all(allRequests)
.then(responses => {
  console.log("-----response-----");
  console.log(responses[0].data.records);
  let displayResults = _.flatten(responses.map(o=>o.data.records));
  displayResults.map(o => {
    o.ca2016 = o.fields.ca_2 ? formatNum(o.fields.ca_2) : "-";
    o.ca2017 = o.fields.ca_1 ? formatNum(o.fields.ca_1) : "-";
    o.siren = o.fields.siren ? formatNum(o.fields.siren) : "-";
    o.effectif_2 = o.fields.effectif_2 ? formatNum(o.fields.effectif_2) : "-";
    o.effectif_1 = o.fields.effectif_1 ? formatNum(o.fields.effectif_1) : "-";
    return o
  })
  console.log(displayResults);
  
  //
  const dataset = displayResults.map(elt => {
    return {
      siren : elt.fields.siren,
      code_ape : elt.fields.code_ape,
      denomination : elt.fields.denomination,
      region : elt.fields.region,
      num_dept : elt.fields.num_dept,
      ca_2016 : elt.fields.ca_2,
      ca_2017 : elt.fields.ca_1,
      effectif_2016 : elt.fields.effectif_2,
      effectif_2017 : elt.fields.effectif_1,
      fiche_identite : elt.fields.fiche_identite,
      google : "https://www.google.com/search?q="+ elt.fields.denomination +"\'",
      linkedin : "https://www.linkedin.com/search/results/companies/v2/?keywords="+ elt.fields.denomination +"\'",
      twitter : "https://twitter.com/search?f=users&vertical=default&q="+ elt.fields.denomination +"\'"
    }
  })
    
    res.render('displayresults', {displayResults, form:req.body})
})     

})


criteriaSearch.post('/criteria-search/export', (req, res, next) => {
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
  
  function formatNum(chaine) {
    resu = chaine.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    console.log(chaine)
    console.log('res', resu)
    return resu;
  };  
  
  Promise.all(allRequests)
  .then(responses => {
    console.log("-----response-----");
    console.log(responses[0].data.records);
    let displayResults = _.flatten(responses.map(o=>o.data.records));
    displayResults.map(o => {
      o.ca2016 = o.fields.ca_2 ? formatNum(o.fields.ca_2) : "-";
      o.ca2017 = o.fields.ca_1 ? formatNum(o.fields.ca_1) : "-";
      o.siren = o.fields.siren ? formatNum(o.fields.siren) : "-";
      o.effectif_2 = o.fields.effectif_2 ? formatNum(o.fields.effectif_2) : "-";
      o.effectif_1 = o.fields.effectif_1 ? formatNum(o.fields.effectif_1) : "-";
      return o
    })
    console.log(displayResults);
    
    //
    const dataset = displayResults.map(elt => {
      return {
        siren : elt.fields.siren,
        code_ape : elt.fields.code_ape,
        denomination : elt.fields.denomination,
        region : elt.fields.region,
        num_dept : elt.fields.num_dept,
        ca_2016 : elt.fields.ca_2,
        ca_2017 : elt.fields.ca_1,
        effectif_2016 : elt.fields.effectif_2,
        effectif_2017 : elt.fields.effectif_1,
        fiche_identite : elt.fields.fiche_identite,
        google : "https://www.google.com/search?q="+ elt.fields.denomination +"\'",
        linkedin : "https://www.linkedin.com/search/results/companies/v2/?keywords="+ elt.fields.denomination +"\'",
        twitter : "https://twitter.com/search?f=users&vertical=default&q="+ elt.fields.denomination +"\'"
      }
    })
    console.log("-->");
    console.log(dataset.length);
    
    return reportGeneration(dataset)
  })     

  function reportGeneration(dataset) {
    console.log('entering fn');
    
    // Excel Export
    const heading = [
      ['Siren', 'Code APE', 'Nom de l\'entreprise', 'Région', 'Département', 'CA 2016', 'CA 2017', 'Effectifs 2016', 'Effectifs 2017','fiche_identite',
      'Trouver sur Google', 'Trouver sur LinkedIn', 'Trouver sur Twitter'] // <-- It can be only values
    ];
    
    //Here you specify the export structure
    const specification = {
      siren: { // <- the key should match the actual data key
        displayName: 'Siren', // <- Here you specify the column header
        // headerStyle: styles.headerDark, // <- Header style
        width: 120 // <- width in pixels
      },
      code_ape: { // <- the key should match the actual data key
        displayName: 'Code APE', // <- Here you specify the column header
        // headerStyle: styles.headerDark, // <- Header style
        width: 120 // <- width in pixels
      },
      denomination: { // <- the key should match the actual data key
        displayName: 'Nom de l\'entreprise', // <- Here you specify the column header
        // headerStyle: styles.headerDark, // <- Header style
        width: 120 // <- width in pixels
      },
      region: { // <- the key should match the actual data key
        displayName: 'Région', // <- Here you specify the column header
        // headerStyle: styles.headerDark, // <- Header style
        width: 120 // <- width in pixels
      },
      num_dept: { // <- the key should match the actual data key
        displayName: 'Département', // <- Here you specify the column header
        // headerStyle: styles.headerDark, // <- Header style
        width: 120 // <- width in pixels
      },
      ca_2016: { // <- the key should match the actual data key
        displayName: 'CA 2016', // <- Here you specify the column header
        // headerStyle: styles.headerDark, // <- Header style
        width: 120 // <- width in pixels
      },
      ca_2017: { // <- the key should match the actual data key
        displayName: 'CA 2017', // <- Here you specify the column header
        // headerStyle: styles.headerDark, // <- Header style
        width: 120 // <- width in pixels
      },
      effectif_2016: { // <- the key should match the actual data key
        displayName: 'Effectifs 2016', // <- Here you specify the column header
        // headerStyle: styles.headerDark, // <- Header style
        width: 120 // <- width in pixels
      },
      effectif_2017: { // <- the key should match the actual data key
        displayName: 'Effectifs 2017', // <- Here you specify the column header
        // headerStyle: styles.headerDark, // <- Header style
        width: 120 // <- width in pixels
      },
      fiche_identite: { // <- the key should match the actual data key
        displayName: 'fiche_identite', // <- Here you specify the column header
        // headerStyle: styles.headerDark, // <- Header style
        width: 120 // <- width in pixels
      },
      google: { // <- the key should match the actual data key
        displayName: 'Trouver sur Google', // <- Here you specify the column header
        // headerStyle: styles.headerDark, // <- Header style
        width: 120 // <- width in pixels
      },
      linkedin: { // <- the key should match the actual data key
        displayName: 'Trouver sur LinkedIn', // <- Here you specify the column header
        // headerStyle: styles.headerDark, // <- Header style
        width: 120 // <- width in pixels
      },
      twitter: { // <- the key should match the actual data key
        displayName: 'Trouver sur Twitter', // <- Here you specify the column header
        // headerStyle: styles.headerDark, // <- Header style
        width: 120 // <- width in pixels
      },
    }
    
    const report = excel.buildExport(
      [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
        {
          name: 'Report', // <- Specify sheet name (optional)
          heading: heading, // <- Raw heading array (optional)
          // merges: merges, // <- Merge cell ranges
          specification: specification, // <- Report specification
          data: dataset // <-- Report data
        }
      ]
    );
     
    // You can then return this straight
    res.attachment('ironleads-exports.xlsx'); // This is sails.js specific (in general you need to set headers)
    return res.send(report);
  }
  
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