export function isAdmin(user) {
	let usersGroups = user.memberOf.value;
	let status;

	usersGroups.map((group) => {
		return (status =
			group.id === "99c545ff-565d-41d6-8ce6-ad406629e1eb" ? true : false);
	});

	return status;
}
