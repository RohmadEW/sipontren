<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Output_handler {

    public function __construct() {
        $this->CI = &get_instance();
    }

    public function set_header_JSON() {
        if (!$this->CI->input->is_ajax_request()) {
            show_error("Your request is not valid", "403", "ERROR");
        } else {
            header('Content-Type: application/json');
        }
    }

    public function output_JSON($data, $standar_notification = null) {
        if (is_object($data))
            $data = (array) $data;

        if (is_array($data))
            array_walk($data, function (&$value) {
                if (ctype_digit($value)) {
                    $value = (int) $value;
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

    public function dialog_info($title, $message) {
        echo '
        <md-dialog aria-label="Info ' . $title . '" class="dialog-form">
            <form ng-cloak name="form" ng-submit="saveSubmit();" novalidate>
                <md-toolbar>
                    <div class="md-toolbar-tools">
                        <h2>Info ' . $title . '</h2>
                        <span flex></span>
                        <md-button class="md-icon-button" ng-click="cancelSumbit()">
                            <md-icon class="material-icons md-24">close</md-icon>
                        </md-button>
                    </div>
                </md-toolbar>
                <md-dialog-content>
                    <div class="md-dialog-content">
                        <div>
                            <h2>'.$message.'</h2>
                        </div>
                    </div>
                </md-dialog-content>
                <md-dialog-actions layout="row">
                    <span flex></span>
                    <md-button ng-click="cancelSumbit()">
                        Tutup
                    </md-button>
                </md-dialog-actions>
            </form>
        </md-dialog>
        ';
    }
    
    public function dialog_form($title, $controller, $data) {
        echo '
        <md-dialog aria-label="{{ addForm ? \'Tambah\' : \'Ubah\' }} ' . $title . '" class="dialog-form" ng-controller="' . $controller . 'Controller">
            <form ng-cloak name="form" ng-submit="saveSubmit();" novalidate>
                <md-toolbar>
                    <div class="md-toolbar-tools">
                        <h2>{{ addForm ? \'Tambah\' : \'Ubah\' }} ' . $title . '</h2>
                        <span flex></span>
                        <md-button class="md-icon-button" ng-click="cancelSumbit()">
                            <md-icon class="material-icons md-24">close</md-icon>
                        </md-button>
                    </div>
                </md-toolbar>
                <div class="ajax-bar"><md-progress-linear class="kk-progress-linear" md-mode="indeterminate" ng-show="ajaxRunning"></md-progress-linear></div>
                <md-dialog-content>
                    <div class="md-dialog-content">
                        <div>
                ';
        
        foreach ($data as $detail) {
            if ($detail['type'] == 'autocomplete')
                $this->form_autocomplete($detail);
            elseif ($detail['type'] == 'date')
                $this->form_date($detail);
            elseif ($detail['type'] == 'select')
                $this->form_select($detail);
            else
                $this->form_input($detail);
        }

        echo '
                        </div>
                    </div>
                </md-dialog-content>
                <md-dialog-actions layout="row">
                    <span flex></span>
                    <md-button ng-click="cancelSumbit()">
                        Batal
                    </md-button>
                    <md-button type="submit" ng-disabled="ajaxRunning">
                        Simpan
                    </md-button>
                </md-dialog-actions>
            </form>
        </md-dialog>
        ';
    }

    private function form_autocomplete($data) {
        if (!isset($data['required']))
            $data['required'] = true;
        echo '
            <md-autocomplete flex required
                            ng-disabled="ajaxRunning"
                            md-input-name="' . $data['field'] . '"
                            md-no-cache="' . $data['field'] . '.noCache"
                            md-selected-item="' . $data['field'] . '.selectedItem"
                            md-search-text="' . $data['field'] . '.searchText"
                            md-items="item in ' . $data['field'] . '.querySearch(searchText)"
                            md-item-text="item.display"
                            ' . ($data['required'] ? 'md-require-match' : '') . '
                            ' . ($data['required'] ? 'required' : '') . '
                            md-floating-label="Pilih ' . $data['label'] . '">
               <md-item-template>
                   <span md-highlight-text="searchText">{{item.display}}</span>
               </md-item-template>
               ' . ($data['required'] ? '<div ng-messages="form.' . $data['field'] . '.$error" ng-if="form.' . $data['field'] . '.$touched">
                   <div ng-message="required">Wajib diisi</div>
                   <div ng-message="md-require-match">Pilih pilihan yang ada</div>
               </div>
                ' : '') . '
           </md-autocomplete>
        ';
    }

    private function form_input($data) {
        if (!isset($data['required']))
            $data['required'] = true;
        echo '
            <md-input-container class="md-block kk-form-control" flex-gt-sm>
                <label>' . $data['label'] . '</label>
                <input type="' . $data['type'] . '" ng-model="formData.' . $data['field'] . '" ' . ($data['required'] ? 'required' : '') . ' name="' . $data['field'] . '" ng-disabled="ajaxRunning">
                ' . ($data['required'] ? '<div ng-messages="form.' . $data['field'] . '.$error">
                    <div ng-message="required">Wajid diisi</div>
                </div>
                ' : '') . '
            </md-input-container>
            ';
    }

    private function form_date($data) {
        if (!isset($data['required']))
            $data['required'] = true;
        echo '
            <md-input-container class="md-block kk-form-control" flex-gt-sm>
                <label>' . $data['label'] . '</label>
                <md-datepicker ng-model="formData.' . $data['field'] . '" ' . ($data['required'] ? 'required' : '') . ' name="' . $data['field'] . '" ng-disabled="ajaxRunning"></md-datepicker>
                ' . ($data['required'] ? '<div ng-messages="form.' . $data['field'] . '.$error">
                    <div ng-message="required">Wajid diisi</div>
                </div>
                ' : '') . '
            </md-input-container>
            ';
    }

    public function form_select($data) {
        if (!isset($data['required']))
            $data['required'] = true;
        echo '
            <md-input-container class="md-block kk-form-control" flex-gt-sm>
                <label>' . $data['label'] . '</label>
                <md-select ng-model="formData.' . $data['field'] . '" ' . ($data['required'] ? 'required' : '') . ' name="' . $data['field'] . '" ng-disabled="ajaxRunning">
                    <md-option ng-repeat="item in data' . $data['field'] . '" value="{{item.id}}">
                        {{item.title}}
                    </md-option>
                </md-select>
                ' . ($data['required'] ? '<div ng-messages="form.' . $data['field'] . '.$error">
                    <div ng-message="required">Wajid diisi</div>
                </div>
                ' : '') . '
            </md-input-container>
            ';
    }

}
