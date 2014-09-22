/** @jsx React.DOM */

var React = require("react");
var Router = require("react-router");

/* global window */
// expost React globally for DevTools
window.React = React;

var MovEthApp = require("./components/MovEthApp");

var Client = require("./components/Client");


// Load jQuery and bootstrap
var jQuery = require("jquery");
window.jQuery = jQuery;
require("bootstrap/dist/js/bootstrap.js");
//require("./css/style.css");

var Route = Router.Route;
var Routes = Router.Routes;
var Redirect = Router.Redirect;

var routes = (
    <Routes>
        <Route handler={MovEthApp}>
            <Redirect from="/" to="client" />
            <Route name="client" path="/client" handler={Client} />
        </Route>
    </Routes>
);

/* global document */
React.renderComponent(routes, document.getElementById("app"));
