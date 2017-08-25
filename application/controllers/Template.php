<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Template extends CI_Controller {

    public function show($view) {
//        $this->auth->log_out();
        $view = str_replace('-', '/', $view);

        if (substr($view, -14) == 'datatable.html')
            $view = 'template/datatable.html';
        
       $view = str_replace('html', 'php', $view);

        $this->load->view($view);
    }

    public function menu() {
        $data = array();
        $data['name_app'] = 'SIPONTREN';
        
        if ($this->auth->check_validation())
            $data['menus'] = array(
                array('title' => 'Home', 'childMenus' => array(
                        array('link' => 'template-content/index/user/home', 'title' => 'Home')
                    )),
                array('title' => 'Master Data', 'childMenus' => array(
                        array('link' => 'master_data-agama/datatable/master_data/agama', 'title' => 'Agama'),
                        array('link' => '#', 'title' => 'Wilayah', 'haveChild' => TRUE, 'childMenuChilds' => array(
                                array('link' => 'master_data-kecamatan/datatable/master_data/kecamatan', 'title' => 'Kecamatan')
                            )),
                    )),
                array('title' => 'Data', 'childMenus' => array(
                        array('link' => 'data-data_1/data/data_1', 'title' => 'Data 1', 'haveChild' => FALSE),
                        array('link' => 'template-datatables/data_2', 'title' => 'Data 2', 'haveChild' => TRUE, 'childMenuChilds' => array(
                                array('link' => 'template-datatables/master_data/agama', 'title' => 'Home')
                            )),
                    )),
            );
        else
            show_error('Anda tidak memiliki akses pada halaman ini', '403', 'Silahkan login terlebih dahulu.');

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
