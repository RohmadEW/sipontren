<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class Peminjaman_model extends CI_Model {

    var $table = 'akad_santri';
    var $primaryKey = 'ID_AS';

    public function __construct() {
        parent::__construct();
    }

    public function proses_peminjaman($data) {
        foreach ($data['DATA_PINJAMAN'] as $id_buku) {
            $data = array(
                'TA_PINJAM' => $this->session->userdata('ID_TA'),
                'SANTRI_PINJAM' => $data['ID_SANTRI'],
                'BUKU_PINJAM' => $id_buku,
                'TANGGAL_PINJAM' => $this->datetime_handler->date_to_store('Y-m-d', TRUE),
                'USER_PINJAM' => $this->session->userdata('ID_USER')
            );
            
            $result = $this->db->insert('perpus_santri', $data);
        }
        
        return $result;
    }

}
