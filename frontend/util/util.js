exports.find_and_delete = function(array, id) {
    var index = array.findIndex(obj => { return obj.id === id });
    array.splice(index, 1);
    return array;
}

exports.array_contains = function(array, id) {
    console.log("Contains:")
    console.log("Len:", array.length, "Arr:", array);
    let filter = array.filter(obj => { return obj.id === id });
    console.log("Len:", array.length, "Arr:", filter);
    return filter.length > 0
}

exports.format_obras_data = function(req) {
    let headers = [{ title: "Obra" }]; //Burn it, cause it´s easier than doing foreachs and formatting a formatting function
    let rows = [];
    let data = {};

    req.forEach(element => {
        let obra = {
            id: element._id,
            name: element.name,
            composer: element.composer,
            file_exists: element.file_exists,
            level: element.level
        }

        rows = [...rows, obra];
    });

    data = { headers: headers, rows: rows };
    return data;
}

exports.format_file_name = function(file_name, new_name) {
    let new_file_name = file_name.split("."); //Split name by . to get [name, extension]
    new_file_name[0] = new_name;
    return new_file_name.join(".");
}

exports.filter_composer = function(array) {
    let composers = []
    let new_array = [];

    array.forEach(element => {
        composers = [...composers, element.composer];
    });

    new_array = ["Compositor", ...new Set(composers)]; //Apparently ...new SET returns a new array without duplicates :o
    return new_array
}