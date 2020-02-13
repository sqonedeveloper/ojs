<?php

function settings($key) {
   $db = \Config\Database::connect();

   $table = $db->table('tb_settings');
   $table->select($key);
   $query = $table->get();
   $data = $query->getRowArray();

   return $data[$key];
}

function userStatus($key) {
   $config = [
      't' => 'Active',
      'f' => 'Suspend'
   ];

   return $config[$key];
}

function fullname($first, $last) {
   $html = $first;
   if (!empty($last) || $last !== '') {
      $html .= ' ';
      $html .= $last;
   }

   return $html;
}