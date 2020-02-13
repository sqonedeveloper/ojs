<?php namespace App\Validation\Admin;

class Journals {

   public $pageType = [
      'pageType' => 'required|in_list[createJournal]'
   ];

   public function generated($post = []) {
      return array_merge($this->pageType, $this->{$post['pageType']}($post));
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