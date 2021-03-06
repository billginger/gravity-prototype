import React from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Breadcrumb, Typography, Icon, Table, Tag, Modal, message } from 'antd';
import { withTimeZone, getLocalDate } from '../utils/date.js';
import PortalContent from './PortalContent.jsx';
const { Text } = Typography;

class ChatbotRuleList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			errMsg: '',
			data: ''
		}
	}
	componentDidMount() {
		fetch('/api/chatbot/rule').then(res => (
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
		const { errMsg, data } = this.state;
		// Breadcrumb
		const breadcrumb = (
			<Breadcrumb>
				<Breadcrumb.Item>{i18n.chatbot}</Breadcrumb.Item>
				<Breadcrumb.Item>{i18n.chatbotRule}</Breadcrumb.Item>
			</Breadcrumb>
		);
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
		const handleDelete = (e, record) => {
			const action = e.target.textContent;
			const deleteRecord = () => {
				const newData = data.filter(item => (
					record != item
				));
				this.setState({ data: newData }, () => {
					message.success(i18n.msgDeleted);
				});
			};
			Modal.confirm({
				title: i18n.modalConfirmTitle,
				content: this.props.intl.formatMessage(
					{ id: 'modalConfirmBody' }, { action: action, target: record.name }
				),
				onOk: () => {
					fetch(`/api/chatbot/rule/delete/${record._id}`, {
						method: 'PUT'
					}).then(res => (
						res.ok ? deleteRecord() : Promise.reject(res)
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
		}
		// Table
		const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
		const randomColor = () => (
			colors[parseInt(Math.random() * 10)]
		);
		const columns = [{
			title: i18n.labelName,
			dataIndex: 'name',
			render: (text, record) => (
				<React.Fragment>
					<Link to={`/chatbot/rule/${record._id}`}><b>{text}</b></Link>
					<div className="tc-table-actions">
						<Link to={`/chatbot/rule/edit/${record._id}`}>{i18n.actionEdit}</Link>
						<a onClick={e => handleDelete(e, record)}>{i18n.actionDelete}</a>
					</div>
				</React.Fragment>
			)
		}, {
			title: i18n.chatbotRuleKeyword,
			dataIndex: 'keywords',
			render: text => text.map((item, key) => (
				<Tag key={key} color={randomColor()}>{item}</Tag>
			))
		}, {
			title: withTimeZone(i18n.labelCreatedAt),
			dataIndex: 'createdAt',
			render: text => getLocalDate(text)
		}, {
			title: withTimeZone(i18n.labelUpdatedAt),
			dataIndex: 'updatedAt',
			render: text => getLocalDate(text)
		}];
		const content = (
			<React.Fragment>
				<Link className="ant-btn ant-btn-primary" to="/chatbot/rule/add">
					{i18n.labelAdd}
				</Link>
				<Table className="tc-table" rowKey="_id" dataSource={data} columns={columns} />
			</React.Fragment>
		);
		return (
			<PortalContent breadcrumb={breadcrumb} content={content} />
		);
	}
}

export default injectIntl(ChatbotRuleList);
