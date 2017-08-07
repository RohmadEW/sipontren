<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Template extends CI_Controller
{

    public function show($view)
    {
//        $this->auth->log_out();
        $view = str_replace('-', '/', $view);

        $this->load->view($view);
    }

    public function menu()
    {
        $data = array();
        $data['name_app'] = 'SIMAPES';
        $data['menu'] = array();
        if ($this->auth->check_validation())
            $data['menu'] = array(
                array('link' => 'template-home/home', 'title' => 'Home'),
                array('link' => 'template-datatables/data_1', 'title' => 'Data 1'),
                array('link' => 'template-datatables/data_2', 'title' => 'Data 2'),
            );

        echo json_encode($data);
    }

    public function info()
    {
        $data = array(
            'name_dev' => 'Rohmad Eko Wahyudi',
            'email_dev' => 'rohmad.ew@gmail.com',
            'version' => '1.1.0',
            'github' => 'https://github.com/RohmadEW/simapes'
        );

        echo json_encode($data);
    }

}
