<?php namespace App\Controllers\Admin\Users;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;
use App\Controllers\AdminController;
use App\Models\Admin\Users\Profile as Model;
use App\Validation\Admin\Users\Profile as Validate;
use CodeIgniter\Files\File;

class Profile extends AdminController {

   public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger) {
      parent::initController($request, $response, $logger);
   }

   public function index() {
      $model = new Model();
      $footerJs['listCountry'] = AdminController::dropdownCountry();
      $footerJs['detail'] = $model->getDetailContent();

      $this->data = [
         'title' => 'Profile',
         'internalJs' => ['http://localhost:8080/usersAccountProfile.js'],
         'footerJs' => $footerJs
      ];

      $this->template($this->data);
   }

   public function submit() {
      if ($this->request->isAJAX()) {
         $response = ['status' => false, 'errors' => [], 'msg_response' => ''];
         $post = $this->request->getVar();
         $validate = new Validate();

         $avatar = $this->request->getFile('avatar');
         
         if ($this->validate(!empty($avatar) ? array_merge($validate->generated($post), $validate->avatar) : $validate->generated($post))) {
            if (!empty($avatar)) {
               $upload_path = ROOTPATH . 'public/img';

               @unlink($upload_path . '/' . $post['old_avatar']);

               $setNewName = $avatar->getRandomName();
               $avatar->move($upload_path, $setNewName);
               @chmod($upload_path . '/' . $setNewName, 0777);

               $post['avatar'] = $setNewName;
               
               $session = \Config\Services::session();
               $session->set('avatar', $setNewName);
            } else{
               unset($post['avatar']);
               $setNewName = $post['old_avatar'];
            }

            $model = new Model();
            $model->submit($post);

            $response['status'] = true;
            $response['msg_response'] = 'Data saved successfully.';
            $response['avatar'] = $setNewName;
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