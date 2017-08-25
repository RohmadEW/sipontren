<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Kabupaten extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model(array(
            'kabupaten_model' => 'kabupaten'
        ));
        $this->auth->validation();
    }

    public function index() {
        $data = array(
            'title' => 'Master Data Kecamatan',
            'subtitle' => 'Data semua kabupaten',
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
        $data = $this->kabupaten->get_datatable();

        $this->output_handler->output_JSON($data);
    }
    
    public function form() {
        $data = array(
            'uri' => array(
                'kabupaten' => site_url('master_data/kabupaten/get_all')
            )
        );
        
        $this->output_handler->output_JSON($data);
    }

    public function get_all() {
        $data = $this->kabupaten->get_all();

        $this->output_handler->output_JSON($data);
    }

    public function view() {
        $post = json_decode(file_get_contents('php://input'));

        $data = $this->kabupaten->get_by_id($post->id, $this->idEditable);

        $this->output_handler->output_JSON($data);
    }

    public function save() {
        $data = json_decode(file_get_contents('php://input'), true);

        $result = $this->kabupaten->save($data, $this->idEditable);

        if (isset($data[$this->primary_key]))
            $message = 'diubah';
        else
            $message = 'dibuat';

        $this->output_handler->output_JSON($result, $message);
    }

    public function delete() {
        $post = json_decode(file_get_contents('php://input'));

        $result = $this->kabupaten->delete($post->id);
        $message = 'dihapus';

        $this->output_handler->output_JSON($result, $message);
    }

}
