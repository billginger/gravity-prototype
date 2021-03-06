module.exports = {
	db_url: 'mongodb://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/chatbot-wechat?authSource=admin',
	ip_whitelist: ['<IP_ADDRESS>'],
	log_file_access: '/logs/chatbot_wechat_access.log',
	log_file_access_format: ':method :url :status :content-length :response-timems',
	log_file_app: '/logs/chatbot_wechat_app.log',
	log_file_error: '/logs/chatbot_wechat_error.log',
	log_file_size_max: 10485760,
	component_appid: '<COMPONENT_APPID>',
	component_appsecret: '<COMPONENT_APPSECRET>',
	verification_token: '<VERIFICATION_TOKEN>',
	encoding_key: '<ENCODING_KEY>'
}
