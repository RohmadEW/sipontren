<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Template extends CI_Controller {

    public function show($view) {
        $this->load->view('template/' . $view);
    }

    public function menu() {
        $data = array(
            'name_app' => 'SIMAPES',
            'menu' => array(
                array('link' => 'home/home', 'title' => 'Home'),
                array('link' => 'datatables/data_1', 'title' => 'Data 1'),
                array('link' => 'datatables/data_2', 'title' => 'Data 2'),
            )
        );

        echo json_encode($data);
    }

    public function info() {
        $data = array(
            'name_dev' => 'Rohmad Eko Wahyudi',
            'email_dev' => 'rohmad.ew@gmail.com',
            'version' => '1.1.0',
            'github' => 'https://github.com/RohmadEW/simapes'
        );

        echo json_encode($data);
    }

}
