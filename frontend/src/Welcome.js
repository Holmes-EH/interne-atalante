import React, { Component, Fragment } from "react";
import { Button, Jumbotron } from "reactstrap";

function WelcomeContent(props) {
	// If authenticated, greet the user
	if (props.isAuthenticated) {
		return (
			<div>
				<h4>Bonjour {props.user.displayName}</h4>
			</div>
		);
	}

	// Not authenticated, present a sign in button
	return (
		<Fragment>
			<p>Connectez-vous avec vos identifiants</p>
			<p>Office 365 - Cinéma l'Atalante</p>
			<Button color="primary" onClick={props.authButtonMethod}>
				Cliquez ici
			</Button>
		</Fragment>
	);
}

export default class Welcome extends Component {
	render() {
		return (
			<Jumbotron>
				<h1>Atalante - Interne</h1>
				<WelcomeContent
					isAuthenticated={this.props.isAuthenticated}
					user={this.props.user}
					authButtonMethod={this.props.authButtonMethod}
				/>
			</Jumbotron>
		);
	}
}
