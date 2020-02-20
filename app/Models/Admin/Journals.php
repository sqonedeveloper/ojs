<?php namespace App\Models\Admin;

use CodeIgniter\Model;

class Journals extends Model {

   protected $db;
   protected $id_journal;

   public function __construct() {
      $this->db = \Config\Database::connect();
   }

   public function updateWizard_indexing($post = []) {
      $id_journal = $post['id'];
      unset($post['id'], $post['pageType']);
      
      $post['custom_tags'] = htmlentities($post['custom_tags']);

      $table = $this->db->table('tb_journal_indexing');
      $table->where('id_journal', $id_journal);
      $table->update($post);
   }
   
   public function updateWizard_submission($post = []) {
      $id_journal = $post['id'];
      unset($post['id'], $post['pageType']);
      
      $post['author_guidelines'] = htmlentities($post['author_guidelines']);
      $post['privacy_statement'] = htmlentities($post['privacy_statement']);

      $table = $this->db->table('tb_journal_submission');
      $table->where('id_journal', $id_journal);
      $table->update($post);
   }
   
   public function updateWizard_apperance($post = []) {
      $id_journal = $post['id'];
      unset($post['id'], $post['pageType']);
      
      $post['page_footer'] = htmlentities($post['page_footer']);
      $post['additional_content'] = htmlentities($post['additional_content']);

      $table = $this->db->table('tb_journal_apperance');
      $table->where('id_journal', $id_journal);
      $table->update($post);
   }

   public function updateWizard_contact($post = []) {
      $id_journal = $post['id'];
      unset($post['pageType'], $post['id']);

      $table = $this->db->table('tb_journal_contact');
      $table->where('id_journal', $id_journal);
      $table->update($post);
   }

   public function updateWizard_masthead($post = []) {
      $journal = $this->db->table('tb_journal');
      $journal->where('id', $post['id']);
      $journal->update([
         'name' => trim($post['journal_name']),
         'summary' => htmlentities($post['summary']),
         'modified' => date('Y-m-d H:i:s')
      ]);

      $masthead = $this->db->table('tb_journal_masthead');
      $masthead->where('id_journal', $post['id']);
      $masthead->update([
         'publisher' => trim($post['publisher']),
         'online_issn' => trim($post['online_issn']),
         'print_issn' => trim($post['print_issn']),
         'editorial_team' => htmlentities(trim($post['editorial_team'])),
         'about_journal' => htmlentities(trim($post['about_journal']))
      ]);
   }

   public function getDetailJournal($id, $tab) {
      $table = $this->db->table('tb_journal');
      $table->select('name as journal_name, summary, initial, author_created');
      $table->where('id', $id);

      $get = $table->get();
      $data = $get->getRowArray();

      $decode_html = ['summary'];

      if (isset($data)) {
         $getFieldNames = $get->getFieldNames();
         $response = [];
         foreach ($getFieldNames as $key) {
            if (in_array($key, $decode_html)) {
               $response[$key] = (string) html_entity_decode($data[$key]);
            } else {
               $response[$key] = (string) $data[$key];
            }
         }

         $this->id_journal = $id;

         return array_merge($response, $this->{$tab}());
      } else {
         throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
      }
   }

   public function indexing() {
      $table = $this->db->table('tb_journal_indexing a');
      $table->select('a.description, a.custom_tags, b.initial');
      $table->join('tb_journal b', 'b.id = a.id_journal');
      $table->where('a.id_journal', $this->id_journal);

      $get = $table->get();
      $data = $get->getRowArray();
      $getFieldNames = $get->getFieldNames();

      $decode_html = ['custom_tags'];

      $response = [];
      foreach ($getFieldNames as $key) {
         if (in_array($key, $decode_html)) {
            $response[$key] = (string) html_entity_decode($data[$key]);
         } else {
            $response[$key] = (string) $data[$key];
         }
      }
      $response['sitemap'] = site_url('sitemap/' . $data['initial']);

      return $response;
   }

   public function submission() {
      $table = $this->db->table('tb_journal_submission');
      $table->select('author_guidelines, privacy_statement');
      $table->where('id_journal', $this->id_journal);

      $get = $table->get();
      $data = $get->getRowArray();
      $getFieldNames = $get->getFieldNames();

      $decode_html = ['author_guidelines', 'privacy_statement'];

      $response = [];
      foreach ($getFieldNames as $key) {
         if (in_array($key, $decode_html)) {
            $response[$key] = (string) html_entity_decode($data[$key]);
         } else {
            $response[$key] = (string) $data[$key];
         }
      }

      return $response;
   }

   public function apperance() {
      $table = $this->db->table('tb_journal_apperance');
      $table->select('logo, page_footer, favicon, thumbnail, additional_content');
      $table->where('id_journal', $this->id_journal);

      $get = $table->get();
      $data = $get->getRowArray();
      $getFieldNames = $get->getFieldNames();

      $decode_html = ['page_footer', 'additional_content'];

      $response = [];
      foreach ($getFieldNames as $key) {
         if (in_array($key, $decode_html)) {
            $response[$key] = (string) html_entity_decode($data[$key]);
         } else {
            $response[$key] = (string) $data[$key];
         }
      }
      $response['old_file'] = [
         'logo' => $data['logo'],
         'favicon' => $data['favicon'],
         'thumbnail' => $data['thumbnail']
      ];

      return $response;
   }

   public function contact() {
      $table = $this->db->table('tb_journal_contact');
      $table->select('name, title, email, phone, affiliation');
      $table->where('id_journal', $this->id_journal);

      $get = $table->get();
      $data = $get->getRowArray();
      $getFieldNames = $get->getFieldNames();

      $response = [];
      foreach ($getFieldNames as $key) {
         $response[$key] = (string) $data[$key];
      }
      return $response;
   }

   public function masthead() {
      $table = $this->db->table('tb_journal_masthead');
      $table->select('abbreviation, publisher, online_issn, print_issn, editorial_team, about_journal');
      $table->where('id_journal', $this->id_journal);

      $get = $table->get();
      $data = $get->getRowArray();
      $getFieldNames = $get->getFieldNames();

      $decode_html = ['editorial_team', 'about_journal'];

      $response = [];
      foreach ($getFieldNames as $key) {
         if (in_array($key, $decode_html)) {
            $response[$key] = (string) html_entity_decode($data[$key]);
         } else {
            $response[$key] = (string) $data[$key];
         }
      }
      return $response;
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

      return $this->db->insertID('tb_journal_id_seq');
   }

   public function updateTable($post = []) {
      $update[$post['field']] = $post['value'];

      $table = $this->db->table('tb_' . $post['table']);
      $table->where('id_journal', $post['id_journal']);
      $table->update($update);
   }

}