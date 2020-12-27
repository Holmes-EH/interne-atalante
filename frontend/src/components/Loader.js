import React, { Component } from "react";
import "./Loader.css";

export class Loader extends Component {
	render() {
		return (
			<div className="loader">
				<div className="screen screen1"></div>
				<div className="screen screen2"></div>
				<div className="screen screen3"></div>
				<div className="loadingText">Chargement en cours ...</div>
			</div>
		);
	}
}

export default Loader;
