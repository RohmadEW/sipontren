<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class Kabupaten_model extends CI_Model {

    var $table = 'md_kabupaten';

    public function __construct() {
        parent::__construct();
    }

    private function _get_table() {
        $this->db->from($this->table);
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
    
    public function get_all() {
        $this->db->select('ID_KAB as id, CONCAT(NAMA_KAB, ", ", NAMA_PROV) as label');
        $this->_get_table();
        $result = $this->db->get();
        
        return $result->result();
    }

    public function get_by_id($id, $idEditable = FALSE) {
        $this->_get_table();
        $this->db->where($this->primary_key, $id);
        $result = $this->db->get()->row_array();
        
        if($idEditable) $result['OLD_ID'] = $result[$this->primary_key];
        
        return $result;
    }
    
    public function save($data, $idEditable = FALSE) {
        if (isset($data[$this->primary_key])) {
            $where = array($this->primary_key => $data['OLD_ID']);
            unset($data['OLD_ID']);
            if (!$idEditable) unset($data[$this->primary_key]);
            $result = $this->update($data, $where);
        } else {
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
        $where = array($this->primary_key => $id);
        $this->db->delete($this->table, $where);
        
        return $this->db->affected_rows();
    }

}
