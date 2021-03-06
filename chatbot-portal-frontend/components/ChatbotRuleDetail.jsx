import React from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Breadcrumb, Typography, Icon, Row, Col, Tag, Modal } from 'antd';
import { withTimeZone, getLocalDate } from '../utils/date.js';
import PortalContent from './PortalContent.jsx';
const { Text } = Typography;

class ChatbotRuleDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			errMsg: '',
			data: '',
			isDeleted: false
		}
	}
	componentDidMount() {
		const id = this.props.match.params.id;
		fetch(`/api/chatbot/rule/${id}`).then(res => (
			res.ok ? res.json() : Promise.reject(res)
		)).then(data => {
			this.setState({ data });
		}).catch(err => {
			const errMsg = err.statusText || err;
			this.setState({ errMsg });
		});
	}
	render() {
		const i18n = this.props.intl.messages;
		const { errMsg, data, isDeleted } = this.state;
		// Breadcrumb
		const breadcrumb = (
			<Breadcrumb>
				<Breadcrumb.Item>{i18n.chatbot}</Breadcrumb.Item>
				<Breadcrumb.Item><Link to="/chatbot/rule">{i18n.chatbotRule}</Link></Breadcrumb.Item>
				<Breadcrumb.Item>{i18n.labelDetail}</Breadcrumb.Item>
			</Breadcrumb>
		);
		// Deleted
		if (isDeleted) {
			const deletedText = (
				<p>{i18n.msgDeleted}</p>
			);
			return (
				<PortalContent breadcrumb={breadcrumb} content={deletedText} />
			);
		}
		// Error
		if (errMsg) {
			const warnMessage = i18n[errMsg] || i18n.msgError;
			const warnText = (
				<Text type="warning">{warnMessage}</Text>
			);
			return (
				<PortalContent breadcrumb={breadcrumb} content={warnText} />
			);
		}
		// Loading
		if (!data) {
			const loading = (
				<Icon type="loading" />
			);
			return (
				<PortalContent breadcrumb={breadcrumb} content={loading} />
			);
		}
		// Handle
		const handleDelete = e => {
			const action = e.target.textContent;
			Modal.confirm({
				title: i18n.modalConfirmTitle,
				content: this.props.intl.formatMessage({ id: 'modalConfirmBody' }, { action, target: data.name }),
				onOk: () => {
					fetch(`/api/chatbot/rule/delete/${data._id}`, {
						method: 'PUT'
					}).then(res => (
						res.ok ? this.setState({ isDeleted: true }) : Promise.reject(res)
					)).catch(err => {
						let warnMsg = err.statusText || err;
						warnMsg = i18n[warnMsg]
						if (warnMsg) {
							Modal.warning({
								title: i18n.modalWarningTitle,
								content: warnMsg
							});
						} else {
							Modal.error({
								title: i18n.modalErrorTitle,
								content: i18n.msgError
							});
						}
					});
				}
			});
		};
		// Page
		const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
		const randomColor = () => (
			colors[parseInt(Math.random() * 10)]
		);
		const content = (
			<React.Fragment>
				<div id="tc-page-header">
					<h1>{data.name}</h1>
					<Link to={`/chatbot/rule/edit/${data._id}`}>{i18n.actionEdit}</Link>
					<a onClick={handleDelete}>{i18n.actionDelete}</a>
				</div>
				<div id="tc-page-main">
					<Row>
						<Col span={6}>
							{i18n.chatbotRuleKeyword}
						</Col>
						<Col span={18}>
							{data.keywords.map((item, key) => (
								<Tag key={key} color={randomColor()}>{item}</Tag>
							))}
						</Col>
					</Row>
					<Row>
						<Col span={6}>
							{i18n.chatbotRuleReplyContent}
						</Col>
						<Col span={18}>
							{JSON.stringify(data.replyContent)}
						</Col>
					</Row>
					<Row>
						<Col span={6}>
							{i18n.chatbotRuleReplyOption}
						</Col>
						<Col span={18}>
							{data.replyOptions ? JSON.stringify(data.replyOptions) : '-'}
						</Col>
					</Row>
					<Row>
						<Col span={6}>
							{i18n.chatbotRuleAllowGuess}
						</Col>
						<Col span={18}>
							{data.allowGuess ? 'Yes' : 'No'}
						</Col>
					</Row>
					<Row>
						<Col span={6}>
							{i18n.chatbotRuleEnableWaiting}
						</Col>
						<Col span={18}>
							{data.enableWaiting ? 'Yes' : 'No'}
						</Col>
					</Row>
					<Row>
						<Col span={6}>
							{i18n.labelCreatedBy}
						</Col>
						<Col span={18}>
							{data.createdBy || '-'}
						</Col>
					</Row>
					<Row>
						<Col span={6}>
							{i18n.labelUpdatedBy}
						</Col>
						<Col span={18}>
							{data.updatedBy || '-'}
						</Col>
					</Row>
					<Row>
						<Col span={6}>
							{withTimeZone(i18n.labelCreatedAt)}
						</Col>
						<Col span={18}>
							{getLocalDate(data.createdAt)}
						</Col>
					</Row>
					<Row>
						<Col span={6}>
							{withTimeZone(i18n.labelUpdatedAt)}
						</Col>
						<Col span={18}>
							{getLocalDate(data.updatedAt)}
						</Col>
					</Row>
				</div>
			</React.Fragment>
		);
		return (
			<PortalContent breadcrumb={breadcrumb} content={content} />
		);
	}
}

export default injectIntl(ChatbotRuleDetail);
