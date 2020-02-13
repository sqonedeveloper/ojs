<?php namespace App\Models\Admin;

use CodeIgniter\Model;

class Journals extends Model {

   protected $db;

   public function __construct() {
      $this->db = \Config\Database::connect();
   }

   public function createJournal($post = []) {
      unset($post['pageType']);

      $post['uploaded'] = date('Y-m-d H:i:s');
      $post['modified'] = date('Y-m-d H:i:s');
      $post['initial'] = url_title($post['initial'], '-', true);
      $post['summary'] = htmlentities($post['summary']);

      $insert = [];
      foreach ($post as $key => $val) {
         if ($val !== '')
            $insert[$key] = trim($val);
      }

      $table = $this->db->table('tb_journal');
      $table->insert($insert);

      $makedir = ROOTPATH . 'public/' . url_title($post['initial'], '-', true);
      mkdir($makedir, 0777);
      chmod($makedir, 0777);

      write_file($makedir . '/index.html', 'no direct script access allowed');
   }

}