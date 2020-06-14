export function format_obras_data(req){
    let headers = [{title: "Obra"}, {title: "Compositor"}, {title:""}, {title:""}, {title:""}]; //Burn it, cause it´s easier than doing foreachs and formatting a formatting function
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

export function format_file_name(file_name, new_name){
    let new_file_name = file_name.split(".");
    new_file_name[0] = new_name;
    return new_file_name.join(".");
}