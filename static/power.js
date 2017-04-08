class Power{

  constructor(location, providerName, genMix, providerLink) {
	console.log("Power created");    
	this.location = location;
    this.providerName = providerName;

    this.genMix = genMix;
    this.percGenMix = {};
    var total = 0;
	console.log(this.genMix);
    for (let key in this.genMix) {
      total += this.genMix[key];
	}
    for (let key in this.genMix) {
      this.percGenMix[key] = this.genMix[key]/total;
	}

    this.providerLink = providerLink;
  }

  get percentages() {
    return this.percGenMix;
  }


  


}
