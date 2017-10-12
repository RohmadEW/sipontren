<?php
defined('BASEPATH') OR exit('No direct script access allowed');
$this->auth->validation();

$this->output_handler->start_content('settingsEmisController');
?>
<hr>
<div layout="row">
    <div flex="100">
        <h2>IMPORT DATA</h2>
    </div>
</div>
<form ng-cloak name="form" ng-submit="importEMIS(form);" novalidate>
    <div layout="row">
        <div flex="70">
            <div style="margin: 30px;">
                <?php
                $this->output_handler->form_input(
                        array(
                            'type' => 'file',
                            'field' => 'FILE_EMIS',
                            'label' => 'Pilih File yang akan diimport'
                ));
                ?>
            </div>
        </div>
        <div flex="10" style="margin-top: 20px">
            <md-button type="submit" class="md-primary md-raised">
                IMPORT
                <md-tooltip md-direction="bottom">
                    Klik untuk mulai import data
                </md-tooltip>
            </md-button>
        </div>
        <div flex="10" style="margin-top: 20px">
            <md-button type="button" class="md-accent md-raised" ng-click="downloadTemplate()">
                TEMPLATE
                <md-tooltip md-direction="bottom">
                    Klik untuk mulai mendownload template
                </md-tooltip>
            </md-button>
        </div>
    </div>
</form>
<hr>
<div layout="row">
    <div flex="100">
        <h2>EXPORT DATA</h2>
    </div>
</div>
<div layout="row">
    <div flex="20" flex-offset="10">
        <md-button type="button" class="md-primary md-raised" ng-click="downloadEMIS()">
            DOWNLOAD DATA
            <md-tooltip md-direction="bottom">
                Klik untuk mulai mendownload data EMIS
            </md-tooltip>
        </md-button>
    </div>
</div>

<?php
$this->output_handler->end_content();
?>