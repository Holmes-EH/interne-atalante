<?php
    /*
    * Base Controller
    * Loads the models in views
    */
    class Controller {
        // Load model
        public function model($model, $args = NULL){
            // Require model file
            require_once './models/' . $model . '.php';

            //Instatiate the model
            if (!is_null($args)) {
                //with args
                return new $model($args);
            } else {
                //witthout args
                return new $model();
            }
            
        }
    }