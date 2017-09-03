<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Data extends CI_Controller {
    
    var $primaryKey = 'ID_SANTRI';

    public function __construct() {
        parent::__construct();
        $this->load->model(array(
            'data_psb_model' => 'data_psb'
        ));
        $this->auth->validation(array(1, 2));
    }

    public function index() {
        $data = array(
            'title' => 'Data PSB',
            'breadcrumb' => 'PSB > Data',
            'table' => array(
                array(
                    'field' => "ID_SANTRI",
                    'title' => "ID", 
                    'sortable' => "ID_SANTRI", 
                    'show' => FALSE,
                    'filter' => array(
                        'ID_SANTRI' => 'number'
                    )
                ),
                array(
                    'field' => "NAMA_SANTRI",
                    'title' => "Nama Santri", 
                    'sortable' => "NAMA_SANTRI", 
                    'show' => true,
                    'filter' => array(
                        'NAMA_SANTRI' => 'text'
                    )
                ),
                array(
                    'field' => "TEMPAT_LAHIR_SANTRI",
                    'title' => "Tempat Lahir", 
                    'sortable' => "TEMPAT_LAHIR_SANTRI", 
                    'show' => true,
                    'filter' => array(
                        'TEMPAT_LAHIR_SANTRI' => 'text'
                    )
                ),
                array(
                    'field' => "TANGGAL_LAHIR_SANTRI",
                    'title' => "Tanggal Lahir", 
                    'sortable' => "TANGGAL_LAHIR_SANTRI", 
                    'show' => true,
                    'filter' => array(
                        'TANGGAL_LAHIR_SANTRI' => 'text'
                    )
                ),
                array(
                    'field' => "ALAMAT_SANTRI",
                    'title' => "Alamat", 
                    'sortable' => "ALAMAT_SANTRI", 
                    'show' => true,
                    'filter' => array(
                        'ALAMAT_SANTRI' => 'text'
                    )
                ),
                array(
                    'field' => "NOHP_SANTRI",
                    'title' => "No HP", 
                    'sortable' => "NOHP_SANTRI", 
                    'show' => true,
                    'filter' => array(
                        'NOHP_SANTRI' => 'text'
                    )
                ),
                array(
                    'field' => "AYAH_NAMA_SANTRI",
                    'title' => "Nama Ayah", 
                    'sortable' => "AYAH_NAMA_SANTRI", 
                    'show' => true,
                    'filter' => array(
                        'AYAH_NAMA_SANTRI' => 'text'
                    )
                ),
                array(
                    'field' => "ACTION",
                    'title' => "Aksi", 
                    'actions' => array(
                        array(
                            'title' => 'Ubah',
                            'update' => true
                        ),
                        array(
                            'title' => 'Hapus',
                            'delete' => true
                        )
                    )
                ),
            )
        );
        $this->output_handler->output_JSON($data);
    }
    
    public function datatable() {
        $data = $this->data_psb->get_datatable();

        $this->output_handler->output_JSON($data);
    }
    
    public function form() {
        $data = array(
            'uri' => array(
                'kecamatan' => site_url('master_data/kecamatan/get_all')
            )
        );
        
        $this->output_handler->output_JSON($data);
    }

    public function data() {
        $data = $this->data_psb->get_datatables();

        $this->output_handler->output_JSON($data);
    }

    public function view() {
        $post = json_decode(file_get_contents('php://input'), true);

        $data = $this->data_psb->get_by_id($post[$this->primaryKey]);

        $this->output_handler->output_JSON($data);
    }

    public function save() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $result = $this->data_psb->save($data);

        if (isset($data[$this->primaryKey]))
            $message = 'diubah';
        else
            $message = 'dibuat';

        $this->output_handler->output_JSON($result, $message);
    }

    public function delete() {
        $post = json_decode(file_get_contents('php://input'), true);

        $result = $this->data_psb->delete($post[$this->primaryKey]);
        $message = 'dihapus';

        $this->output_handler->output_JSON($result, $message);
    }

}