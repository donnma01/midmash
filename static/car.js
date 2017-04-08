class Car{

  constructor(make, model, year, fuelType, mpg) {
    this.make = make;
    this.model = model;
    this.year = year;
    this.fuelType = fuelType;
    this.mpg = mpg;
    this.energyRatios = {};
  }

  getConsumption(miles, percentages) {
	// Returns energy mix in kWh for each type of energy used by the car for the distance travelled, using EPA Combined MPGe
	var numGallons = miles/this.mpg;
    var kWh = 33.7 * numGallons; // 33.7 kWh per gallon of gasoline (from the MPGe of the electric car), according to the EPA
    for(let key in percentages) {
      this.energyRatios[key] = kWh/percentages[key];
    }
    return this.energyRatios;
  }



}
