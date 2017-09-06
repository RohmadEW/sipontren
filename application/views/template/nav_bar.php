<?php
defined('BASEPATH') OR exit('No direct script access allowed');
$this->auth->validation();
?>

    <div flex="70" flex-offset="5" ng-if="showMenu">
        <md-toolbar class="md-menu-toolbar">
            <div layout="row">
                <md-toolbar-filler class="kk-toolbar-filler" layout layout-align="center center">
                    <md-icon class="material-icons md-48 kk-icon-title">home</md-icon>
                </md-toolbar-filler>
                <div>
                    <h2 class="md-toolbar-tools md-display-3 kk-toolbar-tools">{{ name_app}}</h2>
                    <md-menu-bar class="kk-menu-bar">
                        <md-menu ng-repeat="menu in menus">
                            <button ng-click="$mdMenu.open()">
                                {{ menu.title}}
                            </button>
                            <md-menu-content width="4">
                                <md-menu-item ng-repeat="childMenu in menu.childMenus">
                                    <md-button ng-if="!childMenu.haveChild" ng-click="go(childMenu)">
                                        {{ childMenu.title}}
                                    </md-button>
                                    <md-menu ng-if="childMenu.haveChild">
                                        <md-button ng-click="$mdMenu.open()">
                                            {{ childMenu.title}}
                                        </md-button>
                                        <md-menu-content width="4">
                                            <md-menu-item ng-repeat="childMenuChild in childMenu.childMenuChilds">
                                                <md-button ng-click="go(childMenuChild)">
                                                    {{ childMenuChild.title}}
                                                </md-button>
                                            </md-menu-item>
                                        </md-menu-content>
                                    </md-menu>
                                </md-menu-item>
                            </md-menu-content>
                        </md-menu>
                    </md-menu-bar>
                </div>
            </div>
        </md-toolbar>
    </div>
    <div flex="20" layout="row" layout-align="end center" ng-if="showMenu">
        <div>
            <md-button class="md-fab kk-button" aria-label="Cari Santri">
                <md-tooltip md-direction="bottom">Cari Santri</md-tooltip>
                <md-icon class="material-icons md-36 kk-icon-nav-bar">search</md-icon>
            </md-button>
        </div>
        <div>
            <md-button class="md-fab kk-button" aria-label="Tentang Aplikasi" ng-click="showInfoDev()">
                <md-tooltip md-direction="bottom">Tentang Aplikasi</md-tooltip>
                <md-icon class="material-icons md-36 kk-icon-nav-bar">help_outline</md-icon>
            </md-button>
        </div>
        <div>
            <md-button class="md-fab kk-button" aria-label="Keluar Aplikasi" ng-click="logOut($event)">
                <md-tooltip md-direction="bottom">Keluar Aplikasi</md-tooltip>
                <md-icon class="material-icons md-36 kk-icon-nav-bar">exit_to_app</md-icon>
            </md-button>
        </div>
    </div>