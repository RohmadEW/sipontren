<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Data_1 extends CI_Controller {

    public function data() {
        $input = (object) $this->input->post();

        $this->db->from('data_1');
        $this->db->limit($input->length, $input->start);
        $result = $this->db->get()->result();

        $dt = array(
            "draw" => $input->draw,
            "recordsTotal" => 1000,
            "recordsFiltered" => 600,
            "data" => $result
        );

        echo json_encode($dt);
    }

    public function info() {
        $data = array(
            'columns' => array(
                array(
                    'id' => 'id',
                    'title' => 'ID',
                    'filter' => array(
                        'type' => 'text'
                    )
                ),
                array(
                    'id' => 'first_name',
                    'title' => 'First Name',
                    'filter' => array(
                        'type' => 'text'
                    )
                ),
                array(
                    'id' => 'last_name',
                    'title' => 'Last Name',
                    'filter' => array(
                        'type' => 'text'
                    )
                ),
                array(
                    'id' => 'ip_address',
                    'title' => 'IP Address',
                    'filter' => array(
                        
                    )
                ),
                array(
                    'id' => NULL,
                    'title' => 'Aksi',
                    'unsortable' => true,
                    'render' => array(
                        array('function' => 'edit', 'title' => 'Edit', 'fa' => 'edit', 'class' => 'primary')
                    ),
                    'filter' => array(
                        
                    )
                ),
            ),
            'url' => 'data_1/data',
            "title" => "Data 1",
            "subTitle" => "Detail Data 1",
            "boxTitle" => "Tabel Data 1",
        );

        echo json_encode($data);
    }

}
