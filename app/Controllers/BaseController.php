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
	
	public function checkPploadMaxFilesize() {
		if ($this->request->isAJAX()) {
			$response = ['msg_response' => ''];
			$name = $this->request->getVar('name');

			$validation = [
				$name => [
					'rules' => 'max_size['.$name.',2048]',
					'label' => ucwords($name)
				]
			];

			if (!$this->validate($validation)) {
				$response['msg_response'] = 'Recheck your input!';
				$response['errors'] = \Config\Services::validation()->getErrors();
				$response['status'] = false;
			} else {
				$response['status'] = true;
				$response['errors'] = [];
			}
			return $this->response->setJSON($response);
		} else {
			$this->notFound();
		}
	}

	public function uploadFileImage() {
		if ($this->request->isAJAX()) {
			$post = $this->request->getVar();

			$validation = [
				'upload_path' => 'required',
				'key' => 'required|numeric',
				'name' => 'required',
				'file' => [
					'rules' => 'uploaded[file]|max_size[file,2048]|mime_in[file,image/jpeg,image/pjpeg,image/png,image/x-png]',
					'label' => ucwords($post['name'])
				]
			];

			$response = ['status' => false, 'errors' => [], 'msg_response' => ''];
			
			if ($this->validate($validation)) {
				$file = $this->request->getFile('file');
				$setNewName = $file->getRandomName();
				$file->move(ROOTPATH . $post['upload_path'], $setNewName);
				@chmod(ROOTPATH . $post['upload_path'], 0777);
				@chmod(ROOTPATH . $post['upload_path'] . '/' . $setNewName, 0777);

				@unlink(ROOTPATH . $post['upload_path'] . '/' . $post['old_file']);

				$response['status'] = true;
				$response['file_name'] = $setNewName;
			} else {
				$response['msg_response'] = 'Recheck your input!';
				$response['errors'][$post['name']] = \Config\Services::validation()->getErrors();
			}
			$response['key'] = (int) $post['key'] + 1;

			return $this->response->setJSON($response);
		} else {
			$this->notFound();
		}
	}

}