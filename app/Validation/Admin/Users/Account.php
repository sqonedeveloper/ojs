<?php namespace App\Validation\Admin\Users;

class Account {

   public $pageType = [
      'pageType' => 'required|in_list[insert,update,delete]'
   ];

   public function generated($post = []) {
      return array_merge($this->pageType, $this->{$post['pageType']}($post));
   }

   public function insert() {
      return [
         'first_name' => [
            'rules' => 'required',
            'label' => 'first name'
         ],
         'last_name' => [
            'rules' => 'required',
            'label' => 'last name'
         ],
         'username' => [
            'rules' => 'required|is_unique[tb_users.username]',
            'label' => 'username'
         ],
         'email' => [
            'rules' => 'required|is_unique[tb_users.email]',
            'label' => 'email'
         ],
         'password' => [
            'rules' => 'required',
            'label' => 'password'
         ],
         'country' => [
            'rules' => 'required|max_length[2]',
            'label' => 'country'
         ],
      ];
   }

}