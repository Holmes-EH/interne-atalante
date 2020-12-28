import React, { Component } from "react";
import axios from "axios";

import { Calendar, momentLocalizer } from "react-big-calendar";

import moment from "moment";
import "moment/locale/fr";

import "react-big-calendar/lib/css/react-big-calendar.css";

import Loader from "./Loader";

const localizer = momentLocalizer(moment);

export class MyCalendar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			events: [],
			eventCategory: "",
			loading: true,
			message: "",
		};
	}

	componentDidMount() {
		this.cancelTokenSource = axios.CancelToken.source();
		this.fetchEvents();
	}
	componentWillUnmount() {
		this.cancelTokenSource.cancel();
	}
	render() {
		const resourceMap = [
			{ resourceId: "1", resourceTitle: "Salle 1" },
			{ resourceId: "2", resourceTitle: "Salle 2" },
			{ resourceId: "3", resourceTitle: "Salle 3" },
			{ resourceId: "4", resourceTitle: "Taverne" },
		];
		const messages = {
			allDay: "Journée",
			previous: "Précédent",
			next: "Suivant",
			today: "Aujourd'hui",
			month: "Mois",
			week: "Semaine",
			day: "Jour",
			agenda: "Agenda",
			date: "Date",
			time: "Heure",
			event: "Événement", // Or anything you want
			showMore: (total) => `+ ${total} événement(s) supplémentaire(s)`,
		};
		const minTime = new Date();
		minTime.setHours(8, 30, 0);
		return (
			<div>
				<h1>Calendrier</h1>
				{this.state.loading ? (
					<Loader className="loading" />
				) : (
					<Calendar
						localizer={localizer}
						culture="fr"
						messages={messages}
						defaultDate={new Date()}
						resources={resourceMap}
						resourceIdAccessor="resourceId"
						resourceTitleAccessor="resourceTitle"
						defaultView="month"
						events={this.state.events}
						min={minTime}
						style={{ height: "calc(100vh - 120px)" }}
					/>
				)}
			</div>
		);
	}

	fetchEvents(category = "") {
		axios
			.get(
				"https://interne-atalante.local/api/scolaires/",
				{
					headers: {
						Authorization: `Bearer ${this.props.idToken}`,
					},
					crossdomain: true,
				},
				{
					cancelToken: this.cancelTokenSource.token,
				}
			)
			.then((res) => {
				let events = Object.values(res.data);

				for (let i = 0; i < events.length; i++) {
					events[i].start = moment.utc(events[i].start).toDate();
					events[i].end = moment.utc(events[i].end).toDate();
				}

				this.setState({
					events: Object.values(res.data),
					loading: false,
				});
			})
			.catch((error) => {
				if (axios.isCancel(error) || error) {
					this.setState({
						loading: false,
						message: "Requête échouée. Verifier votre connection ?",
					});
				}
			});
	}
}

export default MyCalendar;
