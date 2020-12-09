import moment, { Moment } from "moment";
import {
	PageCollection,
	PageIterator,
} from "@microsoft/microsoft-graph-client";
import { isAdmin } from "./Groups";

var graph = require("@microsoft/microsoft-graph-client");

function getAuthenticatedClient(accessToken) {
	// Initialize Graph client
	const client = graph.Client.init({
		// Use the provided access token to authenticate
		// requests
		authProvider: (done) => {
			done(null, accessToken);
		},
	});

	return client;
}

export async function getUserDetails(accessToken) {
	const client = getAuthenticatedClient(accessToken);

	const user = await client
		.api("/me")
		.select("displayName", "mail", "userPrincipalName")
		.get();

	user.photo = await client
		.api("/me/photo/$value")
		.responseType("blob")
		.get();

	user.memberOf = await client.api("/me/memberOf").get();

	user.isAdmin = isAdmin(user);

	console.log(user);
	return user;
}
