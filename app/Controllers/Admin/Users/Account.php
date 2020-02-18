<?php namespace App\Controllers\Admin\Users;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;
use App\Controllers\AdminController;
use App\Validation\Admin\Users\Account as Validate;
use App\Models\Admin\Users\Account as Model;

class Account extends AdminController {

   public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger) {
      parent::initController($request, $response, $logger);
   }

   public function index() {
      $this->data = [
         'title' => 'Account',
         'internalCss' => $this->app->datatable['css'],
         'internalJs' => [
            $this->app->datatable['js'],
            'http://localhost:8080/usersAccount.js'
         ]
      ];

      $this->template($this->data);
   }
   
   public function addNew() {
      $footerJs['listCountry'] = AdminController::dropdownCountry();

      $this->data = [
         'title' => 'Add New Account',
         'pageType' => 'insert',
         'internalJs' => ['http://localhost:8080/usersAccountForms.js'],
         'footerJs' => $footerJs
      ];

      $this->template($this->data);
   }
   
   public function edit($id) {
      $model = new Model();
      $footerJs['listCountry'] = AdminController::dropdownCountry();
      $footerJs['detail'] = $model->getDetailEdit($id);

      $this->data = [
         'title' => 'Edit Account',
         'pageType' => 'update',
         'internalJs' => ['http://localhost:8080/usersAccountForms.js'],
         'footerJs' => $footerJs
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
            $model->submit($post);

            $response['status'] = true;
            $response['msg_response'] = 'Data saved successfully.';
            $response['emptyPost'] = AdminController::emptyPost($post);
         } else {
            $response['msg_response'] = 'Recheck your input!';
            $response['errors'] = \Config\Services::validation()->getErrors();
         }
         return $this->response->setJSON($response);
      } else {
         $this->notFound();
      }
   }

   public function deleteAccount() {
      if ($this->request->isAJAX()) {
         $response = ['status' => false, 'errors' => [], 'msg_response' => ''];
         $post = $this->request->getVar();
         $validate = new Validate();
      
         if ($this->validate($validate->generated($post))) {
            $model = new Model();
            $model->deleteAccount($post);

            $response['status'] = true;
            $response['msg_response'] = 'Data successfully deleted.';
         } else {
            $response['msg_response'] = 'Something went wrong!';
            $response['errors'] = \Config\Services::validation()->getErrors();
         }
         return $this->response->setJSON($response);
      } else {
         $this->notFound();
      }
   }

   public function getData() {
      if ($this->request->isAJAX()) {
         $model = new Model();
         $query = $model->getData();
   
         $i = $_POST['start'];
         $response = [];
         foreach ($query->getResultArray() as $data) {
            $i++;
   
            $result = [];
            $result['id'] = $data['id'];
            $result[] = fullname($data['first_name'], $data['last_name']);
            $result[] = $data['username'];
            $result[] = $data['email'];
            $result[] = userStatus($data['status']);
   
            $response[] = $result;
         }
   
         $output = [
            'draw' => intval($_POST['draw']),
            'recordsTotal' => intval($model->countData()),
            'recordsFiltered' => intval($model->filteredData()),
            'data' => $response
         ];
   
         return $this->response->setJSON($output);
      } else {
         $this->notFound();
      }
   }

}