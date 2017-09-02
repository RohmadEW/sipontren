<?php
defined('BASEPATH') OR exit('No direct script access allowed');
$this->auth->validation();
?>
<md-dialog aria-label="Tambah Kecamatan" class="dialog-form" ng-controller="kecamatanController">
    <form ng-cloak name="form" ng-submit="saveSubmit();" novalidate>
        <md-toolbar>
            <div class="md-toolbar-tools">
                <h2>Tambah Kecamatan</h2>
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
                    <md-autocomplete flex required
                                     ng-disabled="ajaxRunning"
                                     md-input-name="ID_KAB"
                                     md-input-minlength="2"
                                     md-no-cache="ID_KAB.noCache"
                                     md-selected-item="ID_KAB.selectedItem"
                                     md-search-text="ID_KAB.searchText"
                                     md-items="item in ID_KAB.querySearch(searchText)"
                                     md-item-text="item.display"
                                     md-require-match
                                     md-floating-label="Pilih Kabupaten">
                        <md-item-template>
                            <span md-highlight-text="searchText">{{item.display}}</span>
                        </md-item-template>
                        <div ng-messages="form.ID_KAB.$error" ng-if="form.ID_KAB.$touched">
                            <div ng-message="required">Wajib diisi</div>
                            <div ng-message="md-require-match">Pilih pilihan yang ada</div>
                            <div ng-message="minlength">Ketikan minimal 2 kata</div>
                        </div>
                    </md-autocomplete>
                    <md-input-container class="md-block kk-form-control" flex-gt-sm>
                        <label>Nama Kecamatan</label>
                        <input type="text" ng-model="formData.NAMA_KEC" required name="NAMA_KEC" ng-disabled="ajaxRunning">
                        <div ng-messages="form.NAMA_KEC.$error">
                            <div ng-message="required">Wajid diisi</div>
                        </div>
                    </md-input-container>
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