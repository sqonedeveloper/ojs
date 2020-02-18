<?php namespace App\Models\Admin\Users;

use CodeIgniter\Model;

class Profile extends Model {

   protected $db;
   protected $id_users;

   public function __construct() {
      $this->db = \Config\Database::connect();

      $session = \Config\Services::session();
      $this->id_users = $session->get('id');
   }

   public function submit($post = []) {
      unset($post['username'], $post['email'], $post['old_avatar']);

      $post['bio_statement'] = htmlentities($post['bio_statement']);
      $post['mailing_address'] = htmlentities($post['mailing_address']);
      $post['modified'] = date('Y-m-d H:i:s');

      if (!empty($post['password'])) {
         $post['password'] = password_hash($post['password'], PASSWORD_BCRYPT);
      } else {
         unset($post['password']);
      }

      $table = $this->db->table('tb_users');
      $table->where('id', $this->id_users);
      $table->update($post);
   }

   public function getDetailContent() {
      $table = $this->db->table('tb_users');
      $table->select('first_name, last_name, public_name, username, email, country, website,
         phone, orcid_id, affiliation, bio_statement, mailing_address, signature, avatar');
      $table->where('id', $this->id_users);

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

}