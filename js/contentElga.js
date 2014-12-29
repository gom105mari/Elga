//var selectedMenu;
var selection = ["", "", "", "", ""]; //각 단계별 최근 선택 사항(when, where, what, whog, whom)
var WHEN, WHERE, WHAT, WHOG, WHOM;
var default_group = "ALL";
var PROCESS; //각 스텝들
var content; //선택 정보들
var currentStep;

//TODO: 중복 체크 필요
//list, new버튼이 list로드 한후에 생기도록 수정해야함
//메뉴, 식당, 멤버 추가시 (,) 는 입력안되게 처리
//element 삭제 기능 추가
//기능: 기간 설정 내에 검색,
//기능: 이용자 검색(음식먹은사람)
//기능: export기능(메뉴 제출용), import??
//기능: 멤버의 select all기능
//버그: new를 두번 누르면 데이터들이 두배로 추가 -_-;
function initializeSteps() {
    content = {};
    WHEN = {
        key : "when",
        label : LABEL_WHEN,
        helpmsg : "",
        func : function () {
            var txt_title = document.getElementById('txt_title');
            if(typeof(txt_title) === 'undefined' || txt_title == null) {
                var dWhen = document.getElementById('div_when');
                var date = new Date();
                content[WHEN.key] = date.toLocaleDateString();
                dWhen.innerHTML += "<label class='style_when' id='lbl_date'>" + content[WHEN.key] + "</label>";
                dWhen.innerHTML += "<input type='text' class='style_when' id='txt_title' placeholder='title' onkeypress='setTitle(event, this)'/>";
                //WHERE.func();
            }
        },
        step : 0
    };

    WHERE = {
        key : "where",
        label : LABEL_WHERE,
        helpmsg : MSG_ADD_WHERE,
        makeInit : function() {
            var dWhere = document.getElementById('div_where');
            dWhere.innerHTML = "<label class='style_where' onclick='openPlusBox(" + WHERE.step +")'>" + "+" + "</label>";

            var restaurants = APPDATA[WHERE.key];

            if(typeof(restaurants) === 'undefined' || restaurants === null) {
                openPlusBox(WHERE.step);
            } else {
                for(var index in restaurants) {
                    this._makeElement(dWhere, index);
                }
            }
        },
        _makeElement : function(dWhere, index) {
            dWhere.innerHTML += "<label class='style_where' id=" + index + " onclick='selectElement(" + WHERE.step + "," + index + ")'>" + APPDATA[WHERE.key][index] + "</label>";
        },
        step : 1
    };

    WHAT = {
        key : "what",
        label : LABEL_WHAT,
        helpmsg : MSG_ADD_WHAT,
        makeInit : function() {
            var dWhat = document.getElementById('div_what');
            dWhat.innerHTML = "<label class='style_what' onclick='openPlusBox(" + WHAT.step + ")'>" + "+" + "</label>";

            var restaurant = selection[WHAT.step -1];
            var menu = APPDATA[restaurant];
            if(typeof (menu) === 'undefined' || menu === null) {
                openPlusBox(WHAT.step);
            } else {
                for(var index in menu) {
                    this._makeElement(dWhat, index, menu[index]['menu']);
                }
            }
        },
        _makeElement : function(dWhat, index, value ) {
            dWhat.innerHTML += "<label class='style_what' id=" + index + " onclick='selectElement(" + WHAT.step + "," + index + ")'>" + value + "</label>";
        },
        step : 2
    };

    WHOG = {
        key : "whog",
        label : LABEL_WHO_GROUP,
        helpmsg : MSG_ADD_WHO_GROUP,
        makeInit : function() {
            var dGroup = document.getElementById('div_whog');
            dGroup.innerHTML = "<label class='style_whog' onclick='openPlusBox(" + WHOG.step + ")'>" + "+" + "</label>";

            var group = APPDATA[WHOG.key];

            if(typeof (group) === 'undefined' || group === null) {
                //'ALL'은 default element
                APPDATA[WHOG.key] = [default_group];
                dGroup.innerHTML += "<label class='style_whog' value='ALL' id='all' onclick='selectElement(" + WHOG.step + ","  + 0 + ")'>" + "ALL" + "</label>";
            } else {
                for(var index in group) {
                    this._makeElement(dGroup, index, group[index]);

                }
            }
        },
        _makeElement : function(dGroup, index, value) {
            dGroup.innerHTML += "<label class='style_whog' id=" + index + " onclick='selectElement(" + WHOG.step + ","  + index + ")'>" + APPDATA[WHOG.key][index] +"</label>";
        },
        step : 3
    };

    WHOM = {
        key : "whom",
        label : LABEL_WHO_MEMBER,
        helpmsg : MSG_ADD_WHO_MEMBER,
        makeInit : function () {
            var dMember = document.getElementById('div_whom');

            dMember.innerHTML = "<label class='style_whom' onclick='openPlusBox(" + this.step + ")'>" + "+" + "</label>";
            var group = selection[this.step -1];
            var member = APPDATA[group];

            if(typeof (member) === 'undefined' || member === null) {
                openPlusBox(WHOM.step);
            } else {
                for(var index in member) {
                    this._makeElement(dMember, index, member[index]);
                }
            }
        },
        _makeElement : function(dMember, index, value) {
            dMember.innerHTML += "<label class='style_whom' id=" + index + " onclick='selectElement(" + this.step + ","  + index + ")'>" + value +"</label>";
        },
        step : 4
    };

    SAVE = {
        makeInit : function () {
            var dMember = document.getElementById('div_result');
            if(dMember.innerHTML.length <= 0) {
                dMember.innerHTML = "<label class='style_whom' onclick='writeContent()'>" + "SAVE" + "</label>";
            }
        },
        step : 5
    }
    PROCESS = [WHEN, WHERE, WHAT, WHOG, WHOM, SAVE];
}

function showSteps() {
    //TODO: file 로딩은 한번만 하도록개선해야할듯. 최초 로딩이후에는메모리에 있는걸로
    initializeSteps();
    WHEN.func();
}

function setTitle(event, element) {
    if(event.keyCode == 13) {
        var value = element.value;
        content["title"] = value;
        console.log("[TITLE] : " + content["title"]);
        console.log("[DATE] : " + content[WHEN.key]);
        WHERE.makeInit();
    }
}

function openPlusBox(step) {
    //TODO: show dialog
    var text = document.getElementById('add-text');
    var obj = PROCESS[step];
    currentStep = obj;
    text.innerText = obj.helpmsg;
}

function closePlugBox() {
    if(event.keyCode == 13) {
        var text = document.getElementById('add-text').innerText;
        var value = document.getElementById('new-element').value;
        var obj = currentStep;

        var key, data ={};
        if(obj === WHAT || obj === WHOM) {
            key = selection[obj.step - 1];
            if(obj === WHAT) {
                var price = 0; //temp
                data['menu'] = value;
                data['price'] = price;
            } else {
                data = value;
                if(default_group !== key) {
                    _setCleanAndPush(APPDATA, default_group, data);
                }
            }
        } else {
            key = obj.key;
            data = value;
        }

        _setCleanAndPush(APPDATA, key, data);

        obj.makeInit();
        writeAPPDATA();
        //TODO: close the box
    }
}

function _setCleanAndPush(element, key, data) {
    if(typeof(element[key]) === 'undefined' || element[key] === null) {
                element[key] = [];
    }
    if(data) {
        element[key].push(data);
    }
}

function selectElement(step, index) {
    var dataKey;
    var key = PROCESS[step].key;
    var data;
    if(step === WHAT.step || step === WHOM.step) {
        dataKey = selection[step - 1];
    } else {
        dataKey = key;
    }
    data = APPDATA[dataKey];
    //TODO NOW
    // if(typeof (data) === 'undefined' || data === null) {
    // }
    if(step === WHAT.step) {
        selection[step] = data[index]['menu'];
    } else {
        selection[step] = data[index];
    }
    //set to content
    if(key === WHAT.key || key === WHOM.key) {
        if (key === WHAT.key) {
            var menu = data[index]['menu'];
            var price = data[index]['price'];
            var obj = {};
            obj[menu] = price;
            //var where = selection[WHERE.step];
            // content[WHAT.key][key] = price;
            // if(!(content.hasOwnProperty(key))) {
            //     content[key] = [];
            // }
            _setCleanAndPush(content, WHAT.key, obj);
        } else {
            key = selection[WHAT.step];
            // data??
            //data = content[key];
            _setCleanAndPush(content, key, selection[step]);
            // content[key].push(selection[step]);
        }
    } else if(key === WHERE.key) {
        //key = selection[step];
        content[key] = selection[step];
        /*if(!(content.hasOwnProperty(key))) {
                content[key] = {};
        }*/
    }
    console.log("selection : " + selection[step]);
    (PROCESS[step + 1]).makeInit();
}

function showNewDiv() {
    convertDiv(false);
    //executeWithDrive(getInfoFile);
    addNewReceipt();
}

function convertDiv(showList) {
    var div_list = document.getElementById("div_list");
    var div_new = document.getElementById("div_new");

    if(showList == true) {
        if(div_list.style.display == 'none') {
            div_list.style.display = 'block';
        }
        if(div_new.style.display == 'block') {
            div_new.style.display = 'none';
        }
    } else {
        if(div_list.style.display == 'block') {
            div_list.style.display = 'none';
        }
        if(div_new.style.display == 'none') {
            div_new.style.display = 'block';
        }
    }
}

function writeAPPDATA() {
    _writeData(APPDATA_ID, JSON.stringify(APPDATA));
}

function writeContent() {
    var title = content["title"] + "_" + content["when"] + "_" + content["where"];
    console.log(title);
    //createDataFile(title, content);
}