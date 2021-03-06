import React from 'react';
import { injectIntl } from 'react-intl';
import { withRouter, Link } from 'react-router-dom';
import { Menu, Icon, Modal, message } from 'antd';

class PortalHeaderMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			errMsg: '',
			user: '',
			brands: []
		}
	}
	componentDidMount() {
		fetch('/api/user/profile').then(res => (
			res.ok ? res.json() : Promise.reject(res)
		)).then(user => {
			this.setState({ user });
		}).catch(err => {
			const errMsg = err.statusText || err;
			this.setState({ errMsg });
		});
		fetch('/api/brand').then(res => (
			res.ok ? res.json() : Promise.reject(res)
		)).then(brands => {
			this.setState({ brands });
		}).catch(err => {});
	}
	render() {
		const { intl, location } = this.props;
		const { errMsg, user, brands } = this.state;
		const i18n = intl.messages;
		// Error
		if (errMsg) {
			const warnMessage = i18n[errMsg] || i18n.msgError;
			message.warning(warnMessage);
			return (
				<Menu id="tc-portal-menu" theme="dark" mode="horizontal">
					<Menu.Item>
						<Link to="/login">
							<Icon type="user" />{i18n.loginButton}
						</Link>
					</Menu.Item>
				</Menu>
			);
		}
		// Hold
		if (!user || !brands) {
			return '';
		}
		// Select Brand
		const updateUser = brand => {
			user.brand = brand;
			this.setState({ user }, () => {
				this.props.history.push('/dashboard/redirect');
			});
		};
		const selectBrand = e => {
			const id = e.key;
			fetch(`/api/user/brand/${id}`, {
				method: 'PUT'
			}).then(res => (
				res.ok ? updateUser(id) : Promise.reject(res)
			)).catch(err => {
				let warnMsg = err.statusText || err;
				warnMsg = i18n[warnMsg] || i18n.msgError;
				message.warning(warnMsg);
			});
		};
		// Brand Menu
		let brandMenu = (
			<Menu.Item key="/brand/add">
				<Link to="/brand/add">
					<Icon type="shop" />{i18n.brandAdd}
				</Link>
			</Menu.Item>
		);
		let brandMenuTitle = i18n.brandSelect;
		if (user.brand) {
			const brand = brands.find(item => (
				item._id == user.brand
			));
			if (brand && brand.name) {
				brandMenuTitle = brand.name;
			}
		}
		brandMenuTitle = (
			<React.Fragment>
				<Icon type="shop" />{brandMenuTitle}
			</React.Fragment>
		);
		if (brands.length) {
			brandMenu = (
				<Menu.SubMenu title={brandMenuTitle}>
					{brands.map(item => (
						<Menu.Item key={item._id} onClick={selectBrand}>
							{item.name}
						</Menu.Item>
					))}
				</Menu.SubMenu>
			);
		}
		// Handle
		const handleLogout = () => {
			Modal.confirm({
				title: i18n.modalConfirmTitle,
				content: intl.formatMessage(
					{ id: 'modalConfirmBody' },
					{ action: i18n.userLogout, target: '' }
				),
				onOk() {
					window.location.href = '/api/user/logout';
				}
			});
		};
		// Portal Menu
		const userMenuTitle = (
			<React.Fragment>
				<Icon type="user" />{user.name}
			</React.Fragment>
		);
		return (
			<Menu id="tc-portal-menu" theme="dark" mode="horizontal" selectedKeys={[location.pathname]}>
				<Menu.Item key="/">
					<Link to="/">
						<Icon type="home" />{i18n.home}
					</Link>
				</Menu.Item>
				{brandMenu}
				<Menu.SubMenu title={userMenuTitle}>
					<Menu.Item onClick={handleLogout}>
						{i18n.userLogout}
					</Menu.Item>
				</Menu.SubMenu>
			</Menu>
		);
	}
}

export default injectIntl(withRouter(PortalHeaderMenu));
