<?php namespace App\Models\Admin\Users;

use CodeIgniter\Model;

class Account extends Model {

   protected $db;

   public function __construct() {
      $this->db = \Config\Database::connect();
   }

   public function deleteAccount($post = []) {
      $table = $this->db->table('tb_users');
      $table->where('id', $post['id']);
      $table->delete();
   }

   public function getDetailEdit($id) {
      $table = $this->db->table('tb_users');
      $table->select('first_name, last_name, public_name, username, email, country, website,
         phone, orcid_id, affiliation, bio_statement, mailing_address, signature');
      $table->where('id', $id);

      $get = $table->get();
      $data = $get->getRowArray();

      if (isset($data)) {
         $fieldNames = $get->getFieldNames();
         $decodeHtml = ['mailing_address', 'bio_statement'];

         $response = [];
         foreach ($fieldNames as $key) {
            if (in_array($key, $decodeHtml)) {
               $response[$key] = html_entity_decode($data[$key]);
            } else {
               $response[$key] = (string) $data[$key];
            }
         }
         return $response;
      } else {
         throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
      }
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
      } else if ($post['pageType'] === 'update') {
         unset($post['pageType'], $post['username'], $post['email']);

         if ($post['password'] !== '') {
            $post['password'] = password_hash($post['password'], PASSWORD_BCRYPT);
         } else {
            unset($post['password']);
         }

         $post['bio_statement'] = htmlentities($post['bio_statement']);
         $post['mailing_address'] = htmlentities($post['mailing_address']);
         $post['modified'] = date('Y-m-d H:i:s');

         $update = [];
         foreach ($post as $key => $val) {
            $update[$key] = trim($val);
         }

         $table = $this->db->table('tb_users');
         $table->where('id', $post['id']);
         $table->update($update);
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