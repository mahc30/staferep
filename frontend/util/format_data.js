
function format_obras_data(req){
    let headers = [{title: "Obras"}, {title: "Compositor"}]; //Burn it, cause it´s easier than doing foreachs and formatting a formatting function
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

    data = {headers: headers, rows: rows};
    return data;
}

module.exports = format_obras_data;