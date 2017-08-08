<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Agama extends CI_Controller
{

    var $controller = 'agama';
    var $primary_key = "ID_AGAMA";
    var $idEditable = false;
    var $idInsertable = false;

    public function __construct()
    {
        parent::__construct();
        $this->load->model(array(
            'agama_model' => 'agama'
        ));
        $this->auth->validation();
    }

    public function data()
    {
        $data = $this->agama->get_datatables();

        $this->output_handler->output_JSON($data);
    }

    public function info()
    {
        $data = array(
            'columns' => array(
                array(
                    'id' => 'ID_AGAMA',
                    'title' => 'ID',
                    'filter' => array(
                        'type' => 'text'
                    )
                ),
                array(
                    'id' => 'NAMA_AGAMA',
                    'title' => 'NAMA AGAMA',
                    'filter' => array(
                        'type' => 'text'
                    )
                ),
                array(
                    'id' => NULL,
                    'title' => 'Aksi',
                    'unsortable' => true,
                    'render' => array(
                        array('type' => 'modal', 'function' => 'editRow', 'title' => 'Edit', 'fa' => 'edit', 'class' => 'primary', 'pk' => $this->primary_key),
                        array('type' => 'ng', 'function' => 'deleteRow', 'title' => 'Hapus', 'fa' => 'remove', 'class' => 'danger', 'pk' => $this->primary_key),
                    ),
                    'filter' => array()
                ),
            ),
            'modal' => array(
                'form' => array(
                    array(
                        'type' => 'section',
                        'htmlClass' => 'row',
                        'items' => array(
                            array(
                                'type' => 'section',
                                'htmlClass' => 'col-sm-6 border-right',
                                'items' => array(
                                    array(
                                        "key" => "ID_AGAMA",
                                        "type" => "number",
                                        "title" => "ID Agama"
                                    ),
                                )
                            ),
                            array(
                                'type' => 'section',
                                'htmlClass' => 'col-sm-6',
                                'items' => array(
                                    array(
                                        "key" => "NAMA_AGAMA",
                                        "type" => "text",
                                        "title" => "Nama Agama",
                                    ),
                                )
                            ),
                        )
                    )
                ),
                'schema' => array(
                    "type" => "object",
                    "title" => "Comment",
                    "properties" => array(
                        "ID_AGAMA" => array(
                            "title" => "ID Agama",
                            "type" => "number"
                        ),
                        "NAMA_AGAMA" => array(
                            "title" => "Nama Agama",
                            "type" => "string",
                            "description" => "Agama yang diakui oleh Negara"
                        ),
                    ),
                    "required" => array(
                        "NAMA_AGAMA"
                    )
                )
            ),
            'urlDatatables' => '/data',
            'urlCreate' => '/create',
            'urlSave' => '/save',
            'urlDelete' => '/delete',
            'urlView' => '/view/',
            "title" => "Agama",
            "titleAdd" => "Tambah Agama",
            "titleEdit" => "Ubah Agama",
            "subTitle" => "Detail Agama",
            "boxTitle" => "Tabel Agama",
            "requestAdd" => true,
            "idEditable" => $this->idEditable,
            "idInsertable" => $this->idInsertable,
            "id" => $this->primary_key,
            'titlePage' => 'Agama - SIMAPES'
        );

        $this->output_handler->output_JSON($data);
    }

    public function view()
    {
        $post = json_decode(file_get_contents('php://input'));

        $data = $this->agama->get_by_id($post->id);

        $this->output_handler->output_JSON($data);
    }

    public function save()
    {
        $data = json_decode(file_get_contents('php://input'), true);

        if (isset($data[$this->primary_key])) {
            $where = array($this->primary_key => $data[$this->primary_key]);
            if (!$this->idEditable) unset($data[$this->primary_key]);
            $result = $this->agama->update($data, $where);
            $message = 'diubah';
        } else {
            $result = $this->agama->insert($data);
            $message = 'dibuat';
        }

        $this->output_handler->output_JSON($result, $message);
    }

    public function delete()
    {
        $post = json_decode(file_get_contents('php://input'));

        $result = $this->agama->delete($post->id);
        $message = 'dihapus';

        $this->output_handler->output_JSON($result, $message);
    }

}
