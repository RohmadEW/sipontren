<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class Datetime_handler {
    
    function date_to_store($date) {
        return date('Y-m-d', strtotime($date.' +1 days'));
    }
    
}