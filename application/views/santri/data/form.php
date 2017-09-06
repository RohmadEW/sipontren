<?php
defined('BASEPATH') OR exit('No direct script access allowed');
$this->auth->validation();

$title = 'Kamar';
$message = 'Menambahkan data santri baru dapat dilakukan di menu <strong>PSB</strong> -> <strong>DATA</strong>';

$this->output_handler->dialog_info($title, $message);

?>