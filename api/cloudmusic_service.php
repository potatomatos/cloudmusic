<?php

include('simple_html_dom.php');

function music_search($word,$page,$size)
{
    $url = "http://music.163.com/api/search/pc";
    $post_data = array(
        's' => $word,
        'offset' => $page,
        'limit' => $size,
        'type' => '1',
    );
    $data = curl_request($url, $post_data);
    if ($data) {
        return $data;
    }
    return null;
}

function get_music_info($music_id)
{
    $url = "http://music.163.com/api/song/detail/?id=" . $music_id . "&ids=%5B" . $music_id . "%5D";
    return curl_get($url);
}

function get_artist_album($artist_id, $limit)
{
    $url = "http://music.163.com/api/artist/albums/" . $artist_id . "?limit=" . $limit;
    return curl_get($url);
}

function get_album_info($album_id)
{
    $url = "http://music.163.com/api/album/" . $album_id;
    return curl_get($url);
}

function get_playlist_info($playlist_id)
{
    $url = "http://music.163.com/api/playlist/detail?id=" . $playlist_id;
    return curl_get($url);
}

function get_music_lyric($music_id)
{
    $url = "http://music.163.com/api/song/lyric?os=pc&id=" . $music_id . "&lv=-1&kv=-1&tv=-1";
    return curl_get($url);
}

function get_mv_info()
{
    $url = "http://music.163.com/api/mv/detail?id=319104&type=mp4";
    return curl_get($url);
}

//获取排行榜
function get_toplist($id)
{
    //飙升榜 19723756
    //新歌榜 3779629
    //原创歌曲榜 2884035
    //热歌榜 3778678

    $url = "https://music.163.com/discover/toplist?id=" . $id;
    $opts = array(
        'http' => array(
            'method' => "GET",
            'header' => "Host:music.163.com\r\n" .
                "Accept-language: zh-cn\r\n" .
                "User-Agent: Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; 4399Box.560; .NET4.0C; .NET4.0E)" .
                "Accept: *//*"
        )
    );
    $context = stream_context_create($opts);
    $content = file_get_contents($url, 0, $context);
    $dom = new simple_html_dom();
    $html = $dom->load($content);
    $json_content = "";
    foreach ($html->find('textarea#song-list-pre-data') as $e)
        $json_content .= $e->innertext;
    // $json_content.=mb_convert_encoding($e->innertext, 'gb2312', 'UTF-8');

    return $json_content;
}

//获取歌单
function get_playlist($page)
{
    $url = 'https://music.163.com/discover/playlist/?order=hot&cat=%E5%85%A8%E9%83%A8&limit=10&offset='.(($page-1)*10);
    $opts = array(
        'http' => array(
            'method' => "GET",
            'header' => "Host:music.163.com\r\n" .
                "Accept-language: zh-cn\r\n" .
                "User-Agent: Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; 4399Box.560; .NET4.0C; .NET4.0E)" .
                "Accept: *//*"
        )
    );
    $context = stream_context_create($opts);
    $content = file_get_contents($url, 0, $context);
    $dom = new simple_html_dom();
    $html = $dom->load($content);
    $json_content = array();
    foreach ($html->find('ul#m-pl-container li') as $e){
        $arr = parse_url($e->find("a.tit",0)->href);
        $arr_query = convertUrlQuery($arr['query']);
        $play_list_id=$arr_query["id"];
        $play_list_name=$e->find("a.tit",0)->innertext;
        $play_list_user=$e->find("a.nm",0)->innertext;
        $nb=$e->find("span.nb",0)->innertext;
        $jsonObj=array();
        $jsonObj["id"]=$play_list_id;
        $jsonObj["name"]=$play_list_name;
        $jsonObj["user"]=$play_list_user;
        $jsonObj["nb"]=$nb;
        $json_content[]=$jsonObj;
    }

    return json_encode($json_content);
}

//获取播放地址
function get_music_play_url($params, $encSecKey)
{
    $url = "https://music.163.com/weapi/song/enhance/player/url?csrf_token=";
    $post_data = array(
        'params' => $params,
        'encSecKey' => $encSecKey
    );
    $data = curl_request($url, $post_data);
    if ($data) {
        return $data;
    }
    return null;
}

//获取最新专辑
function get_new_album($params, $encSecKey)
{
    $url = "https://music.163.com/weapi/album/new?csrf_token=";
    $post_data = array(
        'params' => $params,
        'encSecKey' => $encSecKey
    );
    $data = curl_request($url, $post_data);
    if ($data) {
        return $data;
    }
    return null;
}
/**
 * POST请求
 * 参数1：访问的URL，参数2：post数据(不填则为GET)，参数3：提交的$cookies,参数4：是否返回$cookies
 */
function curl_request($url, $post = '', $cookie = '', $returnCookie = 0)
{
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)');
    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt($curl, CURLOPT_AUTOREFERER, 1);
    curl_setopt($curl, CURLOPT_REFERER, "http://XXX");
    if ($post) {
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($post));
    }
    if ($cookie) {
        curl_setopt($curl, CURLOPT_COOKIE, $cookie);
    }
    curl_setopt($curl, CURLOPT_HEADER, $returnCookie);
    curl_setopt($curl, CURLOPT_TIMEOUT, 10);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $data = curl_exec($curl);
    if (curl_errno($curl)) {
        return curl_error($curl);
    }
    curl_close($curl);
    if ($returnCookie) {
        list($header, $body) = explode("\r\n\r\n", $data, 2);
        preg_match_all("/Set\-Cookie:([^;]*);/", $header, $matches);
        $info['cookie'] = substr($matches[1][0], 1);
        $info['content'] = $body;
        return $info;
    } else {
        return $data;
    }
}
function curl_get($url)
{
    $refer = "http://music.163.com/";
    $header[] = "Cookie: " . "appver=1.5.0.75771;";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_BINARYTRANSFER, true);
    curl_setopt($ch, CURLOPT_REFERER, $refer);
    $output = curl_exec($ch);
    curl_close($ch);
    return mb_convert_encoding($output, 'GBK', 'UTF-8');
}

function convertUrlQuery($query)
{
    $queryParts = explode('&', $query);
    $params = array();
    foreach ($queryParts as $param) {
        $item = explode('=', $param);
        $params[$item[0]] = $item[1];
    }
    return $params;
}

/**
 * 将参数变为字符串
 * @param $array_query
 * @return string string 'm=content&c=index&a=lists&catid=6&area=0&author=0&h=0&region=0&s=1&page=1' (length=73)
 */
function getUrlQuery($array_query)
{
    $tmp = array();
    foreach($array_query as $k=>$param)
    {
        $tmp[] = $k.'='.$param;
    }
    $params = implode('&',$tmp);
    return $params;
}