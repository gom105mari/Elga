var selectedMenu;

var WHEN, WHERE, WHAT, WHOG, WHOM;
var ELS = [WHEN, WHERE, WHAT, WHOG, WHOM];
var data = {};

//TODO: 중복 체크 필요 
function initializeElements() {
    data = {};
    WHEN = {
        key : "when",
        label : LABEL_WHEN, 
        helpmsg : "",
        func : function () {
            var dWhen = document.getElementById('div_when');
            dWhen.innerHTML = "<label class='style_when' onclick='addTitle()'>" + "+" + "</label>"; 
            //dWhen.innerHTML = "<label>" + WHEN.label + " : <input type='date' id='date' /></label>";                  
        },
        maxcnt : 1
    };

    WHERE = {
        key : "where",
        label : LABEL_WHERE, 
        helpmsg : MSG_SELECT_WHERE,
        func : function (value) {           

            var dWhere = document.getElementById('div_where');      

            dWhere.innerHTML = "<label class='style_where' onclick='addText(\"" + WHERE.key + "\", " + WHERE.maxcnt + ")'>" + "+" + "</label>"; 
            //dWhere.innerHTML += "<input type='button' value='+' onclick='openAddDialog(\"" + WHERE.key + "\", " + WHERE.maxcnt + ")'>"; 
            //dWhere.innerHTML += "<label>" + WHERE.label + " : </label>";

            var restaurants;
            if(APPDATA != null) {
                restaurants = APPDATA[WHERE.key];
            }
            if(restaurants == 'undefined' || restaurants == null) {
                //addText(WHERE.key, WHERE.maxcnt);
            } else {                
                for(var index in restaurants) {
                    //dWhere.innerHTML += "<input type='radio' id='radio_where' value='" + restaurants[index] + "' style='display:none;' onclick='setRestaurant(this.value)'>"
                    //dWhere.innerHTML += "<label for='radio_where' class='style_where' >" + restaurants[index] + "</label>"; 
                    dWhere.innerHTML += "<label class='style_where' id=" + index + " onclick='setRestaurant(" + index + ")'>" + restaurants[index] + "</label>"; 
                }
            }
            //document.getElementById('div_help_label').innerHTML = WHERE.helpmsg;
        },
        maxcnt : 1
    };

    WHAT = {
        key : "what",
        label : LABEL_WHAT,
        helpmsg : MSG_SELECT_WHAT,
        func : function (selection) {
            selectedMenu = selection;

            var dWhat = document.getElementById('div_what');        
            //dWhat.innerHTML = "<input type='button' value='+' onclick='openAddDialog(\"" + WHAT.key + "\", " + WHAT.maxcnt + ", \"" + selection + "\")'>"; 
            //dWhat.innerHTML += "<label>" + WHAT.label + " : </label>";
            dWhat.innerHTML = "<label class='style_what' onclick='openAddDialog(\"" + WHERE.key + "\", " + WHERE.maxcnt + ")'>" + "+" + "</label>"; 
            
            var menu = APPDATA[selection];
            if(typeof (menu) == 'undefined' || menu == null) {
                APPDATA[selection] = [];
                //addText(WHAT.key, WHAT.maxcnt, selection);
            } else {            
                for(var key in menu) {
                    //dWhat.innerHTML += "<input type='button' name='button_what' value='" + key + " (" + menu[key] + "원)' onclick='setMenu(\"" + key + "\", " + menu[key] + ")'>"; 
                    dWhat.innerHTML += "<label class='style_what' onclick='setMenu(\"" + key + "\", " + menu[key] + ")'>" + key + " " + menu[key]  +"원" + "</label>";
                }
            }

            //document.getElementById('div_help_label').innerHTML = WHAT.helpmsg;
        },
        maxcnt : 20
    };

    WHOG = {
        key : "whog",
        label : LABEL_WHO_GROUP,
        helpmsg : MSG_SELECT_WHO_GROUP,
        func : function () {
            var dGroup = document.getElementById('div_whog'); 
            //dGroup.innerHTML = "<input type='button' value='+' onclick='openAddDialog(\"" + WHOG.key + "\", " + WHOG.maxcnt + ")'>";
            dGroup.innerHTML = "<label class='style_whog' onclick='openAddDialog(\"" + WHOG.key + "\", " + WHOG.maxcnt + ")'>" + "+" + "</label>";
            dGroup.innerHTML += "<label class='style_whog' value='All' id='all' onclick='setGroup(this.value)'>" + "ALL" + "</label>";   
            var group = APPDATA[WHOG.key];
            if(typeof (group) == 'undefined' || group == null) {

            } else {
                for(var index in group) {
                    //dGroup.innerHTML += "<input type='button' value='" + group[index] + "' id='" + group[index] + "' onclick='setGroup(this.value)'>"; 
                    dGroup.innerHTML += "<label class='style_whog' id=" + index + " onclick='setGroup(" + index + ")'>" + group[index] +"</label>";; 
                    
                }
                //document.getElementById('div_help_label').innerHTML = WHOG.helpmsg;
            }
        },
        maxcnt : 20
    };

    WHOM = {
        key : "whom",
        label : LABEL_WHO_MEMBER,
        helpmsg : MSG_SELECT_WHO_MEMBER,
        func : function (member) {
            var dMember = document.getElementById('div_whom');
            //dMember.innerHTML = "<input type='button' value='+' onclick='openAddDialog(\"" + WHOM.key + "\", " + WHOM.maxcnt + ", \"" + selection + "\")'>";
            dMember.innerHTML = "<label class='style_whom' onclick='openAddDialog(\"" + WHOM.key + "\", " + WHOM.maxcnt + ")'>" + "+" + "</label>";
            
            if(typeof (member) == 'undefined' || member == null) {

            } else {
                for(var index in member) {
                    //dMember.innerHTML += "<input type='button' value='" + member[index] + "' id='" + member[index] + "' onclick='setMember(this.value)'>"; 
                    dMember.innerHTML += "<label class='style_whom' id='" + member[index] + "' onclick='setMember(\"" + member[index] + "\")'>" + member[index] + "</label>"; 
                }
                //document.getElementById('div_help_label').innerHTML = WHOM.helpmsg;
            }
        },
        maxcnt : 20
    };
}

function showContent() {    
    WHEN.func();    
}

function addTitle() {
    var txt_title = document.getElementById('txt_title');
    if(typeof(txt_title) == 'undefined' || txt_title == null) {
        var dWhen = document.getElementById('div_when');
        dWhen.innerHTML += "<input type='text' class='style_when' id='txt_title' onkeypress='setTitle(event, this)'/>";
        var date = new Date();
        data[WHEN.key] = date.toLocaleDateString();
        dWhen.innerHTML += "<label class='style_when' id='lbl_date'>" + data[WHEN.key] + "</label>";
        //WHERE.func();
    }            
    //var date = new Date();
    //document.getElementById('date').valueAsDate = date;
    //data[WHEN.key] = date.toLocaleDateString();
    //dWhen.innerHTML += "<label class='style_when' id='lbl_date'>" + data[WHEN.key] + "</label>";
    //WHERE.func();
}

function setTitle(event, element) {
    if(event.keyCode == 13) {
        var value = element.value;
        data["Title"] = value;
        console.log("Title : " + data["Title"]);
        console.log("Date : " + data[WHEN.key]);
        WHERE.func();
    }
}

function setRestaurant(index) {
    var restaurants = APPDATA[WHERE.key];
    data[WHERE.key] = restaurants[index] ;
    WHAT.func(restaurants[index]);
}

function setMenu(selection, price) {
    selectedMenu = selection;
    var menu = data[WHAT.key];
    if(typeof (menu) == 'undefined' || menu == null) {
        data[WHAT.key] = {};
    }
    data[WHAT.key][selectedMenu] = price;
    /*if(!(data.hasOwnProperty(selection))){
        data[selection] = [];
    }*/
    WHOG.func();
    //showGroup();    
}

function setGroup(index) {
    var member;
    if(typeof(index) == 'undefined') {
        member = APPDATA[WHOM.key];
    } else {
        group = APPDATA[WHOG.key];
        member = APPDATA[group[index]];
    }   
    WHOM.func(member);
}

function setMember(selection) {
    var member = data[selectedMenu];
    if(typeof (member) == 'undefined' || member == null) {
        data[selectedMenu] = [];
    }
    var isFind = false;
    for(var i in member) {
        if(member[i] == selection) {
            isFind = true;
            //TODO: change color
            break;
        }
    }
    if(isFind) {
        data[selectedMenu].pop(selection);
    } else {
        data[selectedMenu].push(selection);
    }
    showResult();
}

function addData(doc) {
    var key = doc.className;
    var d = document.getElementById('input_'+doc.id);
    var value = document.getElementById('input_'+doc.id).value;
    APPDATA[key].push(value);
    //save(APPDATA);
    callback(value);
}

function showResult() {
    var result = document.getElementById('result');   
    //result.innerHTML = "<input type='button' value='save' onclick='save()'>";
    result.innerHTML = "";
    for(var key in data[WHAT.key]) {        
        if(data.hasOwnProperty(key)){
            result.innerHTML += "<br>";
            result.innerHTML += data[WHERE.key] + " : ";
 
            result.innerHTML += "[" + key + " : " + data[WHAT.key][key] + "원] - ";      

            var memberArr = data[key];

            for(var i in memberArr) {
                result.innerHTML += " " + memberArr[i];
            }
            result.innerHTML += " 합계 : " + data[WHAT.key][key] * memberArr.length + "원";
            result.innerHTML += "</br>";

            var btn_save = document.getElementById('btn_save');
            if(typeof(btn_save) == 'undefined' || btn_save == null) {
                var buttons = document.getElementById('div_buttons');
                buttons.innerHTML = "<label class='style_when' id='btn_save' onclick='save()'>" + "SAVE" + "</label>";
            }
        }
    }
}

function save() {
    var str = JSON.stringify(data);
    console.log(str);
    createDataFile(data["Title"], str);
    showFileList();
    //writeData(null, data);
}

function converButton(event, element, key) {    
    if(event.keyCode == 13) {
        var values = APPDATA[key];
        var value = element.value;
        var doc = element.parentElement;
        var isUnique = true;

        if(typeof(values) != 'undefined' && values != null) {
            for(var index in values) {
                if(values[index] == value) {
                    isUnique = false;
                    //document.getElementById('div_help_label').innerHTML = "중복 데이터가 있습니다.";
                    break;
                }
            }
        }
        if(isUnique) {
            doc.innerHTML += "<input type='button' name='button_" + key + "' value='" + value + "' onclick='showMenu(this.value)'>"; 
            var child = document.getElementById(element.id);
            doc.removeChild(child);
            APPDATA[key].push(value);
            //document.getElementById('div_help_label').innerHTML = "";
        }
    }
}

function showFileList() {
    var list = getFileList3(null);
    for(var index in list) {
        item = list[index];
        if(typeof (item) != 'undefined') {
            console.log(item.title);
        }
    }  
}

function openAddDialog() {
}

function showListDiv() {
    changeDisplay(true);
    getFileList2(function(result) {
        for(var index in result) {
            var item = result[index];
            if(typeof (item) != 'undefined') {
                if(item.title != APPDATA_NAME) {
                    console.log(index + ":" + item.title + "(" + item.modifiedDate + ")");
                }
            }
        }  
    });
}

function showNewDiv() {
    changeDisplay(false);
    executeWithDrive(getFileList);
}

function changeDisplay(showList) {
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