//var CLIENT_ID="1003542821097-6bgij3g8081as4nf9tm9re6a288pi3km.apps.googleusercontent.com";
var CLIENT_ID="1003542821097-1rhulrcjn4ca4jrdjfaremjv62qs714i.apps.googleusercontent.com";
var SCOPES=[
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
    //'https://www.googleapis.com/auth/drive.appdata'
    'https://www.googleapis.com/auth/drive.appfolder'
];
//데이터 지우고 새 데이터 파일 만들때 문제 확인

//var APPDATA = {};

//var APPDATA_META;
var DATAFILE_ID;

function intiGAPIManager() {
    checkAuth();
}

function checkAuth() {
    gapi.auth.authorize(
        {'client_id': CLIENT_ID, 'scope' : SCOPES.join(' '), 'immediate': false}, handleAuthResult
    );
}

function executeWithDrive(callback) {
    gapi.client.load('drive', 'v2', callback);
}

function handleAuthResult(authResult) {
    if (authResult) {
        initMainPage();
//        getReceiptList();
        //initializeElements();
        // Access token has been successfully retrieved, requests can be sent to the API
        //getFileList2();
        //executeWithDrive(getFileList);
        //(query, checkAppDataFile);

        //listFilesInApplicationDataFolder(checkApplicationDataFile);
        //createApplicationDataFile();
    } else {
        // No access token could be retrieved, force the authorization flow.
        gapi.auth.authorize(
            {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false}, handleAuthResult
        );
    }
}

function findFilesWithQuery(query, checker) {
    console.log("[SEARCHING] : " + query);
    executeWithDrive(function() {
        var listRequest = gapi.client.drive.files.list({
            'q': query
        });

        var retrievePageOfFiles = function(request, result) {
            request.execute(function(resp) {
                result = result.concat(resp.items);
                var nextPageToken = resp.nextPageToken;
                if (nextPageToken) {
                    request = gapi.client.drive.files.list({
                        'pageToken': nextPageToken
                    });
                    retrievePageOfFiles(request, result);
                } else {
                    checker(result);
                }
            });
        };
        return retrievePageOfFiles(listRequest, []);
    });
}

function getReceiptList(callback) {
    var query = ('"appfolder" in parents and title != "' + DATAFILE + '"');

    var checker = function (result) {

        var success = function(count) {
            console.log("[SUCCESS] : Found " + count + " receipt(s)");
        };

        var noReceipt = function() {
            console.log("[NORECEIPT] : Found 0 receipt");
        };

        var count = 0;
        var title, date;
        for(var i in result) {
            title = result[i].title;
            date = (result[i].title.split("_"))[0];
            if(title != DATAFILE && date.length == 8) {//yyyymmdd = 8 digits
                count++;
            }
        }

        if(count !== 0) {
            success(count);
            callback();
        } else {
            noReceipt();
        }
    };

    findFilesWithQuery(query, checker);
    //console.log("finding receipt result : " + result);
    //2. Read the data
    //var filechecking = getFile.bind(RECEIPT_JSON, result, null, null);
    //3. Load the data
}
/*
function getAppMetaData(callback) {
    var request = gapi.client.drive.files.get({
        'fileId': 'appfolder',
        'title' : DATAFILE
    });
    request.execute(function(resp) {
        APPDATA_META = resp;
        console.log("Get MetaData [" + resp.title + ":" + resp.id + "]");
        callback(resp.id);
    });
}*/

function getDataFile(callback) {
    //1. Find DATAFILE file
    var query = ('"appfolder" in parents and title = "' + DATAFILE + '"');

    var checker = function(result) {
        //Read data file and make it to data model
        var success = function(result) {
            DATAFILE_ID = result[0].id;
            dataModel.id = result[0].id;
            console.log("[SUCCESS] : Found DataModel (id :" + dataModel.id + ")");
            readTextFromFile(result[0], function (response_json) {
                var response = JSON.parse(response_json);
//                deleteFile(result[0].id);
                dataModel.loadData(response);
                callback();
            });
        };

        //Make new data file if there is no one.
        var error = function(result) {
            var count = result.length;
            console.log("[NODATAFILE] : Found " + count + " DataModel(s)");
            if(count == 0) {
                makeDataFile();
                callback();
            } else {
                for(var i in result) {
                    deleteFile(result[i].id);
                }
            }
        };

        if(result.length == 1) {
            if(result[0].title == DATAFILE) {
                success(result);
            } else {
                error(result);
            }
        } else {
            error(result);
        }
    };

    findFilesWithQuery(query, checker);
    //console.log("finding receipt result : " + result);
    //2. Read the data
    //var filechecking = getFile.bind(RECEIPT, result, null, null);
    //3. Load the data
}

//? 필요 없는듯?
//function countFiles(result, success, error) {
//    var count = result.length;
//
//    if(count == 1) {
//        success(result);
//    } else {
//        error(count);
//    }
//}

function createFile(title, content, callback) {
    var writeData = function(file) {
        console.log('[FILE/I] Name : ' + title + "(" + file.id + ")");
        console.log('[FILE/I] Content : ' + content);
        _writeData(file.id, content, callback);
    };
    _createFile(title, writeData);
};

function _createFile(title, callback) {
    var metadata = {
        'title': title,
        'mimeType': 'application/json',
        'parents': [{
            'id': 'appfolder'
        }]
    };

    var request = gapi.client.request({
        'path': '/drive/v2/files',
        'method': 'POST',
        'params': {'uploadType': 'multipart'},
        'body': JSON.stringify(metadata)
    });

    request.execute(callback);
}


function readTextFromFile(file, success) {
    var url;
    if (file.downloadUrl) {
        url = file.downloadUrl;
    } else if (file.exportLinks){
        url = file['exportLinks']['text/plain'];
    }

    var accessToken = gapi.auth.getToken().access_token;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.onload = function() {
        success(xhr.responseText);
    };
    xhr.onerror = function() {
    };
    xhr.send();
}

function _writeData(fileId, data, callback) {
    var request = gapi.client.drive.files.get({'fileId': fileId});
    request.execute(function(resp) {
        updateFile(fileId, resp, data, callback);
    });
}

function updateFile(fileId, fileMetadata, data, callback) {
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    var contentType = 'application/octet-stream';

    base64Data = Base64.encode(data);


    var multipartRequestBody =
        delimiter +
        'Content-Type: application/json; charest=utf-8\r\n\r\n' +
        JSON.stringify(fileMetadata) +
        delimiter +
        //'Content-Type: ' + contentType + '; charest=utf-8\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        base64Data +
        close_delim;

    var request = gapi.client.request({
        'path': '/upload/drive/v2/files/' + fileId,
        'method': 'PUT',
        'params': {'uploadType': 'multipart', 'alt': 'json'},
        'headers': {
            'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody});

    if (callback) {
        callback();
    }
    request.execute(callback);
}

function deleteFile(fileId) {
    var request = gapi.client.drive.files.delete({
        'fileId': fileId
    });
    request.execute(function(resp) {
        console.log("[Delete] : " + fileId);
    });
}