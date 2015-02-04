var CLIENT_ID="1003542821097-6bgij3g8081as4nf9tm9re6a288pi3km.apps.googleusercontent.com";
var SCOPES=[
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
    //'https://www.googleapis.com/auth/drive.appdata'
    'https://www.googleapis.com/auth/drive.appfolder'
];
//데이터 지우고 새 데이터 파일 만들때 문제 확인

var APPDATA = {};

var RECEIPT_JSON = 'receipt.json';

//var APPDATA_META;
var APPDATA_ID;

function handleClientLoad() {
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
        showReceipt();
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

function showReceipt() {
    //1. Find receipt file
    //var query = ('"appfolder" in parents');
    var query = ('"appfolder" in parents and title != "' + APPDATA_JSON + '"');
    var success = function(result) {
        console.log("[SUCCESS] : Get Receipt");
    };

    var error = function(count) {
        console.log("[ERROR] : Get Receipt(" + count + ")");
    };
    findFilesWithQuery(query, success, error);
    //console.log("finding receipt result : " + result);
    //2. Read the data
    //var filechecking = getFile.bind(RECEIPT_JSON, result, null, null);
    //3. Load the data
}

function findFilesWithQuery(query, success, error) {
    console.log("[FIND FILES] : " + query);
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
                    countFiles(result, success, error);
                }
            });
        };
        return retrievePageOfFiles(listRequest, []);
    });
}
/*
function getAppMetaData(callback) {
    var request = gapi.client.drive.files.get({
        'fileId': 'appfolder',
        'title' : APPDATA_JSON
    });
    request.execute(function(resp) {
        APPDATA_META = resp;
        console.log("Get MetaData [" + resp.title + ":" + resp.id + "]");
        callback(resp.id);
    });
}*/

function getDataFile(callback) {
    //1. Find APPDATA_JSON file
    var query = ('"appfolder" in parents and title = "' + APPDATA_JSON + '"');

    //Read data file and make it to data model
    var success = function(result) {
        APPDATA_ID = result[0].id;
        dataModel.id = result[0].id;
        console.log("[SUCCESS] : get datafile(" + dataModel.id + ")");
        readTextFromFile(result[0], function (response_json) {
            //APPDATA = {};
            //deleteFile(result[0].id);
            var response = JSON.parse(response_json);
            dataModel.loadData(response);
            callback();
        });
    };


    //Make new data file if there is no one.
    var error = function(count) {
        console.log("[FAIL] : Get " + count + " datafile(s)");
        var empty = {};
        createFile(APPDATA_JSON, JSON.stringify(empty));
    };

    findFilesWithQuery(query, success, error);
    //console.log("finding receipt result : " + result);
    //2. Read the data
    //var filechecking = getFile.bind(RECEIPT, result, null, null);
    //3. Load the data
}

function countFiles(result, success, error) {
    var count = result.length;

    if(count == 1) {
        success(result);
    } else {
        error(count);
    }
}

function createFile(title, content) {
    var callback = function(file) {
        console.log('[READY] Write Data : ' + title + "(" + file.id + ")");
        _writeData(file.id, content);
    };
    _createFile(title, callback);
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

function _writeData(fileId, data) {
    var request = gapi.client.drive.files.get({'fileId': fileId});
    request.execute(function(resp) {
        updateFile(fileId, resp, data, null);
    });
}

function updateFile(fileId, fileMetadata, data,  callback) {
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

    if (!callback) {
        callback = function(file) {
        };
    }
    request.execute(callback);
}

function deleteFile(fileId) {
    var request = gapi.client.drive.files.delete({
        'fileId': fileId
    });
    request.execute(function(resp) {
        console.log("Delete" + resp);
    });
}

function saveDataFile() {
    alert(JSON.stringify(dataModel));
}