<?php namespace Config;

/**
 * --------------------------------------------------------------------
 * URI Routing
 * --------------------------------------------------------------------
 * This file lets you re-map URI requests to specific controller functions.
 *
 * Typically there is a one-to-one relationship between a URL string
 * and its corresponding controller class/method. The segments in a
 * URL normally follow this pattern:
 *
 *    example.com/class/method/id
 *
 * In some instances, however, you may want to remap this relationship
 * so that a different class/function is called than the one
 * corresponding to the URL.
 */

// Create a new instance of our RouteCollection class.
$routes = Services::routes(true);

// Load the system's routing file first, so that the app and ENVIRONMENT
// can override as needed.
if (file_exists(SYSTEMPATH . 'Config/Routes.php'))
{
	require SYSTEMPATH . 'Config/Routes.php';
}

/**
 * --------------------------------------------------------------------
 * Router Setup
 * --------------------------------------------------------------------
 * The RouteCollection object allows you to modify the way that the
 * Router works, by acting as a holder for it's configuration settings.
 * The following methods can be called on the object to modify
 * the default operations.
 *
 *    $routes->defaultNamespace()
 *
 * Modifies the namespace that is added to a controller if it doesn't
 * already have one. By default this is the global namespace (\).
 *
 *    $routes->defaultController()
 *
 * Changes the name of the class used as a controller when the route
 * points to a folder instead of a class.
 *
 *    $routes->defaultMethod()
 *
 * Assigns the method inside the controller that is ran when the
 * Router is unable to determine the appropriate method to run.
 *
 *    $routes->setAutoRoute()
 *
 * Determines whether the Router will attempt to match URIs to
 * Controllers when no specific route has been defined. If false,
 * only routes that have been defined here will be available.
 */
$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
$routes->setAutoRoute(false);

/**
 * --------------------------------------------------------------------
 * Route Definitions
 * --------------------------------------------------------------------
 */

// We get a performance increase by specifying the default
// route since we don't have to scan directories.
$routes->get('/', 'Home::index');

$routes->get('login', 'Login::index');
$routes->group('login', function($routes) {
	$routes->get('logout', 'Login::logout');
	$routes->post('submit', 'Login::submit');
});

$routes->post('checkPploadMaxFilesize', 'BaseController::checkPploadMaxFilesize');
$routes->post('uploadFileImage', 'BaseController::uploadFileImage');

$routes->get('sitemap/(:any)', 'Sitemap::index/$1');

$routes->group('admin', ['namespace' => 'App\Controllers\Admin'], function($routes) {
	$routes->get('dashboard', 'Dashboard::index');

	$routes->get('journals', 'Journals::index');
	$routes->group('journals', function($routes) {
		$routes->get('wizard/(:num)/(:any)', 'Journals::wizard/$1/$2');
		$routes->post('submit', 'Journals::submit');
		$routes->post('submitWizard', 'Journals::submitWizard');
		$routes->post('updateTable', 'Journals::updateTable');
	});

	$routes->group('users', ['namespace' => 'App\Controllers\Admin\Users'], function($routes) {
		$routes->get('account', 'Account::index');
		$routes->group('account', function($routes) {
			$routes->get('addNew', 'Account::addNew');
			$routes->get('edit/(:num)', 'Account::edit/$1');
			$routes->post('submit', 'Account::submit');
			$routes->post('getData', 'Account::getData');
			$routes->post('deleteAccount', 'Account::deleteAccount');
		});

		$routes->get('profile', 'Profile::index');
		$routes->group('profile', function($routes) {
			$routes->post('submit', 'Profile::submit');
		});
	});
});

/**
 * --------------------------------------------------------------------
 * Additional Routing
 * --------------------------------------------------------------------
 *
 * There will often be times that you need additional routing and you
 * need to it be able to override any defaults in this file. Environment
 * based routes is one such time. require() additional route files here
 * to make that happen.
 *
 * You will have access to the $routes object within that file without
 * needing to reload it.
 */
if (file_exists(APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php'))
{
	require APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php';
}
