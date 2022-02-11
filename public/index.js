let uploadBtn = document.querySelector("#btn-upload");
uploadBtn.addEventListener("click", () => {
  //fileInput Element
  let fileInput = document.querySelector("#file-input");
  console.log(fileInput.files);
  //no file provided
  if (fileInput.files.length === 0) return alert("please input file");

  //only one file upload
  if (fileInput.files.length > 1) return alert("please input only one file");

  let formData = new FormData();

  //fileName,file
  console.log("FileName::", fileInput.files[0].name);
  // formData.append(fileInput.files[0].name, fileInput.files[0]);

  formData.append("name", "username");
  formData.append("password", "password");
  formData.append("password", "password");

  let options = {
    method: "POST",
    body: formData,
  };
  fetch("http://localhost:3000/upload", options)
    .then((res) => {
      //response
      res.json().then((text) => {
        console.log(text, "text");
      });
    })
    .catch((error) => {
      console.log("error::", error);
    });

  console.log("thisisclickme");
});
