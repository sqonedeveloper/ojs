<?php namespace App\Controllers;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;
use App\Controllers\BaseController;

class AdminController extends BaseController {

   public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger) {
      parent::initController($request, $response, $logger);
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
         'nama' => 'Administrator',
         'avatar' => 'avatar',
         'email' => 'sqone.developer@ar-raniry.ac.id'
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
                  'active' => ['account'],
                  'url' => '/admin/users/account',
                  'sub' => false
               ]
            ]
         ],
      ];
      return $config;
   }

}