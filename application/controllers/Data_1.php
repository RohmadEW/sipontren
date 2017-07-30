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
                        array('function' => 'modalOpen', 'title' => 'Edit', 'fa' => 'edit', 'class' => 'primary')
                    ),
                    'filter' => array(
                    )
                ),
            ),
            'urlDatatables' => 'data_1/data',
            'form' => 'data_1/form',
            "title" => "Data 1",
            "subTitle" => "Detail Data 1",
            "boxTitle" => "Tabel Data 1",
            "requestAdd" => true
        );

        echo json_encode($data);
    }

    public function form() {
        $data = array(
            'form' => array(
                array(
                    "key" => "name",
                    "type" => "text",
                    "title" => "Nama Lengkap",
                    "placeholder" => "Nama Lengkap Anda"
                ),
                array(
                    "key" => "gender",
                    "type" => "text",
                    "title" => "Jenis Kelamin",
                    "placeholder" => "Jenis Kelamin"
                )
            ),
            'schema' => array(
                "type" => "object",
                "title" => "Comment",
                "properties" => array(
                    "name" => array(
                        "title" => "Name",
                        "type" => "string"
                    ),
                    "gender" => array(
                        "title" => "Jenis Kelamin",
                        "type" => "string",
                        "description" => "Jenis Kelamin Anda"
                    ),
                ),
                "required" => array(
                    "name",
                    "gender",
                )
            ),
            'model' => array(
            )
        );

        echo json_encode($data, JSON_PRETTY_PRINT);
    }

}
