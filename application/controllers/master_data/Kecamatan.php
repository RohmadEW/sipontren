<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Kecamatan extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model(array(
            'kecamatan_model' => 'kecamatan'
        ));
//        $this->auth->validation();
    }

    public function index() {
        $data = array(
            'title' => 'Master Data Kecamatan',
            'subtitle' => 'Data semua kecamatan',
            'breadcrumb' => 'Master Data > Kecamatan',
            'table' => array(
                array(
                    'field' => "ID_KEC",
                    'title' => "ID", 
                    'sortable' => "ID_KEC", 
                    'show' => true,
                    'filter' => array(
                        'ID_KEC' => 'number'
                    )
                ),
                array(
                    'field' => "NAMA_KEC",
                    'title' => "Nama Kecamatan", 
                    'sortable' => "NAMA_KEC", 
                    'show' => true,
                    'filter' => array(
                        'NAMA_KEC' => 'text'
                    )
                ),
                array(
                    'field' => "NAMA_KAB",
                    'title' => "Nama Kabupaten", 
                    'sortable' => "NAMA_KAB", 
                    'show' => true,
                    'filter' => array(
                        'NAMA_KAB' => 'text'
                    )
                ),
                array(
                    'field' => "NAMA_PROV",
                    'title' => "Nama Provinsi", 
                    'sortable' => "NAMA_PROV", 
                    'show' => true,
                    'filter' => array(
                        'NAMA_PROV' => 'text'
                    )
                ),
            )
        );
        $this->output_handler->output_JSON($data);
    }
    
    public function datatable() {
        $data = $this->kecamatan->get_datatable();

        $this->output_handler->output_JSON($data);
    }

    public function data() {
        $data = $this->agama->get_datatables();

        $this->output_handler->output_JSON($data);
    }

    public function view() {
        $post = json_decode(file_get_contents('php://input'));

        $data = $this->agama->get_by_id($post->id, $this->idEditable);

        $this->output_handler->output_JSON($data);
    }

    public function save() {
        $data = json_decode(file_get_contents('php://input'), true);

        $result = $this->agama->save($data, $this->idEditable);

        if (isset($data[$this->primary_key]))
            $message = 'diubah';
        else
            $message = 'dibuat';

        $this->output_handler->output_JSON($result, $message);
    }

    public function delete() {
        $post = json_decode(file_get_contents('php://input'));

        $result = $this->agama->delete($post->id);
        $message = 'dihapus';

        $this->output_handler->output_JSON($result, $message);
    }

}
