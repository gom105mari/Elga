//var receipt;

function clearReceipt() {
    ReceiptModel.init();
    console.log("[INIT] : ReceiptModel initialized");
}

function saveReceipt(callback) {
    var title = ReceiptModel.date.getDate() + "_" + ReceiptModel.place.getPlaceName() + "_" + ReceiptModel.getTotalPrice();
    var content = JSON.stringify(ReceiptModel);

    createFile(title, content, callback);
}

function _makeReceiptName() {

}