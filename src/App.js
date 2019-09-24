import React, { Component } from 'react';

import './App.css';
import Display from './components/Display';
import axios from 'axios';
import { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } from 'constants';

class App extends Component {

  constructor(props) {
    super(props);
    this.requestAuth = this.requestAuth.bind(this);
    this.submitProfile = this.submitProfile.bind(this);
    this.goHome = this.goHome.bind(this);

    this.state = {
      urlparams : null,
      redirect_uri : null,
      home_url : null,
      accessToken : null,
      display : false,
      profileInfo : null,
      email : null,
      state : null
    }
  }

  UNSAFE_componentWillMount(){
    var pathname = window.location.pathname;
    var homeurl=window.location.protocol+'//' + window.location.hostname  +":"+window.location.port;
    this.setState({home_url:homeurl});
    var params = this.getAllUrlParams();
    this.setState({urlparams : params});
    if(pathname==="/auth/linkedin/callback"){
      var redirecturi=window.location.protocol+'//' + window.location.hostname  +":"+window.location.port+"/auth/linkedin/callback";
      this.requestToken(params.code,redirecturi);
    }
  }

  requestAuth(){
    var redirecturi=window.location.protocol+'//' + window.location.hostname  +":"+window.location.port+"/auth/linkedin/callback";
    this.setState({redirect_uri:redirecturi});
    var url = "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=81uv5q50q6h4va&redirect_uri="+redirecturi+"&state=uniquestring&scope=r_liteprofile%20r_emailaddress";
    window.open(url,"_self");
  }

  requestToken(authcode,redirecturi){
    this.setState({submitStatus:"loading"});

    var url = "http://localhost:2000/https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code="+authcode+"&redirect_uri="+redirecturi+"&client_id=81uv5q50q6h4va&client_secret=peuX5PsUcpv3nFYJ";

    var headers = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    }

    axios.post(url,headers).then(function (response) {
            console.log(response);
            return response.data;
        }.bind(this)).then(function (data) {
            console.log(data);
            this.requestInfo(data.access_token);
            this.requestEmail(data.access_token);

        }.bind(this));
  }

  requestInfo(token){

    var url = "http://localhost:2000/https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))";

    axios.get(url,{ headers: { Authorization: 'Bearer '+token } }).then(function (response) {

            return response.data;
        }.bind(this)).then(function (data) {
            this.setState({display : true,profileInfo:data});
            this.setState({submitStatus : "loaded"});
        }.bind(this));
  }

  requestEmail(token){

    var url = "http://localhost:2000/https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))";

    axios.get(url,{ headers: { Authorization: 'Bearer '+token } }).then(function (response) {
            return response.data;
        }.bind(this)).then(function (data) {
            this.setState({email:data.elements[0]["handle~"].emailAddress});
        }.bind(this));
  }

  getAllUrlParams(url) {
	
		var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
		var obj = {};
		if (queryString) {
		  queryString = queryString.split('#')[0];
		  var arr = queryString.split('&');
	  
		  for (var i = 0; i < arr.length; i++) {
			var a = arr[i].split('=');
			var paramName = a[0];
			var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

			if (paramName.match(/\[(\d+)?\]$/)) {
			  var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];
			  if (paramName.match(/\[\d+\]$/)) {
				  var index = /\[(\d+)\]/.exec(paramName)[1];
				  obj[key][index] = paramValue;
        } 
        else {
				  obj[key].push(paramValue);
			  }
			} else {
			  if (!obj[paramName]) {
				  obj[paramName] = paramValue;
			  } else if (obj[paramName] && typeof obj[paramName] === 'string'){
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
			  } else {
				  obj[paramName].push(paramValue);
			  }
			}
		  }
		}
	  
		return obj;
	}

  submitProfile(){
    this.setState({submitStatus:"submitted"});
  }

  goHome(){
    window.open(this.state.home_url,"_self");
  }

  render() {

    var right_content;
    var left_content;

    right_content = <div className="App-header "> 
      <img  className="home-img" src="./findajob.png" alt="logo"/>
    </div>

    if(this.state.display){
      right_content = <Display info={this.state.profileInfo} email={this.state.email}/>
      left_content = <div className="App-header">
          <h1>Hello {this.state.profileInfo.firstName.localized.en_US},</h1>
          <p className="padding-10-left">One more step to go. Confirm your submission by clicking on submit profile.</p>
          <a href="#" class="btn btn-primary" onClick={this.submitProfile}>Submit Profile</a>
      </div>
    }else{
      left_content = <div className="App-header">
        <h1>Submit your Linkedin account. We will get you a job.</h1>
        <p className="App-link">
        Simple as that!
        </p>
        
        <br/>
        <img src="./Sign-In-Large---Active.png" className="App-logo" alt="logo" onClick={this.requestAuth}/>
      </div>
    }

    if(this.state.submitStatus==="submitted"){
      left_content = <div>
        <h1>Profile submitted. We will contact you soon.</h1>
        <br/>
        <a href="#" class="btn btn-secondary" onClick={this.goHome}>Go Home</a>
      </div>
    }
    else if(this.state.submitStatus==="loading"){
      left_content = <div>
        <div class="spinner-border text-danger" role="status">
          <span class="sr-only">Loading...</span>
        </div>
        <br/>
        <br/>
        <a href="#" class="btn btn-secondary" onClick={this.goHome}>Cancel</a>
      </div>
      right_content = ""
    }

    return (
      <div className="App">
        <div className="Container">
          <div className="row">
              <div className="intro col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <header className="App-header">
                    {left_content}
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
