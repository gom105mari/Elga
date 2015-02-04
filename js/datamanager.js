function leaveWherePage() {
    var date = new Ymd();
    date.setDate($("#input_when").val());

    var place = new Place();
    place.name = $("#input_where option:selected").val();

    receipt.setDate(date);
    receipt.setPlace(place);
}

function leaveWhatPage() {
    var menu = new Menu();
    menu.name = $("#list_what input:checked").val();

    var place,key, menus;
    for(var i in dataModel["what"]) {
        key = dataModel["what"][i][PLACE];
        place = receipt.getPlaceName();
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
    receipt.setMenus(menu);
}

function leaveWhoPage() {
    var name = $("#list_what input:checked").val();
    var members = $("#list_member input:checked");
    var menu = receipt.getMenu(name);
    var member;

    $("#list_member input:checked").each(function() {
        member = new Member();
        member.name = $(this).val();
        receipt.setMenus(menu, member);
    });
    console.log(receipt.getTotalPrice());
    alert(JSON.stringify(receipt));
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