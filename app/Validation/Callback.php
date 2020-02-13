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

}