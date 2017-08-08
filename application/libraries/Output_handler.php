<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Output_handler
{
    public function __construct()
    {
        $this->CI = &get_instance();
    }

    public function set_header_JSON()
    {
        if (!$this->CI->input->is_ajax_request()) {
            show_error("Your request is not valid", "403", "ERROR");
        } else {
            header('Content-Type: application/json');
        }
    }

    public function output_JSON($data, $standar_notification = null)
    {
        if (is_object($data)) $data = (array) $data;

        if (is_array($data))
            array_walk($data, function (&$value) {
                if (ctype_digit($value)) {
                    $value = (int)$value;
                }
            });

        if ($standar_notification != null) {
            $status = $data;

            $data = array(
                'status' => $status
            );

            if ($status)
                $data['notification'] = array(
                    'type' => 'success',
                    'title' => 'Berhasil',
                    'text' => 'Data berhasil ' . $standar_notification
                );
            else
                $data['notification'] = array(
                    'type' => 'error',
                    'title' => 'Gagal',
                    'text' => 'Data gagal ' . $standar_notification
                );
        }

        echo json_encode($data, JSON_PRETTY_PRINT);

        exit();
    }
}