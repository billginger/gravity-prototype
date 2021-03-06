import React from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Breadcrumb, Form, Input, Button, Alert } from 'antd';
import PortalContent from './PortalContent.jsx';

class BrandAdd extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			errMsg: '',
			buttonLoading: false
		}
	}
	render() {
		const i18n = this.props.intl.messages;
		const { getFieldDecorator, validateFieldsAndScroll } = this.props.form;
		const { errMsg, buttonLoading } = this.state;
		const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 16 } };
		const tailFormItemLayout = { wrapperCol: { offset: 4, span: 16 } };
		// Breadcrumb
		const breadcrumb = (
			<Breadcrumb>
				<Breadcrumb.Item>{i18n.system}</Breadcrumb.Item>
				<Breadcrumb.Item><Link to="/brand">{i18n.brand}</Link></Breadcrumb.Item>
				<Breadcrumb.Item>{i18n.labelAdd}</Breadcrumb.Item>
			</Breadcrumb>
		);
		// Error
		let alertMessage;
		if (errMsg) {
			if (errMsg.indexOf('{') == 0) {
				const msg = JSON.parse(errMsg);
				alertMessage = this.props.intl.formatMessage(
					{ id: msg.id },
					{ key: i18n[msg.key], value: msg.value }
				);
			} else {
				alertMessage = i18n[errMsg] || i18n.msgError;
			}
		}
		const formAlert = (
			alertMessage && <Alert className="tc-form-alert" message={alertMessage} type="error" />
		);
		// Handle
		const handleSubmit = e => {
			e.preventDefault();
			validateFieldsAndScroll((err, values) => {
				if (err) return;
				this.setState({ buttonLoading: true });
				fetch('/api/brand/add', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(values)
				}).then(res => (
					res.ok ? res.json() : Promise.reject(res)
				)).then(data => {
					this.props.history.push(`/brand/${data._id}`);
				}).catch(err => {
					const errMsg = err.statusText || err;
					this.setState({
						errMsg,
						buttonLoading: false
					});
				});
			});
		};
		const handleInputChange = () => {
			this.setState({ errMsg: '' });
		};
		// Page
		const content = (
			<Form {...formItemLayout} onSubmit={handleSubmit} style={{ marginTop: 40 }}>
				<Form.Item label={i18n.labelName}>
					{getFieldDecorator('name', {
						rules: [{ required: true, message: i18n.msgNeedInput, whitespace: true }]
					})(
						<Input placeholder={i18n.labelName} onChange={handleInputChange} />
					)}
				</Form.Item>
				<Form.Item {...tailFormItemLayout}>
					{formAlert}
					<Button type="primary" htmlType="submit" loading={buttonLoading}>
						{i18n.actionSubmit}
					</Button>
				</Form.Item>
			</Form>
		);
		return (
			<PortalContent breadcrumb={breadcrumb} content={content} />
		);
	}
}

export default injectIntl(Form.create()(BrandAdd));
