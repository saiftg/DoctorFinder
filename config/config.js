var config = {

	
	db: {
		host: '127.0.0.1',
		user: 'doc',
		password: 'doc',
		database: 'best_doctor'
	},

	sessionSalt: "Falcons",

	insurance_ID: {

		Cigna: "cigna-cignaopenaccessplus,cignadental-cignatotaldppo",
		Aetna: "aetna-aetnachoiceposii,aetna-aetnadppo",
		BlueCross: "bcbsbluecard-bcbsbluecardppo,bluecrossblueshieldofgeorgia-bcbsgadentalcomplete",
		Multiplan: "multiplan-multiplanppo",
		Anthem: "anthem-anthemblueopenaccesspos",
		United_Healthcare: "unitedhealthcare-uhcchoicepluspos,unitedhealthcaredental-unitedhealthcaredentalppo,unitedhealthcare-uhcoptionsppo",
		Coventry: "firsthealthcoventryhealthcare-firsthealthppo",
		Humana: "humana-humanachoicecarenetworkppo",
		Medicaid: "medicaid-medicaid",
		Medicare: "medicare-medicare"
	},

	specialtyID: {
		Addiction: "addiction-specialist,addiction-counselor,addiction-psychologist",
       	Dermatologist: "dermatologist",
       	Gastroenterologist: "gastroenterologist",
		OBGYN: "obstetrics-gynecologist",
        Cardiologist: "cardiologist",
        Neurologist: "neurologist",
        Optometrist: "optometrist",
        Orthodontist: "orthodontist",
        Pediatrician: "pediatrician",
        Psychologist: "psycologist",
        Psychiatrist: "psychiatrist"
	}

};

var docs = [];



module.exports = config;