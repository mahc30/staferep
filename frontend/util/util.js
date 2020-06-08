function delete_at_index(array, element) {
    console.log(array, element);
    var index = array.findIndex(obj => {return obj.id === element});
    console.log(index);

    array.splice(index, 1);
    return array;
}

module.exports = delete_at_index;