console.log('loading geocode module')
const request_module = require('request');
var geocodeAddress = (address) => {
    console.log("loading geocode function")
    var encodedAdress = encodeURIComponent(address);
    return new Promise((resolve, reject) => {
    request_module({url:`https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAdress}&key=AIzaSyA_zD_fPC14o3CS4qJNDDjTfJg34TpFuUs`, 
        json: true}, (error, response, body) => {
        if (error){//if error object exists - usually something with connection
            reject('unable to connect to google services')
        }else if(body.status === 'ZERO_RESULTS'){
            reject('unable to find this')
        }else if(body.status === 'OK'){
            resolve({//argument JSON- results, that's returned on success
                address: body.results[0].formatted_address,
                latitude: body.results[0].geometry.location.lat,
                longitute: body.results[0].geometry.location.lng
                })
            }
        });
    });
};
module.exports.geocodeAddress = geocodeAddress;



