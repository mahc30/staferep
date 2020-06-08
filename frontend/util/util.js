exports.delete_at_index = function(array, element) {
    console.log(array, element);
    var index = array.findIndex(obj => {return obj.id === element});
    console.log(index);

    array.splice(index, 1);
    return array;
}
