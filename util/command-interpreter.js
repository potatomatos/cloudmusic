/*
*命令解释器
*/

var regx=/cloudmusic\s+-(.*)\s+(.*)/i;

function testRegx(command) {
    return regx.test(command);
}

function getCommandParam(command) {
    if(testRegx(command)){
        var resultArr=regx.exec(command);
        var commandType=resultArr[1];
        var commandParams=resultArr[2];

        return {
            commandType:commandType,
            commandParams:commandParams
        };
    }else {
        return null;
    }

}
/*function test_music_search(command) {
    return searchRegx.test(command);
}

function music_search(command) {

    var word=searchRegx.exec(command);
    console.log("reg",word);

    if(word)
        return word[1];
    else
        return null;
}*/

