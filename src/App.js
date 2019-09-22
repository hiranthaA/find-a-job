import React, { Component } from 'react';

import './App.css';
import Display from './components/Display';
import axios from 'axios';

class App extends Component {

  constructor(props) {
    super(props);
    this.requestAuth = this.requestAuth.bind(this);

    this.state = {
      urlparams : null,
      redirect_uri : null,
      accessToken : null
    }
  }

  UNSAFE_componentWillMount(){
    var pathname = window.location.pathname;
    console.log(pathname);
    var params = this.getAllUrlParams();
    console.log(params);
    this.setState({urlparams : params});
    if(pathname==="/auth/linkedin/callback"){
      console.log("authcode recieved");
      var redirecturi=window.location.protocol+'//' + window.location.hostname  +":"+window.location.port+"/auth/linkedin/callback";
      this.requestToken(params.code,redirecturi);
    }
  }

  getAllUrlParams(url) {
	
		// get query string from url (optional) or window
		var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
	  
		// we'll store the parameters here
		var obj = {};
	  
		// if query string exists
		if (queryString) {
	  
		  // stuff after # is not part of query string, so get rid of it
		  queryString = queryString.split('#')[0];
	  
		  // split our query string into its component parts
		  var arr = queryString.split('&');
	  
		  for (var i = 0; i < arr.length; i++) {
			// separate the keys and the values
			var a = arr[i].split('=');
	  
			// set parameter name and value (use 'true' if empty)
			var paramName = a[0];
			var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
	  
			// (optional) keep case consistent
			// paramName = paramName.toLowerCase();
			// if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();
	  
			// if the paramName ends with square brackets, e.g. colors[] or colors[2]
			if (paramName.match(/\[(\d+)?\]$/)) {
	  
			  // create key if it doesn't exist
			  var key = paramName.replace(/\[(\d+)?\]/, '');
			  if (!obj[key]) obj[key] = [];
	  
			  // if it's an indexed array e.g. colors[2]
			  if (paramName.match(/\[\d+\]$/)) {
				// get the index value and add the entry at the appropriate position
				var index = /\[(\d+)\]/.exec(paramName)[1];
				obj[key][index] = paramValue;
			  } else {
				// otherwise add the value to the end of the array
				obj[key].push(paramValue);
			  }
			} else {
			  // we're dealing with a string
			  if (!obj[paramName]) {
				// if it doesn't exist, create property
				obj[paramName] = paramValue;
			  } else if (obj[paramName] && typeof obj[paramName] === 'string'){
				// if property does exist and it's a string, convert it to an array
				obj[paramName] = [obj[paramName]];
				obj[paramName].push(paramValue);
			  } else {
				// otherwise add the property
				obj[paramName].push(paramValue);
			  }
			}
		  }
		}
	  
		return obj;
	}

  requestAuth(){
    var redirecturi=window.location.protocol+'//' + window.location.hostname  +":"+window.location.port+"/auth/linkedin/callback";
    this.setState({redirect_uri:redirecturi});
    var url = "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=81uv5q50q6h4va&redirect_uri="+redirecturi+"&state=uniquestring&scope=r_liteprofile%20r_emailaddress";
    window.open(url,"_self");
  }

  requestToken(authcode,redirecturi){
    console.log("req token clicked");
    console.log(authcode);

    var url = "http://localhost:8080/https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code="+authcode+"&redirect_uri="+redirecturi+"&client_id=81uv5q50q6h4va&client_secret=peuX5PsUcpv3nFYJ";
    // axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    var headers = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    }

    axios.post(url,headers).then(function (response) {
            console.log(response);
            this.setState({htmlres:response.data});
            return response.data;
        }.bind(this)).then(function (data) {
            console.log(data);
            this.setState({accessToken : data.access_token});

        }.bind(this));
  }

  render() {

    var right_content;

    if(this.state.accessToken!==null){
      right_content = <Display token={this.state.accessToken}/>
    }

    return (
      <div className="App">
        <div className="Container">
          <div className="row">
              <div className="intro col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <header className="App-header">
                    <h1>Upload your CV. We will get you a job.</h1>
                    <p>
                    Edit <code>src/App.js</code> and save to reload.
                    </p>
                    <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    Learn React
                    </a>
                    
                    <img src="./Sign-In-Large---Active.png" className="App-logo" alt="logo" onClick={this.requestAuth}/>
                </header>
              </div>
              <div className="content col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                {right_content}
              </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
