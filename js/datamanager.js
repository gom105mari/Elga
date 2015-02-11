function makeDataFile() {
    var empty = {"who" : [{"group" : DEFAULT_GROUP}]};
    createFile(DATAFILE, JSON.stringify(empty), function() {
        console.log("[SUCCESS] File created");
    });
}

function initDataFile(callback) {
    getDataFile(callback);
    //TODO: remove test data
//    dataModel["where"] = ["a", "b", "c", "d"];
//    dataModel["what"] = [
//        {
//            "place" : "a",
//            "menus" : [
//                {
//                    "name" : "akim",
//                    "price" : 5000
//                },
//                {
//                    "name" : "ayam",
//                    "price" : 5500
//                },
//                {
//                    "name": "achgg",
//                    "price" : 3000
//                }
//            ]
//        },
//        {
//            "place" : "b",
//            "menus" : [
//                {
//                    "name" : "bkim",
//                    "price" : 7000
//                },
//                {
//                    "name" : "byam",
//                    "price" : 4500
//                },
//                {
//                    "name": "bchgg",
//                    "price" : 1000
//                }
//            ]
//        },
//        {
//            "place" : "c",
//            "menus" : [
//                {
//                    "name" : "ckim",
//                    "price" : 25000
//                },
//                {
//                    "name" : "cyam",
//                    "price" : 15500
//                },
//                {
//                    "name": "cchgg",
//                    "price" : 13000
//                }
//            ]
//        },
//        {
//            "place" : "d",
//            "menus" : [
//                {
//                    "name" : "dkim",
//                    "price" : 2000
//                },
//                {
//                    "name" : "dyam",
//                    "price" : 3500
//                },
//                {
//                    "name": "dchgg",
//                    "price" : 4000
//                }
//            ]
//        }
//    ];
//
//    dataModel["who"] = [
//        {
//            "group" : "All",
//            "members" : ["손태영", "김건", "이창현", "박윤기", "변영택", "강석길", "안효철"]
//        },
//        {
//            "group" : "IDE",
//            "members" : ["손태영", "김건", "이창현", "박윤기"]
//        },
//        {
//            "group" : "CoreUnited",
//            "members" : ["변영택", "강석길", "안효철"]
//        }
//    ];
}

function leaveWherePage() {
    var date = new Ymd();
    date.setDate($("#input_when").val());

    var place = new Place();
    place.name = $("#input_where option:selected").val();

    ReceiptModel.setDate(date);
    ReceiptModel.setPlace(place);
}

function leaveWhatPage() {
    var menu = new Menu();
    menu.name = $("#list_what input:checked").val();

    var place,key, menus;
    for(var i in dataModel["what"]) {
        key = dataModel["what"][i][PLACE];
        place = ReceiptModel.getPlaceName();
        if(key == place) {
            menus = dataModel["what"][i][MENUS];
            for(var j in menus) {
                if(menus[j][NAME] == menu.name) {
                    menu.price = menus[j][PRICE];
                    break;
                }
            }
        }
    }
    ReceiptModel.setMenus(menu);
}

function leaveWhoPage() {
    var name = $("#list_what input:checked").val();
    var members = $("#list_member input:checked");
    var menu = ReceiptModel.getMenu(name);
    var member;

    $("#list_member input:checked").each(function() {
        member = new Member();
        member.name = $(this).val();
        ReceiptModel.setMenus(menu, member);
    });
}

function addElement(step) {
    _setDataModel(step);
    _addElement(step);
}

function _addElement(step) {
    var elementFunc = "_add" + step.charAt(0).toUpperCase() + step.slice(1) + "Element()";
    eval(elementFunc);
}

function _addWhereElement() {
    // var value = $("#input_new_where").val();

    // $("#input_where").append("<option value='" + value + "'>" + value + "</option>");
    // $("#input_where").selectmenu('refresh');
    makeWherePage(true);
    openPage("where");
}

function _addWhatElement() {
    // var menu = $("#input_new_what").val();
    // var index  = $("#list_what input[type='checkbox']").length;

    // var id = _makeEntryId("what", index);

    // $el = $( "<label for='" + id + "'>" +menu + "</label><input type='checkbox' id='" + id + "'></input>" );
    // $("#list_what").controlgroup("container").append($el);
    // $("#list_what").enhanceWithin().controlgroup( "refresh" );

     /**왜 이럴까...?????
      * 1. 이 경우 제대로 동적 생성
         $("#list_what").controlgroup("container").append($el);
         $("#list_what").enhanceWithin().controlgroup( "refresh" );
        2. 이 경우 체크박스만 생기고 버튼이나 라벨이 보이지 않음
         var cg_what = $("#list_what");
         cg_what.controlgroup("container").append($el);
         $("#list_what").enhanceWithin().controlgroup( "refresh" );
        3. 표면적으로 변화가 없다.
         var cg_what = $("#list_what");
         cg_what.controlgroup("container").append($el);
         cg_what.enhanceWithin().controlgroup( "refresh" );
     */
    makeWhatPage(true);
    openPage("what");
}

function _addWhoElement() {
    makeWhoPage(true);
    openPage("who");
}

function _setDataModel(step) {

    if(step == WHERE) {
        var where = $("#input_new_where").val();
        dataModel.addWhere(where);
    } else if(step == WHAT) {
        var where = $("#input_where option:selected").val();
        var name = $("#input_new_what").val();
        var price = $("#input_new_what_price").val();

        dataModel.addWhat(where, name, price);
    } else if(step == WHO) {
        var id = $.mobile.activePage.attr('id');
        if(id == "dialog_new_group") {
            var group = $("#input_new_group").val();
            var members = [];
            $("#members input:checked").each(function() {
                members.push($(this).val());
            });
            dataModel.addGroup(group, members);
        } else {
            var group = $("#groups input:checked").val();
            var member = $("#input_new_member").val();
            if(group != null && typeof(group) != "undefined") {
                dataModel.addMember(group, member);
            }
            dataModel.addMember(DEFAULT_GROUP, member);
        }
    }
}

function saveDataFile() {
    createFile(DATAFILE, JSON.stringify(dataModel));
}