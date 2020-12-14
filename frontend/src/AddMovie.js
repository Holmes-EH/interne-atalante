import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Row, Col, Button } from "reactstrap";

export class AddMovie extends Component {
	constructor(props) {
		super(props);
		this.state = {
			query: "",
			results: {},
			loading: false,
			message: "",
			mediaUrl: "",
		};
		this.cancel = "";

		this.renderSearchResults = this.renderSearchResults.bind(this);
	}
	componentDidMount() {
		axios
			.get(
				"https://api.themoviedb.org/3/configuration?api_key=a1fbd782378df018ba5377e9eeb5418a"
			)
			.then((res) => {
				const mediaUrl =
					res.data.images.secure_base_url +
					res.data.images.poster_sizes[1];
				this.setState({
					mediaUrl,
				});
			});
	}
	handleInputChange = (e) => {
		const query = e.target.value.replace(/ /g, "+");
		if (!query) {
			this.setState({ query, results: {}, message: "" });
		} else {
			this.setState({ query, loading: true, message: "" }, () => {
				this.callTmdb(query);
			});
		}
	};
	callTmdb = (query) => {
		const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=a1fbd782378df018ba5377e9eeb5418a&query=${query}&language=fr&page=1`;
		if (this.cancel) {
			// Cancel the previous request before making a new request
			this.cancel.cancel();
		}
		// Create a new CancelToken
		this.cancel = axios.CancelToken.source();
		axios
			.get(searchUrl, {
				cancelToken: this.cancel.token,
			})
			.then((res) => {
				const resultNotFoundMsg = !res.data.results.length
					? "Aucun film trouvé..."
					: "";
				this.setState({
					results: res.data.results,
					message: resultNotFoundMsg,
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
	};

	renderSearchResults = () => {
		const results = this.state.results;

		if (Object.keys(results).length && results.length) {
			return (
				<Row className="movieResults">
					{results.map((movie) => {
						const backdropUrl =
							this.state.mediaUrl + movie.poster_path;
						return (
							<Col key={movie.id} className="movieCard">
								{movie.poster_path ? (
									<img src={backdropUrl} alt="affiche" />
								) : (
									<img src="" alt="affiche" />
								)}

								<div className="details">
									<div className="detailTitle">
										{movie.title}
									</div>
									<small className="detailDate">
										Date de sortie : {movie.release_date}
									</small>
								</div>
								<Link
									to={{
										pathname: "/add",
										state: {
											movie,
										},
									}}
								>
									<Button>Ajouter</Button>
								</Link>
							</Col>
						);
					})}
				</Row>
			);
		}
	};
	render() {
		return (
			<div>
				<Row>
					<label className="search" htmlFor="search-input">
						<i
							className="fa fa-search search-icon"
							style={{ marginRight: "1em" }}
						/>
						<input
							type="text"
							value={this.query}
							id="search-input"
							placeholder="Chercher sur TMDb.org"
							onChange={this.handleInputChange}
						/>
					</label>
				</Row>
				{this.renderSearchResults()}
			</div>
		);
	}
}

export default AddMovie;
