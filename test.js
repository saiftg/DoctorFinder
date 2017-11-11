const request = require('request');

request({
	url: 'https://api.betterdoctor.com/2016-03-01/doctors?insurance_uid=bluecrossblueshieldofgeorgia-bcbsgabluechoicehmo&location=37.773%2C-122.413%2C100&user_location=37.773%2C-122.413&skip=0&limit=10&user_key=b277ca758b6d6b1634f652b3010348e1',
	json: true
}, (error, response, body)=>{
	for(let i=0; i<=(body.data.length-1); i++){
		// for(let j=0; j<=(body.data.length-1); j++){
	var x =(body.data[i].specialties[0].name);
	var y =(body.data[i].profile.first_name);
	var z =(body.data[i].profile.last_name);
	
	var c =(body.data[i].npi); 

	var cigna = "cigna-cignahmo"

	for (let j=0; j <= (body.data[i].insurances.length-1); j++){
		if(body.data[i].insurances[j].insurance_plan.uid === cigna){
			var a =(body.data[i].insurances[j].insurance_plan.uid);
			var b =(body.data[i].insurances[j].insurance_provider.uid);


	console.log("NAME: " + " " + y + " " + z);
	console.log("NPI: " + " " + c);
	console.log("SPECIALTY: " + " " + x);
	// console.log(a + " " + b);
	console.log("INSURANCE ID: " + " " + a);
	console.log("INSURANCE PROVIDER: " + " " + b);
	console.log("*******************");

	}else{
		continue;
	};
};

};
// };
});


