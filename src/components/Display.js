import React, { Component } from 'react';
import axios from 'axios';

class Display extends Component {

    constructor(props) {
      super(props);
      console.log(props);
      this.state = {

      }
    }

    componentDidMount(){
        this.requestInfo(this.props.token);
    }

    requestInfo(token){
        console.log("req info clicked");
        console.log(token);
    
        var url = "http://localhost:8080/https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))";

        axios.get(url,{ headers: { Authorization: 'Bearer '+token } }).then(function (response) {
                console.log(response);
                return response.data;
            }.bind(this)).then(function (data) {
                console.log(data);
            }.bind(this));
    }
    
    render() {

        return (
            <div className="display-content">
                <p className="content-fonts-normal">Lets get started.</p>

            </div>
        );
    }

}

export default Display;

