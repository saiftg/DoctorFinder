var config = {

	
	db: {
		host: '127.0.0.1',
		user: 'doc',
		password: 'doc',
		database: 'best_doctor'
	},

	sessionSalt: "Falcons",

	insurance_ID: {

		Cigna: "cigna-cignahmo",
		Aetna: "aetna-aetnabasichmo",
		BlueCross: "bluecrossblueshieldofgeorgia-bcbsgabluechoicehmo",
		IBC_Amerihealth: "ibcamerihealth-amerihealthregionalprefntwkhmohmoposhix",
		Healthnet: "healthnet-healthnetcommunitycarenetworkhmohix",
		United_Healthcare: "unitedhealthcare-uhcnavigatehmo",
		Coventry: "coventryhealthcare-coventryonehmo",
		Humana: "humana-humanaatlantahmoxhix",
		Medicaid: "medicaid-medicaid",
		Medicare: "medicare-medicare"

	},

	specialtyID: {
		Addiction: "addiction-specialist, addiction-counselor, addiction-psychologist",
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





module.exports = config;