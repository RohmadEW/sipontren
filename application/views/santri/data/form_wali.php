<?php
defined('BASEPATH') OR exit('No direct script access allowed');
$this->auth->validation();

$title = 'Santri';
$controller = 'dataSantri';
$data = array(
    array(
        'type' => 'text',
        'field' => 'NIS_SANTRI',
        'label' => 'NIS'
    ),
    array(
        'type' => 'number',
        'field' => 'NIK_SANTRI',
        'label' => 'NIK'
    ),
    array(
        'type' => 'text',
        'field' => 'NAMA_SANTRI',
        'label' => 'Nama Santri'
    ),
    array(
        'type' => 'text',
        'field' => 'PANGGILAN_SANTRI',
        'label' => 'Nama Panggilan Santri'
    ),
    array(
        'type' => 'number',
        'field' => 'ANGKATAN_SANTRI',
        'label' => 'Angkatan'
    ),
    array(
        'type' => 'select',
        'field' => 'JK_SANTRI',
        'label' => 'Jenis Kelamin'
    ),
    array(
        'type' => 'text',
        'field' => 'TEMPAT_LAHIR_SANTRI',
        'label' => 'Tempat Lahir'
    ),
    array(
        'type' => 'date',
        'field' => 'TANGGAL_LAHIR_SANTRI',
        'label' => 'Tanggal Lahir'
    ),
    array(
        'type' => 'text',
        'field' => 'ALAMAT_SANTRI',
        'label' => 'Alamat'
    ),
    array(
        'type' => 'autocomplete',
        'field' => 'KECAMATAN_SANTRI',
        'label' => 'Kecamatan'
    ),
    array(
        'type' => 'text',
        'field' => 'NOHP_SANTRI',
        'label' => 'No HP'
    ),
    array(
        'type' => 'text',
        'field' => 'EMAIL_SANTRI',
        'label' => 'Email'
    ),
    array(
        'type' => 'select',
        'field' => 'SUKU_SANTRI',
        'label' => 'Suku'
    ),
    array(
        'type' => 'select',
        'field' => 'KONDISI_SANTRI',
        'label' => 'Kondisi'
    ),
    array(
        'type' => 'number',
        'field' => 'ANAK_KE_SANTRI',
        'label' => 'Anak ke'
    ),
    array(
        'type' => 'number',
        'field' => 'JUMLAH_SDR_SANTRI',
        'label' => 'Jumlah Saudara'
    ),
    array(
        'type' => 'number',
        'field' => 'BERAT_SANTRI',
        'label' => 'Berat Badan'
    ),
    array(
        'type' => 'number',
        'field' => 'TINGGI_SANTRI',
        'label' => 'Tinggi Badan'
    ),
    array(
        'type' => 'select',
        'field' => 'GOL_DARAH_SANTRI',
        'label' => 'Golongan Darah'
    ),
    array(
        'type' => 'text',
        'field' => 'RIWAYAT_KESEHATAN_SANTRI',
        'label' => 'Riwayat Kesehatan'
    ),
    array(
        'type' => 'text',
        'field' => 'NO_IJASAH_SANTRI',
        'label' => 'Nomor Ijasah'
    ),
    array(
        'type' => 'date',
        'field' => 'TANGGAL_IJASAH_SANTRI',
        'label' => 'Tamggal Ijasah'
    ),
    array(
        'type' => 'number',
        'field' => 'AYAH_NIK_SANTRI',
        'label' => 'NIK Ayah'
    ),
    array(
        'type' => 'text',
        'field' => 'AYAH_NAMA_SANTRI',
        'label' => 'Nama Ayah'
    ),
    array(
        'type' => 'select',
        'field' => 'AYAH_HIDUP_SANTRI',
        'label' => 'Status Ayah'
    ),
    array(
        'type' => 'text',
        'field' => 'AYAH_TEMPAT_LAHIR_SANTRI',
        'label' => 'Tempat Lahir Ayah'
    ),
    array(
        'type' => 'date',
        'field' => 'AYAH_TANGGAL_LAHIR_SANTRI',
        'label' => 'Tanggal Lahir Ayah'
    ),
    array(
        'type' => 'select',
        'field' => 'AYAH_PENDIDIKAN_SANTRI',
        'label' => 'Pendidikan Ayah'
    ),
    array(
        'type' => 'select',
        'field' => 'AYAH_PEKERJAAN_SANTRI',
        'label' => 'Pekerjaan Ayah'
    ),
    array(
        'type' => 'number',
        'field' => 'IBU_NIK_SANTRI',
        'label' => 'NIK Ibu'
    ),
    array(
        'type' => 'text',
        'field' => 'IBU_NAMA_SANTRI',
        'label' => 'Nama Ibu'
    ),
    array(
        'type' => 'select',
        'field' => 'IBU_HIDUP_SANTRI',
        'label' => 'Status Ibu'
    ),
    array(
        'type' => 'text',
        'field' => 'IBU_TEMPAT_LAHIR_SANTRI',
        'label' => 'Tempat Lahir Ibu'
    ),
    array(
        'type' => 'date',
        'field' => 'IBU_TANGGAL_LAHIR_SANTRI',
        'label' => 'Tanggal Lahir Ibu'
    ),
    array(
        'type' => 'select',
        'field' => 'IBU_PENDIDIKAN_SANTRI',
        'label' => 'Pendidikan Ibu'
    ),
    array(
        'type' => 'select',
        'field' => 'IBU_PEKERJAAN_SANTRI',
        'label' => 'Pekerjaan Ibu'
    ),
    array(
        'type' => 'number',
        'field' => 'WALI_NIK_SANTRI',
        'label' => 'NIK Wali'
    ),
    array(
        'type' => 'text',
        'field' => 'WALI_NAMA_SANTRI',
        'label' => 'Nama Wali'
    ),
    array(
        'type' => 'select',
        'field' => 'WALI_HUBUNGAN_SANTRI',
        'label' => 'Hubungan'
    ),
    array(
        'type' => 'select',
        'field' => 'WALI_PENDIDIKAN_SANTRI',
        'label' => 'Pendidikan Wali'
    ),
    array(
        'type' => 'select',
        'field' => 'WALI_PEKERJAAN_SANTRI',
        'label' => 'Pekerjaan Wali'
    ),
);

$this->output_handler->dialog_form($title, $controller, $data);

?>