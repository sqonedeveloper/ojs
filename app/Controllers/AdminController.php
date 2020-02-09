<?php namespace App\Controllers;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;
use App\Controllers\BaseController;

class AdminController extends BaseController {

   public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger) {
      parent::initController($request, $response, $logger);
   }

   public function template($content = []) {
      $internalCss = $this->internalCss($content);

      $internalJs[] = [
         'http://localhost:8080/vendor.js',
         'http://localhost:8080/header.js',
         'http://localhost:8080/sidebar.js',
      ];
      $internalJs[] = $this->internalJs($content);

      $footerJs = $this->footerJs($content);
      $footerJs['navigation'] = $this->_navigation();
      /* $footerJs['users'] = [
         'nama' => $this->nama,
         'avatar' => $this->avatar,
         'email' => $this->email
      ]; */

      $data['title'] = $content['title'];
      $data['internalCss'] = css_tag($internalCss);
      $data['internalJs'] = script_tag($internalJs);
      $data['footerJs'] = json_encode(array_merge($footerJs));
      $data['segment'] = $this->setSegment();
      $data['pageType'] = @$content['pageType'];

      echo view('Admin', $data);
   }

   private function _navigation() {
      $config = [
         [
            'label' => 'Dashboard',
            'icon' => 'mdi mdi-home',
            'active' => ['dashboard'],
            'url' => '/admin/dashboard',
            'sub' => false
         ],
         [
            'label' => 'Calon Mahasiswa',
            'icon' => 'mdi mdi-home',
            'active' => ['calonMahasiswa'],
            'url' => '/admin/calonMahasiswa',
            'sub' => false
         ],
         [
            'label' => 'Ruang Ujian PMB',
            'icon' => 'mdi mdi-home',
            'active' => ['ruangUjian'],
            'url' => '#',
            'sub' => true,
            'child' => [
               [
                  'label' => 'Ruangan IPA',
                  'url' => '/admin/ruangUjian/ipa',
                  'active' => ['ipa'],
                  'sub' => false
               ],
               [
                  'label' => 'Ruangan IPS',
                  'url' => '/admin/ruangUjian/ips',
                  'active' => ['ips'],
                  'sub' => false
               ],
               [
                  'label' => 'Ruangan IPC',
                  'url' => '/admin/ruangUjian/ipc',
                  'active' => ['ipc'],
                  'sub' => false
               ]
            ]
         ],
         [
            'label' => 'Import Kelulusan',
            'icon' => 'mdi mdi-home',
            'active' => ['importKelulusan'],
            'url' => '/admin/importKelulusan',
            'sub' => false
         ],
         [
            'label' => 'Verifikasi Biodata',
            'icon' => 'mdi mdi-home',
            'active' => ['verifikasiBiodata'],
            'url' => '#',
            'sub' => true,
            'child' => [
               [
                  'label' => 'Calon Mahasiswa',
                  'url' => '/admin/verifikasiBiodata/calonMahasiswa',
                  'active' => ['calonMahasiswa'],
                  'sub' => false
               ],
               [
                  'label' => 'Terverifikasi',
                  'url' => '/admin/verifikasiBiodata/terverifikasi',
                  'active' => ['terverifikasi'],
                  'sub' => false
               ],
            ]
         ],
         [
            'label' => 'Verifikasi UKTB',
            'icon' => 'mdi mdi-home',
            'active' => ['verifikasiUktb'],
            'url' => '/admin/verifikasiUktb',
            'sub' => false
         ],
         [
            'label' => 'Daftar Pembayaran',
            'icon' => 'mdi mdi-home',
            'active' => ['daftarPembayaran'],
            'url' => '#',
            'sub' => true,
            'child' => [
               [
                  'label' => 'Ujian PMB',
                  'url' => '/admin/daftarPembayaran/ujiainPmb',
                  'active' => ['ujiainPmb'],
                  'sub' => false
               ],
               [
                  'label' => 'SPP dan UKT',
                  'url' => '/admin/daftarPembayaran/sppDanUkt',
                  'active' => ['sppDanUkt'],
                  'sub' => false
               ],
            ]
         ],
         [
            'label' => 'Konfigurasi PMB',
            'icon' => 'mdi mdi-home',
            'active' => ['konfigurasiPmb'],
            'url' => '#',
            'sub' => true,
            'child' => [
               [
                  'label' => 'Jumlah Kuota PMB',
                  'url' => '/admin/konfigurasiPmb/jumlahKuotaPmb',
                  'active' => ['jumlahKuotaPmb'],
                  'sub' => false
               ],
               [
                  'label' => 'Informasi & Jadwal',
                  'url' => '#',
                  'active' => ['sppDanUkt'],
                  'sub' => true,
                  'child' => [
                     [
                        'label' => 'UM-PTKIN',
                        'url' => '/admin/konfigurasiPmb/informasiDanJadwal/umPtkin',
                        'active' => ['umPtkin']
                     ],
                     [
                        'label' => 'SPAN PTKIN',
                        'url' => '/admin/konfigurasiPmb/informasiDanJadwal/spanPtkin',
                        'active' => ['spanPtkin']
                     ],
                     [
                        'label' => 'Undangan Lokal',
                        'url' => '/admin/konfigurasiPmb/informasiDanJadwal/undenganLokal',
                        'active' => ['undenganLokal']
                     ],
                     [
                        'label' => 'PMB Lokal',
                        'url' => '/admin/konfigurasiPmb/informasiDanJadwal/pmbLokal',
                        'active' => ['pmbLokal']
                     ],
                     [
                        'label' => 'SBMPTN',
                        'url' => '/admin/konfigurasiPmb/informasiDanJadwal/sbmptn',
                        'active' => ['sbmptn']
                     ],
                     [
                        'label' => 'SNMPTN',
                        'url' => '/admin/konfigurasiPmb/informasiDanJadwal/snmptn',
                        'active' => ['snmptn']
                     ],
                     [
                        'label' => 'Luar Negeri',
                        'url' => '/admin/konfigurasiPmb/informasiDanJadwal/luarNegeri',
                        'active' => ['luarNegeri']
                     ],
                     [
                        'label' => 'Lanjut Studi',
                        'url' => '/admin/konfigurasiPmb/informasiDanJadwal/lanjutStudi',
                        'active' => ['lanjutStudi']
                     ],
                     [
                        'label' => 'Pascasarjana',
                        'url' => '/admin/konfigurasiPmb/informasiDanJadwal/pascasarjana',
                        'active' => ['pascasarjana']
                     ],
                     [
                        'label' => 'Pindahan',
                        'url' => '/admin/konfigurasiPmb/informasiDanJadwal/pindahan',
                        'active' => ['pindahan']
                     ],
                  ]
               ],
               [
                  'label' => 'List Informasi & Jadwal',
                  'url' => '/admin/konfigurasiPmb/listInformasiDanJadwal',
                  'active' => ['listInformasiDanJadwal'],
                  'sub' => false
               ],
            ]
         ],
      ];
      return $config;
   }

}