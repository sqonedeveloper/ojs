<?php namespace App\Controllers;

use CodeIgniter\Controller;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;
use PhpCountriesArray\CountriesArray;

include APPPATH . 'ThirdParty/CountriesArray.php';

class BaseController extends Controller {
	
	protected $helpers = [
		'autoload',
		'style',
		'filesystem'
	];

	public $app;

	public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger) {
		parent::initController($request, $response, $logger);

		$this->app = new \Config\App();
	}

	public function dropdownCountry() {
		$response = [];
      foreach (CountriesArray::get() as $key => $val) {
         array_push($response, [
            'value' => $key,
            'label' => $val
         ]);
      }
      return $response;
	}

	public function internalCss($content = []) {
		$internalCss = [];
      if (@$content['internalCss']) {
         foreach ($content['internalCss'] as $path) {
            $internalCss[] = $path;
         }
		}
		return $internalCss;
	}

	public function internalJs($content = []) {
		$internalJs = [];
		if (@$content['internalJs']) {
         foreach ($content['internalJs'] as $path) {
            $internalJs[] = $path;
         }
		}
		return $internalJs;
	}

	public function footerJs($content = []) {
		$footerJs = [];
      if (@$content['footerJs']) {
         foreach ($content['footerJs'] as $key => $val) {
            $footerJs[$key] = $val;
         }
		}
		return $footerJs;
	}

	public function setSegment() {
		$string = uri_string();

      $response = [];
      foreach (explode('/', $string) as $key => $val) {
         $response[$key + 1] = $val;
      }
      return json_encode($response);
	}

	public function emptyPost($post = []) {
      $response = [];
      foreach ($post as $key => $val) {
         $response[$key] = '';
      }
      return $response;
	}

	public function notFound() {
      throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
   }

}
