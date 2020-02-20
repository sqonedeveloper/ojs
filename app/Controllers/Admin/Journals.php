<?php namespace App\Controllers\Admin;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;
use App\Controllers\AdminController;
use App\Validation\Admin\Journals as Validate;
use App\Models\Admin\Journals as Model;

class Journals extends AdminController {

   public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger) {
      parent::initController($request, $response, $logger);
   }

   public function index() {
      $this->data = [
         'title' => 'Journals',
         'internalJs' => ['http://localhost:8080/journals.js']
      ];

      $this->template($this->data);
   }

   public function submit() {
      if ($this->request->isAJAX()) {
         $response = ['status' => false, 'errors' => [], 'msg_response' => ''];
         $post = $this->request->getVar();
         $validate = new Validate();
      
         if ($this->validate($validate->generated($post))) {
            $model = new Model();
            $createJournal = $model->createJournal($post);

            $response['status'] = true;
            $response['msg_response'] = 'Created success.';
            $response['id_journal'] = $createJournal;
         } else {
            $response['msg_response'] = 'Recheck your input!';
            $response['errors'] = \Config\Services::validation()->getErrors();
         }
         return $this->response->setJSON($response);
      } else {
         $this->notFound();
      }
   }

   public function wizard($id, $tab) {
      $model = new Model();
      $footerJs['detail'] = $model->getDetailJournal($id, $tab);

      $this->data = [
         'title' => 'Wizard : ' . $footerJs['detail']['journal_name'],
         'internalJs' => ['http://localhost:8080/journals'.ucwords($tab).'.js'],
         'footerJs' => $footerJs
      ];

      $this->template($this->data);
   }

   public function submitWizard() {
      if ($this->request->isAJAX()) {
         $response = ['status' => false, 'errors' => [], 'msg_response' => ''];
         $post = $this->request->getVar();
         $files = $this->request->getFiles();
         $validate = new Validate();
         
         $response['files'] = $files;
         if ($this->validate($validate->generated($post))) {
            $model = new Model();
            $model->{'updateWizard_' . $post['pageType']}($post);

            $response['status'] = true;
            $response['msg_response'] = 'Data saved successfully.';
         } else {
            $response['msg_response'] = 'Recheck your input!';
            $response['errors'] = \Config\Services::validation()->getErrors();
         }
         return $this->response->setJSON($response);
      } else {
         $this->notFound();
      }
   }

   public function updateTable() {
      if ($this->request->isAJAX()) {
         $response = ['status' => false, 'errors' => [], 'msg_response' => ''];
         $post = $this->request->getVar();
         $validate = new Validate();
      
         if ($this->validate($validate->generated($post))) {
            $model = new Model();
            $model->updateTable($post);

            $response['status'] = true;
         } else {
            $response['msg_response'] = 'Recheck your input!';
            $response['errors'] = \Config\Services::validation()->getErrors();
         }
         return $this->response->setJSON($response);
      } else {
         $this->notFound();
      }
   }

}