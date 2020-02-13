<?php namespace App\Models\Admin\Users;

use CodeIgniter\Model;

class Account extends Model {

   protected $db;

   public function __construct() {
      $this->db = \Config\Database::connect();
   }

   public function submit($post = []) {
      if ($post['pageType'] === 'insert') {
         unset($post['pageType'], $post['id']);

         $post['password'] = password_hash($post['password'], PASSWORD_BCRYPT);
         $post['uploaded'] = date('Y-m-d H:i:s');
         $post['status'] = 1;

         $insert = [];
         foreach ($post as $key => $val) {
            $insert[$key] = trim($val);
         }

         $table = $this->db->table('tb_users');
         $table->insert($insert);
      }
   }

   function getData() {
      $table = $this->_queryData();
      if ($_POST['length'] != -1)
         $table->limit($_POST['length'], $_POST['start']);
      return $table->get();
   }
   
   function countData() {
      $table = $this->db->table('tb_users');
      $get = $table->get();
      return count($get->getResult());
   }
   
   function filteredData() {
      $table = $this->_queryData();
      $get = $table->get();
      return count($get->getResult());
   }
   
   private function _queryData() {
      $table = $this->db->table('tb_users');
      $table->select('id, first_name, last_name, username, email, status');
   
      $i = 0;
      $column_search = ['first_name', 'last_name', 'username', 'email'];
      $column_order = ['first_name', 'username', 'email', 'status'];
      foreach ($column_search as $item) {
         if ($_POST['search']['value']) {
            if ($i === 0) {
               $table->groupStart();
               $table->like($item, $_POST['search']['value']);
            } else {
               $table->orLike($item, $_POST['search']['value']);
            }
   
            if (count($column_search) - 1 == $i)
               $table->groupEnd();
         }
         $i++;
      }
   
      $column = $_POST['order'][0]['column'];
      $dir = $_POST['order'][0]['dir'];
      $table->orderBy($column_order[$column], $dir);
   
      return $table;
   }

}