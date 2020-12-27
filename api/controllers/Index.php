<?php

class Index extends Controller {
    public function get(){
        $response['status_code_header'] = 'HTTP/1.1 200 OK';

        header($response['status_code_header']);
    }
}