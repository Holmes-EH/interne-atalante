<?php

class Scolaires extends Controller {
    public function __construct() {
        $this->model = $this->model('scolairesdata');
    }

    public function get(){
        $result = $this->model->getAll();
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);

        header($response['status_code_header']);
        echo json_encode($result, JSON_FORCE_OBJECT);
    }

    public function post($args){

    }
}