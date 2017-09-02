<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class Kecamatan_model extends CI_Model {

    var $table = 'md_kecamatan';
    var $primaryKey = 'ID_KEC';

    public function __construct() {
        parent::__construct();
    }

    private function _get_table() {
        $this->db->from($this->table);
        $this->db->join('md_kabupaten', 'KABUPATEN_KEC=ID_KAB');
        $this->db->join('md_provinsi', 'PROVINSI_KAB=ID_PROV');
    }

    public function get_datatable() {
        $this->_get_table();
        $data = $this->db->get()->result();
        
        $result = array(
            "data" => $data
        );

        return $result;
    }

    public function get_by_id($id, $idEditable = FALSE) {
        $this->_get_table();
        $this->db->where($this->primaryKey, $id);
        $result = $this->db->get()->row_array();
        
        if($idEditable) $result['OLD_ID'] = $result[$this->primaryKey];
        
        return $result;
    }
    
    public function save($data, $idEditable = FALSE) {
        if (isset($data[$this->primaryKey])) {
            $where = array($this->primaryKey => $data['OLD_ID']);
            unset($data['OLD_ID']);
            if (!$idEditable) unset($data[$this->primaryKey]);
            $result = $this->update($data, $where);
        } else {
            unset($data[$this->primaryKey]);
            unset($data['OLD_ID']);
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
