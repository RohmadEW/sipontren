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
            'modal' => array(
                'add' => array(
                    'form' => array(
                        array(
                            "key" => "first_name",
                            "type" => "text",
                            "title" => "Nama Depan",
                            "placeholder" => "Nama Lengkap Anda"
                        ),
                        array(
                            "key" => "last_name",
                            "type" => "text",
                            "title" => "Nama Belakang",
                            "placeholder" => "Nama Belakang Anda"
                        )
                    ),
                    'schema' => array(
                        "type" => "object",
                        "title" => "Comment",
                        "properties" => array(
                            "name" => array(
                                "title" => "first_name",
                                "type" => "string"
                            ),
                            "last_name" => array(
                                "title" => "Jenis Kelamin",
                                "type" => "string",
                                "description" => "Nama Belakang Anda"
                            ),
                        ),
                        "required" => array(
                            "first_name",
                            "last_name",
                        )
                    ),
                )
            ),
            'urlDatatables' => 'data_1/data',
            'urlCreate' => 'data_1/create',
            'urlUpdate' => 'data_1/update',
            'urlDelete' => 'data_1/delete',
            'urlView' => 'data_1/view/',
            "title" => "Data 1",
            "subTitle" => "Detail Data 1",
            "boxTitle" => "Tabel Data 1",
            "requestAdd" => true
        );

        echo json_encode($data);
    }
    
    public function view() {
        $post = json_decode(file_get_contents('php://input'));
        
        $this->db->from('data_1');
        $this->db->where('id', $post->id);
        $result = $this->db->get()->row();

        echo json_encode($result);
    }
    
    public function delete($id) {
        $where = array('id' => $id);
        $this->db->delete('data_1', $where);
        
        $result = $this->db->affected_rows();
        
        echo json_encode(array('status' => $result));
    }

}
