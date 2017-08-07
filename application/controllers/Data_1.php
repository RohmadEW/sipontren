<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Data_1 extends CI_Controller {

    public function data() {
        $input = (object) $this->input->post();

        $this->db->from('data_1');
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
                        array('type' => 'modal', 'function' => 'editRow', 'title' => 'Edit', 'fa' => 'edit', 'class' => 'primary'),
                        array('type' => 'ng', 'function' => 'deleteRow', 'title' => 'Hapus', 'fa' => 'remove', 'class' => 'danger'),
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
                                    'type' => 'section',
                                    'htmlClass' => 'col-sm-6 border-right',
                                    'items' => array(
                                        array(
                                            "key" => "first_name",
                                            "type" => "text",
                                            "title" => "Nama Depan",
                                            "placeholder" => "Nama Lengkap Anda"
                                        ),
                                        array(
                                            "key" => "last_name",
                                            "type" => "text",
                                            "title" => "Nama Belakang",
                                            "placeholder" => "Nama Belakang Anda"
                                        ),
                                    )
                                ),
                                array(
                                    'type' => 'section',
                                    'htmlClass' => 'col-sm-6',
                                    'items' => array(
                                        array(
                                            "key" => "ip_address",
                                            "type" => "text",
                                            "title" => "IP Address",
                                            "placeholder" => "Alamat IP Anda"
                                        ),
                                        array(
                                            "key" => "gender",
                                            "type" => "radios-inline",
                                            "title" => "Jenis Kelamin",
                                            "titleMap" => array(
                                                array('value' => 'male', 'name' => 'Male'),
                                                array('value' => 'female', 'name' => 'Female')
                                            )
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
                            "first_name" => array(
                                "title" => "Nama Depan",
                                "type" => "string",
                                "description" => "Nama Depan Anda"
                            ),
                            "last_name" => array(
                                "title" => "Nama Belakang",
                                "type" => "string",
                                "description" => "Nama Belakang Anda"
                            ),
                            "gender" => array(
                                "title" => "Jenis Kelamin",
                                "type" => "string",
                            ),
                            "ip_address" => array(
                                "title" => "IP Address",
                                "type" => "string",
                                "description" => "Alamat IP Anda"
                            )
                        ),
                        "required" => array(
                            "first_name",
                            "last_name",
                            "gender",
                            "ip_address",
                        )
                    ),
                )
            ),
            'urlDatatables' => 'data_1/data',
            'urlCreate' => 'data_1/create',
            'urlSave' => 'data_1/save',
            'urlDelete' => 'data_1/delete',
            'urlView' => 'data_1/view/',
            "title" => "Data 1",
            "titleAdd" => "Tambah Agama",
            "titleEdit" => "Ubah Agama",
            "subTitle" => "Detail Data 1",
            "boxTitle" => "Tabel Data 1",
            "requestAdd" => true,
            'titlePage' => 'Data 1 - SIMAPES'
        );

        echo json_encode($data);
    }

    public function view() {
        $post = json_decode(file_get_contents('php://input'));

        $this->db->from('data_1');
        $this->db->where('id', $post->id);
        $result = $this->db->get()->row();

        echo json_encode($result);
    }

    public function save() {
        $data = json_decode(file_get_contents('php://input'));

        if (isset($data->id)) {
            $where = array('id' => $data->id);
            $result = $this->db->update('data_1', $data, $where);
        } else {
            $result = $this->db->insert('data_1', $data);
        }

        $result = array(
            'status' => $result
        );

        if ($result['status'])
            $result['notification'] = array(
                'type' => 'success',
                'title' => 'Berhasil',
                'text' => 'Data berhasil diubah'
            );
        else
            $result['notification'] = array(
                'type' => 'error',
                'title' => 'Gagal',
                'text' => 'Data gagal diubah'
            );

        echo json_encode($result);
    }

    public function delete() {
        $post = json_decode(file_get_contents('php://input'));

        $where = array('id' => $post->id);
        $this->db->delete('data_1', $where);

        $result = array(
            'status' => $this->db->affected_rows()
        );

        if ($result['status'])
            $result['notification'] = array(
                'type' => 'success',
                'title' => 'Berhasil',
                'text' => 'Data berhasil dihapus'
            );
        else
            $result['notification'] = array(
                'type' => 'error',
                'title' => 'Gagal',
                'text' => 'Data gagal dihapus'
            );

        echo json_encode($result);
    }

}
