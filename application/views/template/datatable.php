<?php
defined('BASEPATH') OR exit('No direct script access allowed');
$this->auth->validation();
?>
<div layout="row" ng-controller="datatableController" ng-cloak class="kk-bg-dark panel-datatable">
    <div flex="80" flex-offset="10" ng-if="appReady" class="md-whiteframe-3dp kk-reset-content animated fadeIn">
        <md-content layout-padding class='kk-content'>
            <div layout="row">
                <div flex="70">
                    <h2>{{ title}}</h2>
                    <h5>{{ breadcrumb}}</h5>
                </div>
                <div flex="30" layout layout-align="end center">
                    <md-fab-speed-dial ng-hide="fabHidden" md-direction="left" md-open="fabIsOpen" class="md-scale md-fab-top-right" ng-class="{
                                'md-hover-full': fabHover }" ng-mouseenter="fabIsOpen = true" ng-mouseleave="fabIsOpen = false">
                        <md-fab-trigger>
                            <md-button aria-label="menu" class="md-fab md-primary">
                                <md-tooltip md-direction="bottom">Menu</md-tooltip>
                                <md-icon class="material-icons md-36 kk-icon-title" aria-label="Menu">menu</md-icon>
                            </md-button>
                        </md-fab-trigger>

                        <md-fab-actions>
                            <div ng-repeat="item in menuItems">
                                <md-button aria-label="{{item.name}}" class="md-fab md-raised md-mini md-accent"
                                           ng-click="openDialog($event, item)">
                                    <md-tooltip md-direction="bottom">
                                        {{item.name}}
                                    </md-tooltip>

                                    <md-icon class="material-icons md-24 kk-icon-title" aria-label="{{item.name}}">{{item.icon}}</md-icon>
                                </md-button>
                            </div>
                        </md-fab-actions>
                    </md-fab-speed-dial>
                </div>
            </div>
            <div layout="row">
                <div flex="100">
                    <table ng-table-dynamic="dataTables with table" class="table table-condensed table-bordered table-striped table-hover" show-filter="true">
                        <tr ng-repeat="row in $data">
                            <td ng-repeat="col in $columns">
                                <md-menu ng-if="col.field === 'ACTION'">
                                    <md-button aria-label="Menu" class="md-icon-button" ng-click="$mdMenu.open()">
                                        <md-icon class="material-icons md-24 kk-icon-title" aria-label="Menu">menu</md-icon>
                                    </md-button>
                                    <md-menu-content width="3" ng-mouseleave="$mdMenu.close()">
                                        <md-menu-item ng-repeat="action in col.actions">
                                            <md-button ng-click="actionRow($event, action, row)">
                                                {{action.title}}
                                            </md-button>
                                        </md-menu-item>
                                    </md-menu-content>
                                </md-menu>
                                {{row[col.field]}}
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </md-content>
    </div>

    <md-sidenav class="md-sidenav-right md-whiteframe-4dp" md-component-id="right">
        <div  ng-controller="docDatatableController">
            <md-toolbar class="md-theme-light">
                <h1 class="md-toolbar-tools">{{ title}}</h1>
            </md-toolbar>
            <md-content layout-padding flex>
                {{ content}}
            </md-content>
        </div>
    </md-sidenav>
</div>