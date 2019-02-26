<?php
header("Content-type:application/json;charset=utf-8");
include_once "api/cloudmusic_service.php";

$action=$_GET["action"];

if($action=="get_toplist"){
    $id=$_GET["id"];
    echo get_toplist($id);
}else if($action=="get_music_info"){
    $id=$_GET["id"];
    echo get_music_info($id);
}else if($action=="get_music_play_url"){
    $params=$_POST["params"];
    $encSecKey=$_POST["encSecKey"];
    echo get_music_play_url($params,$encSecKey);
}else if($action=="music_search"){
    $word=$_POST["word"];
    $page=$_POST["page"];
    $size=$_POST["size"];
    echo music_search($word,$page,$size);
}else if ($action=="get_playlist"){
    $page=$_GET["page"];
    echo  get_playlist($page);
}else if ($action=="get_playlist_info"){
    $play_list_id=$_GET["play_list_id"];
//    echo  get_playlist_info($play_list_id);
    echo mb_convert_encoding(get_playlist_info($play_list_id), 'UTF-8', 'gbk');
}else if($action=="get_new_album"){
    $params=$_POST["params"];
    $encSecKey=$_POST["encSecKey"];
    echo get_new_album($params,$encSecKey);
}else if ($action=="get_album_info"){
    $album_id=$_GET["album_id"];
    echo mb_convert_encoding(get_album_info($album_id), 'UTF-8', 'gbk');
}
