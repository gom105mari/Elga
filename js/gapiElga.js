var CLIENT_ID="1003542821097-6bgij3g8081as4nf9tm9re6a288pi3km.apps.googleusercontent.com";
var SCOPES=[
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
    //'https://www.googleapis.com/auth/drive.appdata'
    'https://www.googleapis.com/auth/drive.appfolder'
];

var APPDATA_NAME = 'data.json';
var APPDATA_META;
var APPDATA = null;
var RECEIPT = 'receipt.json';

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
    var query = ('"appfolder" in parents');
    //var query = ('"appfolder" in parents and title = "' + RECEIPT + '"');
    FgetFileList(query, checkFile(RECEIPT));
    //console.log("finding receipt result : " + result);
    //2. Read the data
    //var filechecking = checkFile.bind(RECEIPT, result, null, null);
    //3. Load the data
}

function FgetFileList(query, callback) {
    console.log("[Get file list] : " + query);
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
                    console.log("returning result");
                    callback(result);
                }
            });
        };    
        return retrievePageOfFiles(listRequest, []);
    });
}

function getAppMetaData(callback) {
    var request = gapi.client.drive.files.get({
        'fileId': 'appfolder'
    });
    request.execute(function(resp) {
        APPDATA_META = resp;
        console.log("Get MetaData [" + resp.title + ":" + resp.id + "]");
        callback(resp.id);
    });
}

function getFileList2(callback) {
    gapi.client.load('drive', 'v2', function() {
        var query = ('"appfolder" in parents');
        console.log("[Get File List in appfolder");
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
                    callback(result);
                    /*for(var index in result) {
                        var item = result[index];
                        if(typeof (item) != 'undefined') {
                            if(item.title != APPDATA_NAME) {
                                console.log(index + ":" + item.title + "(" + item.modifiedDate + ")");
                            }
                        }   
                    }*/
                    callback();  
                }
            });
        };    
        retrievePageOfFiles(listRequest, []);
    });
}

function getFileList() { 
//var query = '\'appdata\' in parents and title = \'' + APPDATA_NAME + '\''; 
//var query = 'title = \'aaa.aaa\'';
var query = ('"appfolder" in parents and title = "' + APPDATA_NAME + '"');
    console.log("Query : " + query);
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
                checkAppDataFile(result);
            }
        });
    };    
    
    retrievePageOfFiles(listRequest, []);
}

function getFileList3(callback) { 
//var query = '\'appdata\' in parents and title = \'' + APPDATA_NAME + '\''; 
//var query = 'title = \'aaa.aaa\'';
var query = ('"appfolder" in parents');
    console.log("Query : " + query);
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
                if(callback != null) {
                    checkAppDataFile(result);
                } else {
                    return result;
                }
            }
        });
    };    
    
    retrievePageOfFiles(listRequest, []);
}

function deleteFile(fileId) {
      var request = gapi.client.drive.files.delete({
        'fileId': fileId
      });
      request.execute(function(resp) {
            console.log("delete" + resp);
         });
    }

function checkFile(result, filename, callback1, callback2) {
    var isFind = false;

    var item;
    for(var index in result) {
        item = result[index];
        if(typeof (item) != 'undefined') {
            if(item.title == filename) {
            
            isFind = true;
            break;
            }
        }
    }     

    if(isFind) {
        console.log("[EXIST] : " + filename);        
        callback1();
    } else {
        console.log("[NON-EXIST] : " + filename);
        callback2();
    }
}  

function checkAppDataFile(result) {
    var isFind = false;
    var item;
    for(var index in result) {
        item = result[index];
        if(typeof (item) != 'undefined') {
            if(item.title == APPDATA_NAME) {
            console.log('Data Exist');
            isFind = true;
            break;
            }
        }
    }     

    if(isFind) {        
        getFileData(item, function (response) {
            APPDATA = JSON.parse(response);
                // for(var key in APPDATA) {
                // if(WHOG[key] == key) {
                //     groups = APPDATA[key];
                // } else if(WHOM[key] == key) {
                //     members = APPDATA[key];
                // } else if(WHERE[key] == key) {
                //     restaurants = APPDATA[key];
                // }
               //console.log(key + ":" + APPDATA[key]);
           // }
            showContent(WHEN.callback);
        });    
    } else {
        console.log('No AppData File exist');
        var createAppData = function (id) {
            var metadata = {
                'title': APPDATA_NAME,
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

            request.execute(function(file) {
                console.log('AppData Created');
                console.log(file);
                writeData(file.id, "");
                showContent(WHEN.callback);
            });
        };
        //getAppMetaData(createAppData);
        createAppData();
    }
}

function createDataFile(title, content) {
    var callback = function(file) {
        console.log('Data file created : ' + title + "(" + file.id + ")");
        writeData(file.id, content);
    };
    _createDataFile(title, callback);
};

function _createDataFile(title, callback) {
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


function getFileData(file, callback) {
    var url;
    if (file.downloadUrl) {
        url = file.downloadUrl;
    } else if (file.exportLinks){
        url = file['exportLinks']['text/plain'];
    }
    //TODO:temp
    url = 'https://docs.google.com/feeds/download/documents/export/Export?id=1q9-dUZ21i5xPLLBOHxPoteKhdpdtKEJKz6dxIF9peBs&exportFormat=txt';
    var accessToken = gapi.auth.getToken().access_token;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.onload = function() {
        callback(xhr.responseText);
    };
    xhr.onerror = function() {
    };
    xhr.send();
}

function writeData(fileId, data) {  
    //TODO: remove
    //fileId = '1q9-dUZ21i5xPLLBOHxPoteKhdpdtKEJKz6dxIF9peBs';

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
            console.log(file);
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