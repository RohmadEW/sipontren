<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Login extends CI_Controller {

    public function __construct() {
        parent::__construct();
    }

    public function proccess() {
        $post = json_decode(file_get_contents('php://input'));

        $result = $this->auth->proccess_login($post);

        $this->output_handler->output_JSON($result);
    }

    public function logout() {
        $this->auth->log_out();

        $result = array(
            'status' => TRUE,
            'notification' => array(
                'type' => 'success',
                'title' => 'Berhasil',
                'text' => 'Anda berhasil keluar.'
            )
        );

        $this->output_handler->output_JSON($result);
    }

    public function check_session() {
        $result = $this->auth->check_login();

        $this->output_handler->output_JSON($result);
    }

}
