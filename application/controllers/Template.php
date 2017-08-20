<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Template extends CI_Controller {

    public function show($view) {
//        $this->auth->log_out();
        $view = str_replace('-', '/', $view);

        $this->load->view($view);
    }

    public function menu() {
        $data = array();
        $data['name_app'] = 'SIMAPES';
//        if ($this->auth->check_validation())
        $data['menus'] = array(
            array('title' => 'Home', 'childMenus' => array(
                    array('link' => 'template-content/user/home', 'title' => 'Home')
                )),
            array('title' => 'Master Data', 'childMenus' => array(
                    array('link' => 'master_data-agama/master_data/agama', 'title' => 'Agama')
                )),
            array('title' => 'Data', 'childMenus' => array(
                    array('link' => 'template-datatables/data_1', 'title' => 'Data 1', 'haveChild' => FALSE),
                    array('link' => 'template-datatables/data_2', 'title' => 'Data 2', 'haveChild' => TRUE, 'childMenuChilds' => array(
                        array('link' => 'template-datatables/master_data/agama', 'title' => 'Home')
                    )),
                )),
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
