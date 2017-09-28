<?php
defined('BASEPATH') OR exit('No direct script access allowed');
$this->auth->validation();

$this->output_handler->start_content('perpusPeminajamanController');
?>
<form ng-cloak name="form" ng-submit="tambahPeminjaman(form);" novalidate>
    <div layout="row">
        <div flex="60" flex-offset='5'>
            <div style="margin: 12px;">
                <?php
                $this->output_handler->form_autocomplete(
                        array(
                            'type' => 'autocomplete',
                            'field' => 'ID_SANTRI',
                            'label' => 'santri terlebih dahulu'
                ));
                ?>
                <md-tooltip md-direction="bottom">
                    Klik untuk memilih santri
                </md-tooltip>
            </div>
        </div>
    </div>
    <div layout="row">
        <div flex="60" flex-offset='5'>
            <div style="margin: 12px;">
                <?php
                $this->output_handler->form_autocomplete(
                        array(
                            'type' => 'autocomplete',
                            'field' => 'ID_BUKU',
                            'label' => 'santri terlebih dahulu'
                ));
                ?>
                <md-tooltip md-direction="bottom">
                    Klik untuk memilih buku
                </md-tooltip>
            </div>
        </div>
        <div flex="10" style="margin-top: 20px">
            <md-button type="submit" class="md-primary md-raised">
                TAMBAH
            </md-button>
        </div>
        <div flex="10" style="margin-top: 20px">
            <md-button type="button" class="md-primary md-raised" ng-click="prosesPeminjaman()">
                SIMPAN
            </md-button>
        </div>
    </div>
</form>
<div layout="row" ng-if="formReady">
    <div flex>
        <table ng-table-dynamic="dataTablesPinjaman with table" class="table table-condensed table-bordered table-striped table-hover" show-filter="true">
            <tr ng-repeat="row in $data">
                <td ng-repeat="col in $columns">
                    <div ng-if="col.field === 'ACTION'">
                        <md-checkbox class="md-primary" ng-checked="hitungTagihan()" ng-model="formDataTag.TAGIHAN_BAYAR[row['ID_TAGIHAN']]" style="margin: 10px;" aria-label="Pilih Tagihan">
                            <md-tooltip md-direction="bottom">
                                Klik untuk memilih tagihan yang akan dibayar santri
                            </md-tooltip>
                        </md-checkbox>
                    </div>
                    {{row[col.field]}}
                </td>
            </tr>
        </table>
    </div>
</div>

<?php
$this->output_handler->end_content();
?>