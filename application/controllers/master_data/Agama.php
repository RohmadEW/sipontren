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
//        $this->auth->validation();
    }

    public function index() {
        $data = array(
            'title' => 'Master Data Agama',
            'subtitle' => 'Data semua agama',
            'breadcrumb' => 'Master Data > Agama'
        );
        $this->output_handler->output_JSON($data);
    }
    
    public function datatable() {
        
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
