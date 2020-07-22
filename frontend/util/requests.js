import util from "./util";

export async function upload_file(file, file_name, obra_id) {
    let data = new FormData(); //Use FormData() for multipart/form-data
    let formatted_file_name = util.format_file_name(file.name, file_name);
    //Renaming the file in the front is necessary because Multer limitations for handling the files
    //TODO validate that file is, indeed, a pdf file
    const newFile = new File([file], formatted_file_name, { type: data.type });
    data.append("file", newFile);

    try {
        await fetch(`http://localhost:3000/obras/upload/${obra_id}`, {
            method: "POST",
            body: data
        });
    } catch (err) {
        console.log(err);
    }
}

export async function delete_element(id) {

    return new Promise(async(resolve, rejected) => {
        try {
            let delete_req = await fetch("http://localhost:3000/obras/delete", {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ obra_id: id })
            });

            if (delete_req.ok) {
                resolve();
            } else rejected("Error Eliminando Obra")
        } catch (error) {
            rejected("Error Eliminando Obra", error)
        }
    })

}

export async function fetch_obra_list(filters) {
    let url = "http://localhost:3000/obras/findall";
    let options = {
        headers: { "Content-type": "application/json" },
        method: "GET"
    };

    if (!(Object.keys(filters).length === 0 && filters.constructor === Object)) {
        options.method = "POST";
        options.body = JSON.stringify(filters);
        url = "http://localhost:3000/obras/findFilter"; //And the API is different
    }

    return new Promise(async(resolve, reject) => {
        try {
            const response = await fetch(url, options);
            const raw_data = await response.json();
            let parsed_data = {
                obras: util.format_obras_data(raw_data),
                composers: util.filter_composer(raw_data)
            };
            resolve(parsed_data)
        } catch {
            reject()
        }
    });
}