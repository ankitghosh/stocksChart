const Apikey = 'BCTLGLEVTH6M2835';
const ApiRequest = function(symbol) {
	let url ='https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+symbol+'&apikey='+Apikey+'&outputsize=compact';
	// url += '&apikey='+Apikey;
	return new Promise((resolve, reject)=>{
		fetch(url)
		  	.then(
			    function(response) {
			      	if (response.status !== 200) {
			        	console.log('Looks like there was a problem. Status Code: ' +
			          		response.status);
			        	return;
			      	}
			      	response.json().then(function(data) {
			        	// console.log(data);
			        	if (data.Information) {
			        		reject('Api limit crossed');
			        	}
			        	resolve(data)
			      	});
			    }
		  	)
		  	.catch(function(err) {
		  		reject(err);
		    	console.log('Fetch Error :-S', err);
		  	});
		});
	
}

export default ApiRequest;