import React, { Component } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import {
	Button,
	Collapse,
	Container,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	NavLink,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
} from "reactstrap";
import "@fortawesome/fontawesome-free/css/all.css";
import { Icon } from "./Logo.js";

function UserAvatar(props) {
	// If a user avatar is available, return an img tag with the pic
	if (props.user.avatar) {
		return (
			<img
				src={window.URL.createObjectURL(props.user.avatar)}
				alt="user"
				className="rounded-circle align-self-center mr-2"
				style={{ width: "32px" }}
			></img>
		);
	}

	// No avatar available, return a default icon
	return (
		<i
			className="far fa-user-circle fa-lg rounded-circle align-self-center mr-2"
			style={{ width: "32px" }}
		></i>
	);
}

function AuthNavItem(props) {
	// If authenticated, return a dropdown with the user's info and a
	// sign out button
	if (props.isAuthenticated) {
		return (
			<UncontrolledDropdown>
				<DropdownToggle nav caret>
					<UserAvatar user={props.user} />
				</DropdownToggle>
				<DropdownMenu right>
					<h5 className="dropdown-item-text mb-0">
						{props.user.displayName}
					</h5>
					<p className="dropdown-item-text text-muted mb-0">
						{props.user.email}
					</p>
					<DropdownItem divider />
					<DropdownItem onClick={props.authButtonMethod}>
						Déconnexion
					</DropdownItem>
				</DropdownMenu>
			</UncontrolledDropdown>
		);
	}

	// Not authenticated, return a sign in link
	return (
		<NavItem>
			<Button
				onClick={props.authButtonMethod}
				className="btn-link nav-link border-0"
				color="link"
			>
				Connexion
			</Button>
		</NavItem>
	);
}

export default class NavBar extends Component {
	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			isOpen: false,
		};
	}

	toggle() {
		this.setState({
			isOpen: !this.state.isOpen,
		});
	}

	render() {
		// Only show calendar nav item if logged in
		let calendarLink = null;
		let filmsLink = null;
		let fdcLink = null;
		if (this.props.isAuthenticated) {
			calendarLink = (
				<NavItem>
					<RouterNavLink to="/calendar" className="nav-link" exact>
						Calendrier
					</RouterNavLink>
				</NavItem>
			);
			filmsLink = (
				<NavItem>
					<RouterNavLink to="/films" className="nav-link" exact>
						Films
					</RouterNavLink>
				</NavItem>
			);
			fdcLink = (
				<NavItem>
					<RouterNavLink to="/fdc" className="nav-link" exact>
						Fonds de caisses
					</RouterNavLink>
				</NavItem>
			);
		}

		return (
			<div>
				<Navbar color="dark" dark expand="md" fixed="top">
					<Container>
						<RouterNavLink to="/" exact>
							<NavbarBrand href="/">
								<Icon />
							</NavbarBrand>
						</RouterNavLink>
						<NavbarToggler onClick={this.toggle} />
						<Collapse isOpen={this.state.isOpen} navbar>
							<Nav className="mr-auto" navbar>
								{calendarLink}
								{filmsLink}
								{fdcLink}
							</Nav>
							<Nav className="justify-content-end" navbar>
								<NavItem>
									<NavLink
										href="https://developer.microsoft.com/graph/docs/concepts/overview"
										target="_blank"
									>
										<i className="fas fa-external-link-alt mr-1"></i>
										Docs
									</NavLink>
								</NavItem>
								<AuthNavItem
									isAuthenticated={this.props.isAuthenticated}
									authButtonMethod={
										this.props.authButtonMethod
									}
									user={this.props.user}
								/>
							</Nav>
						</Collapse>
					</Container>
				</Navbar>
			</div>
		);
	}
}
