<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class Agama_model extends CI_Model {

    var $table = 'md_agama';
    var $column = array('ID_AGAMA', 'NAMA_AGAMA', 'ID_AGAMA');
    var $primary_key = "ID_AGAMA";
    var $order = array("ID_AGAMA" => 'ASC');

    public function __construct() {
        parent::__construct();
    }

    private function _get_table() {
        $this->db->from($this->table);
    }

    public function get_datatables() {
        $this->_get_table();
        $recordsTotal = $this->datatables_handler->count_all($this->table);

        $this->_get_table();
        $recordsFiltered = $this->datatables_handler->count_filtered($this->column, $this->order);

        $this->_get_table();
        $data = $this->datatables_handler->get_datatables($this->column, $this->order);

        $result = array(
            "draw" => $_POST['draw'],
            "recordsTotal" => $recordsTotal,
            "recordsFiltered" => $recordsFiltered,
            "data" => $data
        );

        return $result;
    }

    public function get_by_id($id) {
        $this->_get_table();
        $this->db->where($this->primary_key, $id);

        return $this->db->get()->row();;
    }

    public function save($data) {
        $this->db->insert($this->table, $data);

        return $this->db->insert_id();
    }

    public function update($where, $data) {
        $this->db->update($this->table, $data, $where);
        
        return $this->db->affected_rows();
    }

    public function delete($id) {
        $where = array($this->primary_key => $id);
        $this->db->delete($this->table, $where);
        
        return $this->db->affected_rows();
    }

}
