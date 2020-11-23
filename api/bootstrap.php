<?php
// Load config
require_once 'config/config.php';

// Autoload Core Librairies
spl_autoload_register(function($className){
    require_once 'librairies/' . $className .'.php';
});