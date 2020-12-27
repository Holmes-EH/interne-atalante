<?php
class ScolairesData {
    private $db;
    
    public function __construct(){
        $this->db = new Database;
    }

    public function getAll(){
        $statement = "  SELECT `idscolaire`,
                        `film` AS 'title',
                        `start`,
                        `end`,
                        `scol_details`,
                        `salle_idsalle` AS 'resourceId',
                        `date`,
                        HEX(`color`) AS 'color',
                        `allDay`,
                        `endDate`
                        FROM `scolaire`";
        $this->db->query($statement);
        $results = $this->db->resultSet();
        foreach ($results as $event) {
            $event->start = $event->date . " " . $event->start;
            $event->end = $event->date . " " . $event->end;
            $event->allDay = (bool)$event->allDay;
        
        }
        return $results;
    }

}
?>