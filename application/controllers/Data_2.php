<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Data_2 extends CI_Controller {

    public function data() {
        $input = (object) $this->input->post();

        $this->db->from('data_2');
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
                    'id' => 'gender',
                    'title' => 'Gender',
                    'filter' => array(
                        'type' => 'select',
                        'values' => array(
                            array('value' => 'Male', 'label' => 'Male'),
                            array('value' => 'Female', 'label' => 'Female')
                        )
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
            'url' => 'data_2/data',
            "title" => "Data 2",
            "subTitle" => "Detail Data 2",
            "boxTitle" => "Tabel Data 2",
        );

        echo json_encode($data);
    }

}
