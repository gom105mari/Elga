var dataModel = new function() {
    this.id;
    this.where = [];
    this.what = [];
    this.who = [];
    this.loadData =  function(response) {
        console.log("[LOAD DATAMODEL] : " + JSON.stringify(response));
        var dataKeys = ["id", "where", "what", "who"];
        var keys = Object.keys(response);
        var dataKey, key;
        for(var i in dataKeys) {
            dataKey = dataKeys[i];
            for(var j in keys) {
                key = keys[j];
                if(dataKey == key) {
                    this[key] = response[key];
                    break;
                }
            }
            // var data = json[key];
            // for(var index in data) {
                // if(data[key] == null) {
                //     APPDATA[key] = [];
                // }

                // if()
                // APPDATA[key].push(data[index]);
                // }
            // }
        }
    };

    this.setData = function(step, value) {
        var keys = Object.keys(this);
        var key;
        for(var index in keys) {
            key = keys[index];
            if(key == step) {
                if(key == "where") {
                    this[key].push(value);
                } else {
                    if(this[key].length > 0) {
                        var isFound = false;
                        var k = Object.keys(value)[0];
                        var innerKey;
                        for(var index in this[key]) {
                            innerKey = Object.keys(this[key][index])[0];
                            if(innerKey == k) {
                                isFound = true;
                                console.log(value[k][0]);
                                this[key][index][innerKey].push(value[k][0]);
                            }
                        }
                        if(!isFound) {
                            this[key].push(value);
                        }
                    } else {
                        this[key].push(value);
                    }
                }
                saveDataFile();
                console.log("[DATAMODEL] " + key + " : " + value + " added");
                break;
            }
        }
    };

    this.addWhere = function(where) {
        dataModel[WHERE].push(where);
        var obj = {};
        obj[PLACE] = where;
        obj[MENUS] = [];
        dataModel[WHAT].push(obj);
        saveDataFile();
    };

    this.addWhat = function(where, name, price) {
        var obj;
        var menu = {};
        menu[NAME] = name;
        menu[PRICE] = price;

        for(var i in dataModel[WHAT]) {
            obj = dataModel[WHAT][i];
            if(obj[PLACE] == where) {
                obj[MENUS].push(menu);
                break;
            }
        }
        saveDataFile();
    };

    this.addGroup = function(group, members) {
        var obj = {};
        obj[GROUP] = group;
        obj[MEMBERS] = [];
        for(var i in members) {
            obj[MEMBERS].push(members[i]);
        }

        dataModel[WHO].push(obj);
        saveDataFile();
    };

    this.addMember = function(group, member) {
        var obj;
        for(var i in dataModel[WHO]) {
            obj = dataModel[WHO][i];
            if(obj[GROUP] == group) {
                if(typeof(obj[MEMBERS]) == "undefined") {
                    obj[MEMBERS] = [];
                }
                obj[MEMBERS].push(member);
                break;
            }
        }
        saveDataFile();
    };
};

// dataModel.prototype = {
//     addWhere : function(where) {
//         dataModel[WHERE].push(where);
//         saveDataFile();
//     },

//     addWhat : function(where, name, price) {
//         var obj;
//         var menu = {
//             NAME : name,
//             PRICE : price
//         };

//         for(var i in dataModel[WHAT]) {
//             obj = dataModel[WHAT][i];
//             if(obj[PLACE] == where) {
//                 obj[MENUS].push(menu);
//                 break;
//             }
//         }
//         saveDataFile();
//     },

//     addGroup : function(group) {
//         var obj = {};
//         obj[GROUP] = group;
//         obj[MEMBERS] = [];
//         dataModel[WHO].push(obj);
//         saveDataFile();
//     },

//     addMember : function(group, member) {
//         var obj;
//         for(var i in dataModel[WHO]) {
//             obj = dataModel[WHO][i];
//             if(obj[GROUP] == group) {
//                 if(obj[MEMBERS] == null || typeof(obj[MEMBERS]) == "undefined") {
//                     obj[MEMBERS] = [];
//                 }
//                 obj[MEMBERS].push(member);
//                 break;
//             }
//         }
//         saveDataFile();
//     }
// }
var ReceiptModel = new function() {

    this.init = function() {
        this.date = null;
        this.place = null;
        this.orders = []; //Menu + Members Array
    };

    this.init();

    this.setDate = function(date) {
        if(date instanceof(Ymd)) {
            this.date = date;
        }
    };

    this.setPlace = function(place) {
        if(place instanceof(Place)) {
            this.place = place;
        }
    };

    this.setMenus = function(menu, member) {
        var isExist = false;
        var _menu;
        var order;
        if(menu instanceof(Menu)) {
            for(var i in this.orders) {
                order = this.orders[i];
                if(order[MENU].name == menu.name) {
                    isExist = true;
                    break;
                }
            }

            if(isExist) {
                if(typeof(order[MEMBERS]) == "undefined") {
                    order[MEMBERS] = [];
                }
                if(typeof(member) != "undefined" && member instanceof(Member)) {
                    order[MEMBERS].push(member);
                }
            } else {
                var item = {};
                item[MENU] = menu;
                item[MEMBERS] = [];
                if(typeof(member) != "undefined" && member instanceof(Member)) {
                    item[MEMBERS].push(member);
                }
                this.orders.push(item);
            }
        }
    };

    this.getMenu = function(name) {
        var order, menu;


        for(var i in this.orders) {
            order = this.orders[i];
            if(order[MENU].name == name) {
                menu = order[MENU];
            }
        }
        return menu;
    };

    this.getPrice = function(menu) {
        var order;
        var total = 0;
        if(menu instanceof(Menu)) {
            for(var i in this.orders) {
                order = this.orders[i];
                if(order[MENU].name == menu.name) {
                    total = (order[MENU].price * order[MEMBERS].length);
                }
            }
        }
        return total;
    };

    this.getTotalPrice = function() {
        var order, price, members;
        var total = 0;
        for(var i in this.orders) {
            order = this.orders[i];
            price = order[MENU].price;
            members = order[MEMBERS];
            total += (price * members.length);
        }
        return total;
    };

    this.getPlaceName = function() {
        return this.place.getPlaceName();
    };
};

function Ymd() {
    this.year;
    this.month;
    this.day;
}

Ymd.prototype = {
    setDate : function(date) {
        var str = date.split("-");
        this.year = str[0];
        this.month = str[1];
        this.day = str[2];
    },

    getDate : function() {
        return this.year + this.month + this.day;
    }
}

function Place() {
    this.name;
    // this.menu = [];
    this.detail;
}

Place.prototype = {
    getPlaceName : function() {
        return this.name;
    }
}

function Menu() {
    this.name;
    this.price;
    // this.member = [];
    this.comment; //부가 설명?
}

function Members() {
    this.members = [];
}

function Member() {
    this.name;
    this.mobile; //폰 넘버(optional)
}

var group = function() {
    this.name;
    this.members = [];
    this.comment;
}
