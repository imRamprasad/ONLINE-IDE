const corsOptions = {
	origin: '*',
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization', 'x-recaptcha-token'],
	credentials: false,
};

module.exports = corsOptions;
