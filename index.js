async function meet(options) {
	const { google } = require("googleapis");
	const { OAuth2 } = google.auth;

	console.log(options);

	console.log(options.time.split(":")[1]);

	var date1 = options.date + "T" + options.time.split(":")[0] + ":00" + ":30";
	var date2 =
		options.date +
		"T" +
		options.time.split(":")[0] +
		":" +
		options.time.split(":")[1] +
		":30";

	var x = new Date(
		options.date + "T" + options.time.split(":")[0] + ":45" + ":30"
	);
	var y = new Date(
		options.date + "T" + options.time.split(":")[0] + ":45" + ":30"
	);

	var end1 =
		options.date +
		"T" +
		x.getUTCHours() +
		":" +
		x.getUTCMinutes() +
		":00" +
		".000Z";
	var end2 =
		options.date +
		"T" +
		y.getUTCHours() +
		":" +
		y.getUTCMinutes() +
		":00" +
		".000Z";

	let oAuth2Client = new OAuth2(options.clientId, options.clientSecret);

	try {
		oAuth2Client.setCredentials({
			refresh_token: options.refreshToken,
		});
	} catch (err) {
		console.log(err);
	}

	let calendar = google.calendar({ version: "v3", auth: oAuth2Client });

	console.log(calendar);

	let result = await calendar.events.list({
		calendarId: "primary",
		timeMin: end1,
		timeMax: end2,
		maxResults: 1,
		singleEvents: true,
		orderBy: "startTime",
	});

	console.log(result);

	let events = result.data.items;
	if (events.length) {
		return null;
	}

	const eventStartTime = new Date();
	eventStartTime.setDate(options.date.split("-")[2]);
	const eventEndTime = new Date();
	eventEndTime.setDate(options.date.split("-")[2]);
	eventEndTime.setMinutes(eventStartTime.getMinutes() + 45);

	const event = {
		summary: options.summary,
		location: options.location,
		description: options.description,
		colorId: 1,
		conferenceData: {
			createRequest: {
				requestId: "zzz",
				conferenceSolutionKey: {
					type: "hangoutsMeet",
				},
			},
		},
		start: {
			dateTime: date1,
			timeZone: "Asia/Kolkata",
		},
		end: {
			dateTime: date2,
			timeZone: "Asia/Kolkata",
		},
	};

	let link = await calendar.events.insert({
		calendarId: "primary",
		conferenceDataVersion: "1",
		resource: event,
	});
	console.log(link);
	return link.data.hangoutLink;
}

meet({
	clientId:
		"267906970847-stlovrt03o4622t3h47261s8fu9kv9u1.apps.googleusercontent.com",
	clientSecret: "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",
	refreshToken:
		"1//" +
		"0g1-ATmAlIHTnCgYIARAAGBASNwF-L9Ir-mL1OGOz9BCXzpP2ifj7hRkBAHcNbN-gjhOe0bfqtNTOKFJMwKOwxTSRJp-KJOBQnLg",
	date: "2023-03-01",
	time: "12:30",
	summary: "summary",
	location: "location",
	description: "description",
	attendees: [{ email: "19btrct036@jainuniversity.ac.in" }],
	alert: 10,
});

module.exports.meet = meet;
