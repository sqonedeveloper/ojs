<?php namespace App\Validation\Admin;

class Journals {

   public $pageType = [
      'pageType' => 'required|in_list[createJournal,masthead,contact,apperance,updateTable,submission,indexing]'
   ];

   public $id = [
      'id' => 'required|numeric'
   ];
   
   public $initial = [
      'initial' => 'required'
   ];

   public function generated($post = []) {
      return array_merge($this->pageType, $this->{$post['pageType']}($post));
   }

   public function indexing() {
      return $this->id;
   }
   
   public function submission() {
      return $this->id;
   }

   public function updateTable() {
      return [
         'id_journal' => 'required|numeric',
         'field' => 'required',
         'value' => 'required',
         'table' => 'required'
      ];
   }

   public function apperance() {
      return $this->id;
   }

   public function contact() {
      return array_merge($this->id, [
         'name' => [
            'rules' => 'required',
            'label' => 'name'
         ],
         'email' => [
            'rules' => 'required|valid_email',
            'label' => 'email'
         ],
      ]);
   }

   public function masthead() {
      return array_merge($this->id, [
         'journal_name' => [
            'rules' => 'required',
            'label' => 'journal name'
         ],
         'initial' => [
            'rules' => 'required',
            'label' => 'journal initial'
         ]
      ]);
   }

   public function createJournal() {
      return [
         'name' => [
            'rules' => 'required',
            'label' => 'journal title'
         ],
         'initial' => [
            'rules' => 'required|checkDuplicateJournalInitial',
            'label' => 'journal path'
         ]
      ];
   }

}