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
            'urlDatatables' => 'data_2/data',
            'urlCreate' => 'data_2/create',
            'urlUpdate' => 'data_2/update',
            'urlDelete' => 'data_2/delete',
            'urlView' => 'data_2/view/',
            "title" => "Data 2",
            "subTitle" => "Detail Data 2",
            "boxTitle" => "Tabel Data 2",
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
