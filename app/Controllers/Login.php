<?php namespace App\Controllers;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;
use App\Controllers\BaseController;
use App\Validation\Login as Validate;

class Login extends BaseController {

   public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger) {
      parent::initController($request, $response, $logger);
   }

   public function index() {
      $this->data = [
         'title' => 'Login',
         'internalJs' => script_tag([
            'http://localhost:8080/vendor.js',
            'http://localhost:8080/login.js'
         ])
      ];

      return view('Login', $this->data);
   }

   public function submit() {
      if ($this->request->isAJAX()) {
         $response = ['status' => false, 'errors' => [], 'msg_response' => ''];
         $post = $this->request->getVar();
         $validate = new Validate();
      
         if ($this->validate($validate->generated($post))) {
            $users = $this->_resolve_user_login($post);

            if ($users) {
               unset($users['password']);
               $session = \Config\Services::session();

               $session->set('isLogin', true);
               $session->set($users);

               $response['status'] = true;
               $response['msg_response'] = 'Login successful, redirected...';
               $response['is_super'] = $users['is_super'];
            }
         } else {
            $response['msg_response'] = 'Incorrect username or password!';
            $response['errors'] = \Config\Services::validation()->getErrors();
         }
         return $this->response->setJSON($response);
      } else {
         $this->notFound();
      }
   }

   private function _resolve_user_login($post = []) {
      try {
         $db = \Config\Database::connect();

         $table = $db->table('tb_users');
         $table->where('username', $post['username']);
         $table->where('status', true);

         $get = $table->get();
         $data = $get->getRowArray();

         if (isset($data)) {
            if (password_verify($post['password'], $data['password'])) {
               return $data;
            }
         }
         
         return false;
      } catch (\Exception $e) {
         die($e->getMessage());
      }
   }

   public function logout() {
      $session = \Config\Services::session();

      $session->destroy();
      return redirect()->to(site_url('login'));
   }

}