import React, { Component } from 'react';
import axios from 'axios';

class Display extends Component {

    constructor(props) {
      super(props);
      this.state = {

      }
    }
    
    render() {
        return (
            <div className="display-content">
                <br/>
                <br/>
                <div class="card profile-pic-card ">
                    <img class="card-img-top" src={this.props.info.profilePicture["displayImage~"].elements[2].identifiers[0].identifier} alt="Card image"/>
                    <div class="card-body">
                    <h4 class="card-title">{this.props.info.firstName.localized.en_US} {this.props.info.lastName.localized.en_US}</h4>
                    <p class="card-text">Email : {this.props.email}</p>
                    </div>
                </div>

            </div>
        );
    }

}

export default Display;

