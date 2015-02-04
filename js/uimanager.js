//view?
//TODO
//what, where의 경우에는 메뉴판을 import하여 사용 가능하게

//페이지 초기화
$(document).on("pagecreate", "#page_new_where", initWherePage);
$(document).on("pagecreate", "#page_new_what", initWhatPage);
$(document).on("pagecreate", "#page_new_who", initWhoPage);

//페이지 열때마다
//back버튼으로 페이지 이동시에는 초기화 안해야 함;;
$(document).on("pagebeforeshow", "#page_new_where", makeWherePage);
$(document).on("pagebeforeshow", "#page_new_what", makeWhatPage);
$(document).on("pagebeforeshow", "#page_new_who", makeWhoPage);

$(document).on("pagebeforeshow", "#dialog_new_group", makeMemberElements);
$(document).on("pagebeforeshow", "#dialog_new_member", makeGroupElements);

//각 단계별 데이터 저장
$(document).on("pagebeforehide", "#page_new_where", leaveWherePage);
$(document).on("pagebeforehide", "#page_new_what", leaveWhatPage);
$(document).on("pagebeforehide", "#page_new_who", leaveWhoPage);

var receipt;

function readyNewReceipt() {
    //load data from APPDATA_JSON
    loadDataFile();
    receipt = new Receipt();
    //page convert
    $.mobile.changePage($("#page_new_where"));
    //newReceiptData.clean();
}

function loadDataFile() {
    getDataFile(loadComplete);
    //TODO: remove test data
    dataModel["where"] = ["a", "b", "c", "d"];
    dataModel["what"] = [
        {
            "place" : "a",
            "menus" : [
                {
                    "name" : "akim",
                    "price" : 5000
                },
                {
                    "name" : "ayam",
                    "price" : 5500
                },
                {
                    "name": "achgg",
                    "price" : 3000
                }
             ]
        },
        {
            "place" : "b",
            "menus" : [
                {
                    "name" : "bkim",
                    "price" : 7000
                },
                {
                    "name" : "byam",
                    "price" : 4500
                },
                {
                    "name": "bchgg",
                    "price" : 1000
                }
             ]
        },
        {
            "place" : "c",
            "menus" : [
                {
                    "name" : "ckim",
                    "price" : 25000
                },
                {
                    "name" : "cyam",
                    "price" : 15500
                },
                {
                    "name": "cchgg",
                    "price" : 13000
                }
             ]
        },
        {
            "place" : "d",
            "menus" : [
                {
                    "name" : "dkim",
                    "price" : 2000
                },
                {
                    "name" : "dyam",
                    "price" : 3500
                },
                {
                    "name": "dchgg",
                    "price" : 4000
                }
             ]
        }
    ];

    dataModel["who"] = [
        {
            "group" : "All",
            "members" : ["손태영", "김건", "이창현", "박윤기", "변영택", "강석길", "안효철"]
        },
        {
            "group" : "IDE",
            "members" : ["손태영", "김건", "이창현", "박윤기"]
        },
        {
            "group" : "CoreUnited",
            "members" : ["변영택", "강석길", "안효철"]
        }
    ];
}

function loadComplete() {
    //로딩완료 안내
}

//초기화 필요한 것들
function initWherePage() {
    // var last = dataModel["where"].length;
    // if(last > 0) {
    //     $("#input_where option:eq(" + (last - 1) + ")").attr("selected", "selected");
    // }

    // $(document).on("change", "#input_where", function(event) {

    // });
}

function initWhatPage() {
    /**
     * 바로 pagecreate에 makeWhatElements를 호출하게 하려고 했으나
     * 이게  $.mobile.changePage($("#page_new_" + step));로 호출되기 때문에
     * makeWhatElements의 인자로 이벤트가 넘어가게 된다. needEmpty가 true가 되어버려서 화면에 아무것도 안나옴
     */
     $(document).on("click", "#list_what label", function(event) {
        $("#list_what input:radio").removeAttr("checked");
        $(this).closest("div").find("input").attr("checked",true).checkboxradio("refresh");
        $("#list_what").enhanceWithin().controlgroup("refresh");
        // $("#list_what input[type='radio']").attr("checked",true).checkboxradio("refresh");
    });
}

function initWhoPage() {
    // $(document).on("click", "#list_group > input[type='radio']", function(event) {
    $(document).on("click", "#list_group label", function(event) {
        // $("#list_group input:radio").removeAttr("selected");
        // $(this).closest("div").find("input").attr("selected", "selected");
        makeMemberPage(true, $(this).text());
    });

    $(document).on("click", "#list_member label", function(event) {
        // var isSelected = $(this).closest("div").find("input").attr("selected");
        // if(typeof(isSelected) == "undefined") {
        //     $(this).closest("div").find("input").attr("selected", "selected");
        // } else if(isSelected == "selected") {
        //     $(this).closest("div").find("input").removeAttr("selected");
        // }
    });
}

function makeWherePage(needEmpty) {
    if(needEmpty) {
        $("#input_where").empty();
    }
    var where, $el;

    for(var index in dataModel["where"]) {
        where = dataModel["where"][index];
        $el = $("<option value='" + where + "'>" + where + "</option>");
        $("#input_where").append($el);
        // $("#input_where option:eq(" + index + ")").removeAttr("selected");
    }
    $("#input_where").selectmenu("refresh");
}

function makeWhatPage(needEmpty) {
    var what = $("#list_what");

    if(needEmpty) {
        $("#list_what").controlgroup("container").empty();
    }
    var menu, price, id, name;
    var what = $("#list_what");

    var selectedWhere = $("#input_where option:selected").val();
    var $el;
    for(var index in dataModel["what"]) {
        if(selectedWhere == dataModel["what"][index][PLACE]) {
            for(var i in dataModel["what"][index][MENUS]) {
                menu = dataModel["what"][index][MENUS][i];
                name = menu.name;
                price =  menu.price;
                id =  _makeEntryId("what", i);
                $el = $( "<label for='" + id + "'>" + name  + " ( " + price + "원 )</label><input type='radio' value='" + name + "' id='" + id + "'></input>" );
                $("#list_what").controlgroup("container").append($el);
            }
        }
    }
    $("#list_what").enhanceWithin().controlgroup("refresh");
    /**
     * list_what 부분을 form태그로 감싸주지 않으면
     * "cannot call methods on controlgroup prior to initialization; attempted to call method 'container'" 에러 발생
     * ->http://stackoverflow.com/questions/21059478/control-group-loses-control-after-dynamic-add-of-radio-button-jquery-mobile
     */
}

//TODO: 입력 공백 체크 필요
//WhatElement has dependency with WhereElement
//http://demos.jquerymobile.com/1.4.5/controlgroup-dynamic/
// function initWhatPage () {
//     var value, id;
//     var what = $("#list_what");

//     var selectedWhere = $("#input_where option:selected").val();
//     var $el;
//     for(var index in dataModel["what"]) {
//         if(selectedWhere == Object.keys(dataModel["what"][index])[0]) {
//             for(var i in dataModel["what"][index][selectedWhere]) {
//                 value = dataModel["what"][index][selectedWhere][i];
//                  console.log(Object.keys(value)[0] );
//                 id =  _makEentRyId(i);
//                 $el = $( "<label for='" + id + "'>" + Object.keys(value)[0]  + "</label><input type='checkbox' id='" + id + "'></input>" );
//                 $("#list_what").controlgroup("container").append($el);
//             }
//         }
//     }
//     $("#list_what").enhanceWithin().controlgroup( "refresh" );
// }

//Save WhoElement with WhatElement
function makeWhoPage (needEmpty) {
    makeGroupPage(needEmpty);
    makeMemberPage(needEmpty);
}

//for page(#list_group)
function makeGroupPage(needEmpty) {
    if(needEmpty) {
        $("#list_group").controlgroup("container").empty();
    }

    var group, id;

    var $el;
    for(var index in dataModel["who"]) {
        group = dataModel["who"][index][GROUP];
        id =  _makeEntryId(GROUP, index);
        $el = $( "<label for='" + id + "'>" + group + "</label><input type='radio' value='" + group + "' id='" + id + "'></input>" );
        $("#list_group").controlgroup("container").append($el);
    }
    $("#list_group").enhanceWithin().controlgroup( "refresh" );
}

//for dialog(#groups)
function makeGroupElements() {
    $("#groups").controlgroup("container").empty();

    var group, id;

    var $el;
    for(var index in dataModel["who"]) {
        group = dataModel["who"][index][GROUP];
        //TODO
        id =  _makeEntryId("1" + GROUP, index);
        $el = $( "<label for='" + id + "'>" + group + "</label><input type='radio' value='" + group + "' id='" + id + "'></input>" );
        $("#groups").controlgroup("container").append($el);
    }
    $("#groups").enhanceWithin().controlgroup( "refresh" );
}

//for page(#list_member)
function makeMemberPage(needEmpty, selected) {
    if(needEmpty) {
        $("#list_member").controlgroup("container").empty();
    }

    var selected_group, group, members, member, id, $el;

    if(selected) {
        selected_group = selected;
    } else {
        selected_group = DEFAULT_GROUP;
    }

    for(var index in dataModel["who"]) {
        group = dataModel["who"][index][GROUP];
        if(group == selected_group) {
            members = dataModel["who"][index][MEMBERS];
            for(var i in members) {
                member = members[i];
                id =  _makeEntryId(MEMBERS, i);
                $el = $( "<label for='" + id + "'>" + member + "</label><input type='checkbox' value='" + member + "' id='" + id + "'></input>" );
                $("#list_member").controlgroup("container").append($el);
            }
        }
    }
    $("#list_member").enhanceWithin().controlgroup( "refresh" );
}

function makeMemberElements() {
    $("#members").controlgroup("container").empty();
    var group, members, member, id, $el;

    for(var index in dataModel["who"]) {
        group = dataModel["who"][index][GROUP];
        if(group == DEFAULT_GROUP) {
            members = dataModel["who"][index][MEMBERS];
            for(var i in members) {
                member = members[i];
                id =  _makeEntryId("1" + MEMBERS, i);
                $el = $( "<label for='" + id + "'>" + member + "</label><input type='checkbox' value='" + member + "' id='" + id + "'></input>" );
                $("#members").controlgroup("container").append($el);
            }
        }
    }
    $("#members").enhanceWithin().controlgroup( "refresh" );
}



function openPage(step) {
    $.mobile.changePage($("#page_new_" + step));
}

function openNewDialog(step) {
    //input initialize
    var id = "dialog_new_" + step;
    $("#" + id + " input").val('');
    //$("#" + id + " input").css("border","1px solid #ff0000");
    if(step == "group") {
        $.mobile.changePage($("#" + id));
    } else if( step == "member") {
        $.mobile.changePage($("#" + id));
    } else {
        $.mobile.changePage($("#" + id));
    }
}

// function showGroups() {
//     var groups = $("#groups");
// }

// function showMembers() {
//     var members = $("#members");
// }

function saveReceipt() {
    $.mobile.changePage($("#page_receipt_list"));
}

function _makeEntryId(step, index) {
    return step + "_entry_" + index;
}