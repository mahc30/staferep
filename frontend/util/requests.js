import { format_file_name } from "./format_data";

export async function upload_file(file, file_name) {
    let data = new FormData(); //Use FormData() for multipart/form-data
    let formatted_file_name = format_file_name(file.name, file_name);

    //Renaming the file in the front is necessary because Multer limitations for handling the files
    //TODO validate that file is, indeed, a pdf file
    const newFile = new File([file], formatted_file_name, { type: data.type });
    data.append("file", newFile);

    try {
        await fetch("http://localhost:3000/obras/upload", {
            method: "POST",
            body: data
        });
    } catch (err) {
        console.log(err);
    }
}