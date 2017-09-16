<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class Ustadz_model extends CI_Model {

    var $table = 'md_ustadz';
    var $primaryKey = 'ID_UST';

    public function __construct() {
        parent::__construct();
    }

    private function _get_table($select = true) {
        if ($select)
            $this->db->select('*, CONCAT(ALAMAT_UST, ", ", NAMA_KEC, ", ", NAMA_KAB, ", ", NAMA_PROV) AS ALAMAT_LENGKAP_UST, DATE_FORMAT(TANGGAL_LAHIR_UST, "%d-%m-%Y") AS TANGGAL_LAHIR_UST_SHOW');
        $this->db->from($this->table);
        $this->db->join('md_jenis_kelamin', 'ID_JK=JK_UST');
        $this->db->join('md_kecamatan', 'ID_KEC=KECAMATAN_UST');
        $this->db->join('md_kabupaten', 'ID_KAB=KABUPATEN_KEC');
        $this->db->join('md_provinsi', 'ID_PROV=PROVINSI_KAB');
    }

    public function get_datatable() {
        $this->_get_table();
        $data = $this->db->get()->result();

        $result = array(
            "data" => $data
        );

        return $result;
    }

    public function get_by_id($id) {
        $this->_get_table();
        $this->db->where($this->primaryKey, $id);
        $result = $this->db->get()->row_array();

        return $result;
    }
    
    public function get_all() {
        $this->db->select('ID_UST as id, CONCAT(IF(GELAR_AWAL_UST IS NOT NULL, IF(GELAR_AWAL_UST = "", CONCAT(GELAR_AWAL_UST, ". "), ""), ""), NAMA_UST, IF(GELAR_AKHIR_UST IS NOT NULL, IF(GELAR_AKHIR_UST = "", CONCAT(". ", GELAR_AKHIR_UST), ""), "")) as title');
        $this->_get_table(FALSE);
        $this->db->where('AKTIF_UST', 1);
        $result = $this->db->get();
        
        return $result->result();
    }

    public function get_data_form($id) {
        $this->db->from($this->table);
        $this->db->where($this->primaryKey, $id);
        $result = $this->db->get()->row_array();

        return $result;
    }

    public function save($data) {
        if (isset($data[$this->primaryKey])) {
            $where = array($this->primaryKey => $data[$this->primaryKey]);
            unset($data[$this->primaryKey]);
            $result = $this->update($data, $where);
        } else {
            unset($data[$this->primaryKey]);
            $result = $this->insert($data);
        }

        return $result;
    }

    public function insert($data) {
        $this->db->insert($this->table, $data);

        return $this->db->insert_id();
    }

    public function update($data, $where) {
        $this->db->update($this->table, $data, $where);

        return $this->db->affected_rows();
    }

    public function delete($id) {
        $where = array($this->primaryKey => $id);
        $this->db->delete($this->table, $where);

        return $this->db->affected_rows();
    }

}
