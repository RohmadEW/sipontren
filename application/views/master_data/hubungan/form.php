<?php
defined('BASEPATH') OR exit('No direct script access allowed');
$this->auth->validation();

$title = 'Hubunga Wali dengan Santri';
$controller = 'mdHubungan';
$data = array(
    array(
        'type' => 'text',
        'field' => 'NAMA_HUB',
        'label' => 'Nama Jenis Kelamin'
    ),
    array(
        'type' => 'text',
        'field' => 'KODE_EMIS_HUB',
        'label' => 'Kode EMIS'
    ),
);

$this->output_handler->dialog_form($title, $controller, $data);

?>