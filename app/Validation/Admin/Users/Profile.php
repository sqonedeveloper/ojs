<?php namespace App\Validation\Admin\Users;

class Profile {

   public $avatar = [
      'avatar' => [
         'rules' => 'uploaded[avatar]|max_size[avatar,2048]|mime_in[avatar,image/jpeg,image/pjpeg,image/png,image/x-png]',
         'label' => 'avatar'
      ]
   ];

   public function generated($post = []) {
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
            'rules' => 'required',
            'label' => 'username'
         ],
         'email' => [
            'rules' => 'required|valid_email',
            'label' => 'email'
         ],
         'country' => [
            'rules' => 'required|max_length[2]',
            'label' => 'country'
         ],
      ];
   }

}