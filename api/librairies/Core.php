<?php
    /*
    * App Core Class
    * Creates URL and Loads Core controller
    * URL FORMAT - /controller/params
    */

    class Core {
        protected $currentController = '';
        protected $currentMethod = '';
        protected $params = [];

        public function __construct(){

            $url = $this->getUrl();

            // Look in controllers for first value
            if(file_exists('./controllers/' . ucwords($url[0]) . '.php')){
                // If exists, set as current controller
                $this->currentController = ucwords($url[0]);
                // Unset 0 Index
                unset($url[0]);
            }

            // Require the controller
            require_once './controllers/' . $this->currentController . '.php';

            // Instatiate controller class
            $this->currentController = new $this->currentController;

            // Check for request method
            $this->currentMethod = $_SERVER['REQUEST_METHOD'];

            // Get params
            $this->params = $url ? array_values($url) : [];

            // Call a callback with array of params
            call_user_func_array([$this->currentController, $this->currentMethod], $this->params);

        }

        public function getUrl(){
            if(isset($_GET['path'])){
                $url = rtrim($_GET['path'], '/');
                $url = filter_var($url, FILTER_SANITIZE_URL);
                $url = explode('/', $url);

                return $url;
            }
        }
    }