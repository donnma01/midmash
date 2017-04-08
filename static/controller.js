class Controller{

  constructor(){
    this.car = null;
    this.power = null;
	this.numMiles = null;
	this.consumption = null;
	this.carMake;
	this.carModel;
	this.carYear;
  }

	getCarInfo(){
		this.car = null;
		this.carMake = document.getElementById("inputmake").value;
		this.carModel = document.getElementById("inputmodel").value;
		this.carYear = document.getElementById("inputyear").value;
		this.numMiles = document.getElementById("inputmiles").value;

                
                let waitfor = this.carCall(this.carMake, this.carModel, this.carYear);
		//let dfd1 = new $.Deferred();
		let self = this;
                waitfor.done(function(){
                  if(self.car == null){
		    document.getElementById("inputmake").value = "";
		    document.getElementById("inputmodel").value = "";
		    document.getElementById("inputyear").value = "";
		    document.getElementById("inputmiles").value = "";
                  }
                  else{
		    var carInputNode = document.getElementById("carinner");
		    while (carInputNode.firstChild) {
		    	  carInputNode.removeChild(carInputNode.firstChild);
		    }
		    var car = document.createElement("DIV");
		    car.id = "car";
		    car.setAttribute("alt", "car img");
		    carInputNode.appendChild(car);
		    var carDesc = document.createElement("DIV");
		    carDesc.id = "cardesc";
		    carDesc.innerHTML = "<h2>"+self.carMake+" "+self.carModel+" "+self.carYear+"</h2><h3>"+self.numMiles+" miles</h3>";
		    document.getElementById("inputsection").appendChild(providerInputBox);
		    providerInputBox.id = "providerinputbox";
		    providerInputBox.visibility = "visible";
		    providerInputBox.className = "inputbox";
		    document.getElementById("provbutton").addEventListener("click", function() {
		    	carcontroller.getProviderInfo();
		    });
		  providerInputBox.style.width = "0px";
		  document.getElementById("inputsection").appendChild(providerInputBox);
		  setTimeout(function(){ providerInputBox.style.width = "300px"; }, 1);
		  
		  carInputNode.appendChild(carDesc);
                 }
               });

	}

	getProviderInfo() {
		var userLocation = document.getElementById("location").value;
                let waitfor = this.energyCall(userLocation);
		//let dfd2 = new $.Deferred();
		let self = this;
		waitfor.done(function(){
                  if(self.power == null){
		    document.getElementById("providerinputbox").value = "";                    
                  }
                  else{
		    self.initiateCarAnimation();
                  }
                });
	}

        carCall(make, model, year){
          let self = this;
          let dfd = new $.Deferred();
          $.ajax({
		  url: "http://localhost:5000/api/carandpowerinfo?" + make + "/" + model + "/" + year +"/styles?fmt=json&api_key=", //other keys:   538cs4nrsavz7afz94ru3fm5 99bgw7sk973nr4n6ug7hm8zk tb2smpfhgeayg63vx2ejcp9f
		  method: "GET"
		}).done(function(data){
		  try {
		      let unstringified = JSON.parse(data);
                      self.car = new Car(make, model, year, unstringified[1], unstringified[0]);
                      dfd.resolve();
		  }
		  catch (e) {
		     if(data == "Error"){
		         alert("Error! Make sure to correctly enter the electric car information. If it is correct, you have exceeded the Edmunds API key limit (the Edmunds API provides information about the car you entered). Please contact James Miller or Mason Donnohue for help.");
                        dfd.resolve();
                        return dfd;
		     } else if (data == "Error2"){
                         alert("According to our information, the car you entered does not seem to be fully electric. Please enter an electric car.");
                         dfd.resolve();
                         return dfd;
                     }
		  }

/*
                  if(data == "Error"){
                    alert("Error! Make sure you have correctly entered the car information. If so, you have exceeded the Edmunds API key limit (the Edmunds API provides information about the car you entered). Please contact James Miller or Mason Donnohue for help.");
                    dfd.resolve();
                    return dfd;
                  }
                  else if (data == "Error2"){
                    alert("Please enter an electric car.");
                    dfd.resolve();
                    return dfd;
                  }
                  else {
                    let unstringified = JSON.parse(data);
                    self.car = new Car(make, model, year, unstringified[1], unstringified[0]);
                    dfd.resolve();
                  }*/
          });
          return dfd;
        }

        energyCall(userlocation){
          alert("Loading...");
          let self = this;
          let dfd = new $.Deferred();
          $.ajax({
		  url: "http://localhost:5000/api/electricinfo?" + userlocation,
		  method: "GET"
		}).done(function(data){
                  if(data == "Error3"){
                    alert("Please enter a valid location.");
                    dfd.resolve();
                    return dfd;
                  }
                  else if(data == "Error4"){
                    alert("No balancing authority found for this location.");
                    dfd.resolve();
                    return dfd;
                  }
                  else{
		    var unstringified = JSON.parse(data);
		    self.power = new Power(userlocation, unstringified[0], unstringified[1], unstringified[2]);
		    self.consumption = self.car.getConsumption(self.numMiles, self.power.percentages);
		    dfd.resolve();
                  }
		});
          return dfd;

        }

	
	initiateCarAnimation() {
		// Shrink provider input box, stretch out the car box to initiate animation
		setTimeout(function(){
			providerInputBox.style.width = "0px";
			providerInputBox.style.borderWidth = "0px";
			providerInputBox.style.margin = "0px";
			providerInputBox.style.padding = "0px";
			document.getElementById("carinner").style.verticalAlign = "center";
			var carInputBox = document.getElementById("carinputbox");
			carInputBox.style.marginLeft = "50px";
			carInputBox.style.marginRight = "50px";
			carInputBox.style.width = (document.getElementById("header").offsetWidth - 60)+"px";
			carInputBox.style.textAlign = "initial";
			car.style.animation = "turnWheels 0.1s steps(2) infinite";
			car.style.WebkitAnimation = "turnWheels 0.1s steps(2) infinite";
			car.style.MozAnimation = "turnWheels 0.1s steps(2) infinite";
		}, 1);
		// Remove provider input box
		setTimeout(function(){document.getElementById("inputsection").removeChild(providerInputBox); }, 100);
		car.style.left = "0px";
		let carDesc = document.getElementById("cardesc");
		carDesc.parentNode.removeChild(carDesc);
		// Final output animation start
		let carWindowWidth = document.getElementById("header").offsetWidth - 60;
		let carInputNode = document.getElementById("carinner");
		let self = this;
		
		setTimeout(function(){
			carDesc.innerHTML = "<h2>If you were to drive a "+self.carYear+" "+self.carMake+" "+self.carModel+" for "+self.numMiles+" miles, here are the amounts (kWh) of energy coming from each energy source. These values are based off your regional balancing authority, which networks smaller providers together. Combined highway/city MPGe is used to calculate these values.</h2>";
			carDesc.style.lineHeight = "5px";
			carDesc.style.marginBottom = "60px";		
			carInputNode.insertBefore(carDesc, carInputNode.childNodes[0]);
		}, 500);
		setTimeout(function(){
			
			var wind = document.createElement("DIV");
			wind.id = "wind";
			wind.className = "energysource";
			wind.setAttribute("alt", "wind img");
			carInputNode.insertBefore(wind, carInputNode.childNodes[1]);
			let desc = document.createElement("SPAN");
			desc.innerHTML = "Wind: " + Math.round(self.consumption["wind"]);
			carInputNode.insertBefore(desc, carInputNode.childNodes[2]);
		}, 1000);
		setTimeout(function(){
			var coal = document.createElement("DIV");
			coal.id = "coal";
			coal.className = "energysource";
			coal.setAttribute("alt", "coal img");
			carInputNode.insertBefore(coal, carInputNode.childNodes[3]);
			let desc = document.createElement("SPAN");
			desc.innerHTML = "Coal: " + Math.round(self.consumption["coal"]);
			carInputNode.insertBefore(desc, carInputNode.childNodes[4]);
		}, 2000);
		setTimeout(function(){
			var nuclear = document.createElement("DIV");
			nuclear.id = "nuclear";
			nuclear.className = "energysource";
			nuclear.setAttribute("alt", "nuclear img");
			carInputNode.insertBefore(nuclear, carInputNode.childNodes[5]);
			let desc = document.createElement("SPAN");
			desc.innerHTML = "Nuclear: " + Math.round(self.consumption["nuclear"]);
			carInputNode.insertBefore(desc, carInputNode.childNodes[6]);
		}, 3000);
		setTimeout(function(){
			var natGas = document.createElement("DIV");
			natGas.id = "natgas";
			natGas.className = "energysource";
			natGas.setAttribute("alt", "nuclear img");
			carInputNode.insertBefore(natGas, carInputNode.childNodes[7]);
			let desc = document.createElement("SPAN");
			desc.innerHTML = "Natural Gas: " + Math.round(self.consumption["natgas"]);
			carInputNode.insertBefore(desc, carInputNode.childNodes[8]);
		}, 4000);
		setTimeout(function(){
			var other = document.createElement("DIV");
			other.addEventListener("click", function() {
				alert(self.consumption[3]);
			});
			other.id = "other";
			other.className = "energysource";
			other.setAttribute("alt", "other img");
			carInputNode.insertBefore(other, carInputNode.childNodes[9]);
			let desc = document.createElement("SPAN");
			desc.innerHTML = "Other: " + Math.round(self.consumption["other"]);
			carInputNode.insertBefore(desc, carInputNode.childNodes[10]);
		}, 5000);
		setTimeout(function(){
			let l = car.offsetLeft;
			let w = carInputNode.offsetWidth;
			let fw = w - l - 100;
			car.style.transform = "translateX("+fw+"px)";
		}, 6000);

		setTimeout(function(){
			
			car.style.animation = "turnWheels 0s steps(2)";
			car.style.WebkitAnimation = "turnWheels 0s steps(2)";
			car.style.MozAnimation = "turnWheels 0s steps(2)";
		}, 7200);

		//8,887 grams of CO2 /gallon of gasoline
	}
}

var carcontroller; 
var providerInputBox;

window.onload = function() {
	setTimeout(function(){ 
		document.documentElement.style.backgroundPosition = "left bottom"; 
		document.documentElement.style.boxShadow = "inset 0 0 800px black";
	}, 1);
	carcontroller = new Controller();
	providerInputBox = document.getElementById("providerinputbox");
 	document.getElementById("inputsection").removeChild(providerInputBox);
}


