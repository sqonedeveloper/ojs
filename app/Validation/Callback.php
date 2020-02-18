<?php namespace App\Validation;

class Callback {

   public function checkDuplicateJournalInitial(string $str, &$error = null) : bool {
      $db = \Config\Database::connect();

      $table = $db->table('tb_journal');
      $table->where('initial', url_title($str, '-', true));

      $get = $table->get();
      $data = $get->getRowArray();

      if (isset($data)) {
         $error = 'Journal initial already exists.';
         return false;
      } else {
         return true;
      }
   }
   
   public function checkExistsUsername(string $str, &$error = null) : bool {
      $db = \Config\Database::connect();

      $table = $db->table('tb_users');
      $table->where('username', $str);

      $get = $table->get();
      $data = $get->getRowArray();

      if (isset($data)) {
         return true;
      } else {
         $error = 'Incorrect username or password!';
         return false;
      }
   }

}