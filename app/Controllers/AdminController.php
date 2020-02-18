<?php namespace App\Controllers;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;
use App\Controllers\BaseController;

class AdminController extends BaseController {

   public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger) {
      parent::initController($request, $response, $logger);

      $this->_checkSession();
   }

   private function _checkSession() {
      $session = \Config\Services::session();
      $isLogin = $session->get('isLogin');
      $is_super = $session->get('is_super');

      if (!$isLogin || $is_super === 'f') {
         die('You must <a href="'.site_url('login').'">login</a> first!');
      } else {
         foreach ($session->get() as $key => $val) {
            $this->{$key} = $val;
         }
      }
   }

   public function template($content = []) {
      $internalCss = $this->internalCss($content);

      $internalJs[] = [
         'http://localhost:8080/vendor.js',
         'http://localhost:8080/header.js',
         'http://localhost:8080/sidebar.js',
      ];
      $internalJs[] = $this->internalJs($content);

      $footerJs = $this->footerJs($content);
      $footerJs['navigation'] = $this->_navigation();
      $footerJs['users'] = [
         'nama' => $this->last_name,
         'avatar' => base_url('img/' . $this->avatar),
         'email' => $this->email
      ];

      $data['title'] = $content['title'];
      $data['internalCss'] = css_tag($internalCss);
      $data['internalJs'] = script_tag($internalJs);
      $data['footerJs'] = json_encode(array_merge($footerJs));
      $data['segment'] = $this->setSegment();
      $data['pageType'] = @$content['pageType'];

      echo view('Admin', $data);
   }

   private function _navigation() {
      $config = [
         [
            'label' => 'Dashboard',
            'icon' => 'mdi mdi-home',
            'active' => ['dashboard'],
            'url' => '/admin/dashboard',
            'sub' => false
         ],
         [
            'label' => 'Journals',
            'icon' => 'mdi mdi-home',
            'active' => ['journals'],
            'url' => '/admin/journals',
            'sub' => false
         ],
         [
            'label' => 'Users',
            'icon' => 'mdi mdi-home',
            'active' => ['users'],
            'url' => '#',
            'sub' => true,
            'child' => [
               [
                  'label' => 'Account',
                  'active' => ['account', 'profile'],
                  'url' => '/admin/users/account',
                  'sub' => false
               ]
            ]
         ],
      ];
      return $config;
   }

}