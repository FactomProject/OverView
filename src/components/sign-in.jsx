import React, { Component } from "react";
import "../App.css";
import $ from "jquery";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedin: false
    };
    this.attachSignin = this.attachSignin.bind(this);
  }

  componentDidMount() {
    let that = this;
    setTimeout(() => {
      window.gapi.load("auth2", function() {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        window.auth2 = window.gapi.auth2
          .init({
            client_id:
              "753755309703-ug17h86nua76iv1go5kgcl2eqimo1q79.apps.googleusercontent.com",
            cookiepolicy: "single_host_origin",
            hosted_domain: "factom.com"
            // Request scopes in addition to 'profile' and 'email'
            //scope: 'additional_scope'
          })
          .then(
            function() {
              window.GoogleAuth = window.gapi.auth2.getAuthInstance();
              console.log("window.GoogleAuth", window.GoogleAuth);

              that.updateSigninStatus();
              window.GoogleAuth.isSignedIn.listen(that.updateSigninStatus);

              that.setSigninStatus(window.GoogleAuth.isSignedIn.get());

              $("#sign-in-or-out-button").click(function() {
                that.handleAuthClick();
              });
            },
            err => {
              console.log("ERROR MY BOI ", err);
            }
          );
      });
    }, 50);
  }

  handleAuthClick = () => {
    if (window.GoogleAuth.isSignedIn.get()) {
      // User is authorized and has clicked 'Sign out' button.
      window.GoogleAuth.signOut();
      window.GoogleAuth.disconnect();
      console.log("line before call");
    } else {
      // User is not signed in. Start Google auth flow.
      window.GoogleAuth.signIn().catch(err => {
        if (err) {
          //   $('.alert').show()
          $(".myAlert-top").show();
          $(".myAlert-top").html(
            `${
              err.error === undefined
                ? err.reason.substring(0, err.reason.length - 30)
                : err.error
            }`
          );
          setTimeout(() => {
            $(".myAlert-top").hide("slow");
          }, 2500);
        }
      });
    }
  };

  setSigninStatus = isSignedIn => {
    let user = window.GoogleAuth.currentUser.get();
    if (window.GoogleAuth.isSignedIn.get()) {
      $("#sign-in-or-out-button").html("Sign out");
      $("#revoke-access-button").css("display", "inline-block");
      $("#auth-status").html(`Hello, ${user.w3.ig}`);
      this.render();
    } else {
      $("#sign-in-or-out-button").html("Sign In/Authorize");
      $("#revoke-access-button").css("display", "none");
      $("#auth-status").html(``);
    }
  };

  updateSigninStatus = isSignedIn => {
    this.setSigninStatus();
    this.props.isSignedIn(window.GoogleAuth);
  };

  startApp = function() {
    let that = this;
    window.gapi.load("auth2", function() {
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      window.auth2 = window.gapi.auth2.init({
        client_id:
          "753755309703-ug17h86nua76iv1go5kgcl2eqimo1q79.apps.googleusercontent.com",
        cookiepolicy: "single_host_origin",
        hosted_domain: "factom.com"
        // Request scopes in addition to 'profile' and 'email'
        //scope: 'additional_scope'
      });
      that.setState({
        signedin: window.auth2.isSignedIn.get()
      });

      that.attachSignin(document.getElementById("customBtn"));
    });
  };

  signinChanged = val => {
    console.log("Signin state changed to ", val);
    document.getElementById("name").innerText = val;
  };

  attachSignin = element => {
    console.log(element);
    window.auth2.attachClickHandler(
      element,
      {},
      function(googleUser) {
        console.log(googleUser);
        document.getElementById("name").innerText =
          "Signed in: " + googleUser.getBasicProfile().getName();
      },
      function(error) {
        alert(JSON.stringify(error, undefined, 2));
      }
    );
  };

  signOut = () => {
    var auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
      console.log("User signed out.");
    });
    this.setState({
      signedin: false
    });
  };

  render() {
    return (
      <div className="form-inline my-2 my-lg-0">
        <div
          id="auth-status"
          style={{ display: "inline", paddingLeft: "4em" }}
        />
        <button
          id="sign-in-or-out-button"
          className="btn btn-outline-primary"
          style={{ display: "inline", marginLeft: "25px" }}
        >
          Sign In/Authorize
        </button>

        <div
          className="myAlert-top alert alert-danger"
          style={{ position: "fixed", top: "4%", display: "none", zIndex: 100 }}
        >
          <a className="close" data-dismiss="alert" aria-label="close">
            &times;
          </a>
          <strong>Error</strong>
        </div>

        <div
          className="myAlert-top alert alert-warning"
          style={{ position: "fixed", top: "4%", display: "none", zIndex: 100 }}
        >
          <a className="close" data-dismiss="alert" aria-label="close">
            &times;
          </a>
          <strong>Error</strong>
        </div>
      </div>
    );
  }
}

export default SignIn;
