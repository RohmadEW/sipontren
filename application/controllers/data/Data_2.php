<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Data_2 extends CI_Controller {

    public function data() {
        $input = (object) $this->input->post();

        $this->db->from('data_2');
        $this->db->limit($input->length, $input->start);
        $result = $this->db->get()->result();

        $dt = array(
            "draw" => $input->draw,
            "recordsTotal" => 1000,
            "recordsFiltered" => 600,
            "data" => $result
        );

        echo json_encode($dt);
    }

    public function info() {
        $data = array(
            'columns' => array(
                array(
                    'id' => 'id',
                    'title' => 'ID',
                    'filter' => array(
                        'type' => 'text'
                    )
                ),
                array(
                    'id' => 'first_name',
                    'title' => 'First Name',
                    'filter' => array(
                        'type' => 'text'
                    )
                ),
                array(
                    'id' => 'last_name',
                    'title' => 'Last Name',
                    'filter' => array(
                        'type' => 'text'
                    )
                ),
                array(
                    'id' => 'ip_address',
                    'title' => 'IP Address',
                    'filter' => array(
                    )
                ),
                array(
                    'id' => NULL,
                    'title' => 'Aksi',
                    'unsortable' => true,
                    'render' => array(
                        array('function' => 'modalOpen', 'title' => 'Edit', 'fa' => 'edit', 'class' => 'primary'),
                        array('function' => 'deleteRow', 'title' => 'Hapus', 'fa' => 'remove', 'class' => 'danger'),
                    ),
                    'filter' => array(
                    )
                ),
            ),
            'modal' => array(
                'add' => array(
                    'form' => array(
                        array(
                            "type" => "help",
                            "helpvalue" => "<div class=\"alert alert-info\">Grid it up with bootstrap</div>"
                        ),
                        array(
                            'type' => 'section',
                            'htmlClass' => 'row',
                            'items' => array(
                                array(
                                    "key" => "first_name",
                                    "type" => "text",
                                    "title" => "Nama Depan",
                                    'htmlClass' => 'col-sm-6',
                                    "placeholder" => "Nama Lengkap Anda"
                                ),
                                array(
                                    "key" => "last_name",
                                    "type" => "text",
                                    "title" => "Nama Belakang",
                                    'htmlClass' => 'col-sm-6',
                                    "placeholder" => "Nama Belakang Anda"
                                ),
                                array(
                                    "key" => "gender_select",
                                    "type" => "select",
                                    "title" => "Jenis Kelamin",
                                    'htmlClass' => 'col-sm-6',
                                    "titleMap" => array(
                                        array('value' => 'male', 'name' => 'Male'),
                                        array('value' => 'female', 'name' => 'Female')
                                    )
                                ),
                                array(
                                    "key" => "gender_checkboxes",
                                    "type" => "checkboxes",
                                    "title" => "Jenis Kelamin",
                                    'htmlClass' => 'col-sm-6',
                                    "titleMap" => array(
                                        array('value' => 'male', 'name' => 'Male'),
                                        array('value' => 'female', 'name' => 'Female')
                                    )
                                ),
                                array(
                                    "key" => "gender_radios",
                                    "type" => "radios",
                                    "title" => "Jenis Kelamin",
                                    'htmlClass' => 'col-sm-6',
                                    "titleMap" => array(
                                        array('value' => 'male', 'name' => 'Male'),
                                        array('value' => 'female', 'name' => 'Female')
                                    )
                                ),
                                array(
                                    "key" => "gender_radios-inline",
                                    "type" => "radios-inline",
                                    "title" => "Jenis Kelamin",
                                    'htmlClass' => 'col-sm-6',
                                    "titleMap" => array(
                                        array('value' => 'male', 'name' => 'Male'),
                                        array('value' => 'female', 'name' => 'Female')
                                    )
                                ),
                                array(
                                    "key" => "gender_datepicker",
                                    "type" => "datepicker",
                                    "title" => "Jenis Kelamin",
                                    "minDate" => "1995-09-01",
                                    "maxDate" => date("Y-m-d"),
                                    "format" => "yyyy-mm-dd",
                                    'htmlClass' => 'col-sm-6',
                                ),
                            )
                        ),
                    ),
                    'schema' => array(
                        "type" => "object",
                        "title" => "Comment",
                        "properties" => array(
                            "name" => array(
                                "title" => "first_name",
                                "type" => "string"
                            ),
                            "last_name" => array(
                                "title" => "Nama Belakang",
                                "type" => "string",
                                "description" => "Nama Belakang Anda"
                            ),
                            "gender_select" => array(
                                "title" => "Jenis Kelamin",
                                "description" => "Nama Belakang Anda"
                            ),
                            "gender_checkboxes" => array(
                                "title" => "Jenis Kelamin",
                                "description" => "Nama Belakang Anda"
                            ),
                            "gender_radios" => array(
                                "title" => "Jenis Kelamin",
                                "description" => "Nama Belakang Anda"
                            ),
                            "gender_radios-inline" => array(
                                "title" => "Jenis Kelamin",
                                "description" => "Nama Belakang Anda"
                            ),
                            "gender_datepicker" => array(
                                "title" => "Jenis Kelamin",
                                "type" => "string",
                                "format" => "date",
                                "description" => "Nama Belakang Anda"
                            ),
                        ),
                        "required" => array(
                            "first_name",
                            "last_name",
                            "gender_select",
                            "gender_checkboxes",
                            "gender_radios",
                            "gender_radios-inline",
                        )
                    ),
                )
            ),
            'urlDatatables' => 'data_2/data',
            'urlCreate' => 'data_2/create',
            'urlUpdate' => 'data_2/update',
            'urlDelete' => 'data_2/delete',
            'urlView' => 'data_2/view/',
            "title" => "Data 1",
            "subTitle" => "Detail Data 1",
            "boxTitle" => "Tabel Data 1",
            "requestAdd" => true,
            'titlePage' => 'Data 1 - SIMAPES'
        );

        echo json_encode($data);
    }

    public function view() {
        $post = json_decode(file_get_contents('php://input'));

        $this->db->from('data_2');
        $this->db->where('id', $post->id);
        $result = $this->db->get()->row();

        echo json_encode($result);
    }

    public function delete() {
        $post = json_decode(file_get_contents('php://input'));

        $where = array('id' => $post->id);
        $this->db->delete('data_2', $where);

        $result = $this->db->affected_rows();

        echo json_encode(array('status' => $result));
    }

}
