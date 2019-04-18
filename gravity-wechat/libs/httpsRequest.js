const https = require('https');

module.exports = (options, postData, callback) => {
	options.headers['Content-Length'] = Buffer.byteLength(postData);
	const req = https.request(options, res => {
		let data = '';
		res.on('data', d => {
			data += d;
		});
		res.on('end', () => {
			callback(0, data);
		});
	});
	req.on('error', e => {
		callback(e);
	});
	if (postData) {
		req.write(postData);
	}
	req.end();
};
