<?php
/**
 * Created by PhpStorm.
 * User: rohmad
 * Date: 07/08/17
 * Time: 11:28
 */

class Datatables_handler
{
    public function __construct()
    {
        $this->CI =& get_instance();
    }

    private function _get_datatables_query($column, $order)
    {
        $i = 0;
        $search_value = $_POST['search']['value'];
        $search_columns = $_POST['columns'];
        foreach ($column as $item) {
            if ($search_value || $search_columns) {
                if ($i === 0) {
                    $this->CI->db->group_start();
                    $this->CI->db->like($item, $search_value);
                } else {
                    $this->CI->db->or_like($item, $search_value);
                }
                if (count($search_columns) - 1 == $i) {
                    $this->CI->db->group_end();
                    break;
                }
            }
            $column[$i] = $item;
            $i++;
        }
        $i = 0;
        foreach ($column as $item) {
            if ($search_columns) {
                if ($i === 0)
                    $this->CI->db->group_start();
                $this->CI->db->like($item, $search_columns[$i]['search']['value']);
                if (count($search_columns) - 1 == $i) {
                    $this->CI->db->group_end();
                    break;
                }
            }
            $column[$i] = $item;
            $i++;
        }

        if (isset($_POST['order'])) {
            $this->CI->db->order_by($column[$_POST['order']['0']['column']], $_POST['order']['0']['dir']);
        } else if (isset($order)) {
            $this->CI->db->order_by(key($order), $order[key($order)]);
        }
    }

    function get_datatables($column, $order)
    {
        $this->_get_datatables_query($column, $order);
        if ($_POST['length'] != -1)
            $this->CI->db->limit($_POST['length'], $_POST['start']);
        $query = $this->CI->db->get();

        return $query->result();
    }

    function count_filtered($column, $order)
    {
        $this->_get_datatables_query($column, $order);
        $query = $this->CI->db->get();

        return $query->num_rows();
    }

    public function count_all()
    {
        $query = $this->CI->db->get();

        return $query->num_rows();
    }
}