<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Agama extends CI_Controller {

    var $controller = 'agama';
    var $primary_key = "ID_AGAMA";
    var $idEditable = true;
    var $idInsertable = false;

    public function __construct() {
        parent::__construct();
        $this->load->model(array(
            'agama_model' => 'agama'
        ));
        $this->auth->validation();
    }

    public function index() {
        $data = array(
            'title' => 'Master Data Agama',
            'subtitle' => 'Data semua agama',
            'breadcrumb' => 'Master Data > Agama',
            'table' => array(
                array(
                    'field' => "ID_AGAMA",
                    'title' => "ID", 
                    'sortable' => "ID_AGAMA", 
                    'show' => true,
                    'filter' => array(
                        'ID_AGAMA' => 'number'
                    )
                ),
                array(
                    'field' => "NAMA_AGAMA",
                    'title' => "Nama Agama", 
                    'sortable' => "NAMA_AGAMA", 
                    'show' => true,
                    'filter' => array(
                        'NAMA_AGAMA' => 'text'
                    )
                ),
            )
        );
        $this->output_handler->output_JSON($data);
    }
    
    public function datatable() {
        $data = $this->agama->get_datatable();

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
