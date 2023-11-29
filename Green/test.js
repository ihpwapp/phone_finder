fetch("../phoneSpec.json")
  .then(response => response.json())
  .then(result => {
    //console.log(result)//dapatkan output json
    //console.log(result.Samsung)//dapatkan output untuk samsung file
    //console.log(result.Samsung[0])//dapatkan output untuk samsung file
    result.Samsung.forEach(item=> {
      //console.log(item.model)
      //console.log(item) // dapatkan semua jenis model yang ad
      if(item.model == "Galaxy Z Fold 5"){ //kalau nk check terus sbijik
        console.log(item)
      }
      if (item.model.includes("S22")) { // kalau nk cari yg ad perkataan sama
        console.log(item);
      }
    })
  })
  .catch(error => console.log('error', error));
