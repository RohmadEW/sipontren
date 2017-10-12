<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Emis extends CI_Controller {

    var $primaryKey = 'ID_SANTRI';

    public function __construct() {
        parent::__construct();
        $this->load->model(array(
            'emis_model' => 'emis',
        ));
        $this->load->library('PHPExcel/PHPExcel');
        $this->auth->validation(array(1));
    }

    public function index() {
        $data = array(
            'title' => 'EMIS',
            'breadcrumb' => 'Pengaturan > EMIS',
        );
        $this->output_handler->output_JSON($data);
    }

    public function upload_emis() {

        $inputFileName = './sampleData/example1.xls';

//  Read your Excel workbook
        try {
            $inputFileType = PHPExcel_IOFactory::identify($inputFileName);
            $objReader = PHPExcel_IOFactory::createReader($inputFileType);
            $objPHPExcel = $objReader->load($inputFileName);
        } catch (Exception $e) {
            die('Error loading file "' . pathinfo($inputFileName, PATHINFO_BASENAME) . '": ' . $e->getMessage());
        }

//  Get worksheet dimensions
        $sheet = $objPHPExcel->getSheet(0);
        $highestRow = $sheet->getHighestRow();
        $highestColumn = $sheet->getHighestColumn();

//  Loop through each row of the worksheet in turn
        for ($row = 1; $row <= $highestRow; $row++) {
            //  Read a row of data into an array
            $rowData = $sheet->rangeToArray('A' . $row . ':' . $highestColumn . $row, NULL, TRUE, FALSE);
            //  Insert row data array into your database of choice here
        }
    }

    public function download_emis() {
        $data = $this->emis->get_datatable();

        $objPHPExcel = new PHPExcel();

        $objPHPExcel->getProperties()->setCreator("Rohmad Eko Wahyudi")->setTitle("SIPONTREN - EMIS");

        $objPHPExcel->setActiveSheetIndex(0);
        $objPHPExcel->getActiveSheet()->fromArray($data, NULL, 'A1');

        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="sipontren_emis_' . date('Y_m_d_H_i_s') . '.xls"');
        header('Cache-Control: max-age=0');
        header('Cache-Control: max-age=1');

        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        $objWriter->save('php://output');
    }

}
