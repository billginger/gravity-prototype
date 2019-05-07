import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home.jsx';
import BrandAdd from './BrandAdd.jsx';
import BrandDetail from './BrandDetail.jsx';
import Building from './Building.jsx';
import PortalColumn from './PortalColumn.jsx';

const PortalRoutes = () => (
	<Switch>
		<Route exact path="/" component={Home} />
		<Route exact path="/brand" component={Building} />
		<Route exact path="/brand/add" component={BrandAdd} />
		<Route exact path="/brand/:id" component={BrandDetail} />
		<Route component={PortalColumn} />
	</Switch>
);

export default PortalRoutes;