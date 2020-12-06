import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Container } from "reactstrap";
import { UserAgentApplication } from "msal";
import NavBar from "./NavBar";
import config from "./Config";
import ErrorMessage from "./ErrorMessage";
import Welcome from "./Welcome";
import { getUserDetails } from "./GraphService";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

export class App extends Component {
	constructor(props) {
		super(props);

		this.userAgentApplication = new UserAgentApplication({
			auth: {
				clientId: config.appId,
				authority:
					"https://login.microsoftonline.com/07659e2d-ac47-4a47-afc6-6a839e61ab80",
				redirectUri: "http://localhost:3000",
			},
			cache: {
				cacheLocation: "localStorage",
				storeAuthStateInCookie: true,
			},
		});

		var user = this.userAgentApplication.getAccount();

		this.state = {
			isAuthenticated: false,
			user: {},
			error: null,
		};
	}

	render() {
		let error = null;
		if (this.state.error) {
			error = (
				<ErrorMessage
					message={this.state.error.message}
					debug={this.state.error.debug}
				/>
			);
		}
		return (
			<Router>
				<div>
					<NavBar
						isAuthenticated={this.state.isAuthenticated}
						authButtonMethod={
							this.state.isAuthenticated
								? this.logout.bind(this)
								: this.login.bind(this)
						}
						user={this.state.user}
					/>
					<Container>
						{error}
						<Route
							exact
							path="/"
							render={(props) => (
								<Welcome
									{...props}
									isAuthenticated={this.state.isAuthenticated}
									user={this.state.user}
									authButtonMethod={this.login.bind(this)}
								/>
							)}
						/>
					</Container>
				</div>
			</Router>
		);
	}

	setErrorMessage(message, debug) {
		this.setState({
			error: (message, debug),
		});
	}

	async login() {
		try {
			await this.userAgentApplication.loginPopup({
				scopes: config.scopes,
				prompt: "select_account",
			});
			await this.getUserProfile();
		} catch (err) {
			this.setState({
				isAuthenticated: false,
				user: {},
				error: err,
			});
		}
	}

	logout() {
		this.userAgentApplication.logout();
	}

	async getAccessToken(scopes) {
		try {
			const accounts = this.userAgentApplication.getAllAccounts();

			if (accounts.length <= 0) throw new Error("login_required");
			// Get the access token silently
			// If the cache contains a non-expired token, this function
			// will just return the cached token. Otherwise, it will
			// make a request to the Azure OAuth endpoint to get a token
			var silentResult = await this.userAgentApplication.acquireTokenSilent(
				{
					scopes: config.scopes,
				}
			);

			return silentResult.accessToken;
		} catch (err) {
			// If a silent request fails, it may be because the user needs
			// to login or grant consent to one or more of the requested scopes
			if (this.isInteractionRequired(err)) {
				var interactiveResult = await this.userAgentApplication.acquireTokenPopup(
					{
						scopes: config.scopes,
					}
				);

				return interactiveResult.accessToken;
			} else {
				throw err;
			}
		}
	}

	async getUserProfile() {
		try {
			var accessToken = await this.getAccessToken(config.scopes);

			if (accessToken) {
				// Get the user's profile from Graph
				var user = await getUserDetails(accessToken);
				this.setState({
					isAuthenticated: true,
					user: {
						displayName: user.displayName,
						email: user.mail || user.userPrincipalName,
					},
					error: null,
				});
			}
		} catch (err) {
			this.setState({
				isAuthenticated: false,
				user: {},
				error: err,
			});
		}
	}

	normalizeError(error) {
		var normalizedError = {};
		if (typeof error === "string") {
			var errParts = error.split("|");
			normalizedError =
				errParts.length > 1
					? { message: errParts[1], debug: errParts[0] }
					: { message: error };
		} else {
			normalizedError = {
				message: error.message,
				debug: JSON.stringify(error),
			};
		}
		return normalizedError;
	}

	isInteractionRequired(error) {
		if (!error.message || error.message.length <= 0) {
			return false;
		}

		return (
			error.message.indexOf("consent_required") > -1 ||
			error.message.indexOf("interaction_required") > -1 ||
			error.message.indexOf("login_required") > -1 ||
			error.message.indexOf("no_account_in_silent_request") > -1
		);
	}
}

export default App;
