import { async } from "@firebase/util";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { logout } from "../firebase";
import FileViewer from "react-file-viewer";
import { doc } from "firebase/firestore";
import { FileUploader } from "react-drag-drop-files";

export default function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [fileData, setFileData] = useState(null);

  const [professors, setProfessors] = useState([]);
  const [currentProfessor, setCurrentProfessor] = useState("");
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileTypes = [
    "JPG",
    "JPEG",
    "PNG",
    "GIF",
    "pptx",
    "docs",
    "pdf",
    "csv",
    "xls",
    "xlsx",
    "doc",
    "docx",
    "ppt",
  ];

  // useEffect(() => {
  //   // console.log(user);
  //   // if (!user) {
  //   //   window.location.href = "/";
  //   //   if (loading) return;
  //   // }
  //   // console.log(documents);

  // }, [user]);
useEffect(() => {
  handleGetAllProfessors();
},[]);

  const handleSignOut = async () => {
    await logout();
    console.log("signed out");
    console.log(user);
  };

  const handleFileChange = (file1) => {
    // event.preventDefault();
    setSelectedFile(file1);
    // console.log(selectedFile);
    const file = file1;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileData(reader.result);
      };
      // console.log(fileData);
      reader.readAsDataURL(file);
    }
  };

  // const handleFileUpload = async () => {
  //   console.log(selectedFile);
  //   const formData = new FormData();
  //   formData.append("file", selectedFile, selectedFile.name);

  //   instance.post("/professor/addFile", {
  //     data: {
  //       file: formData,
  //       professorEmail: user.email,
  //     },
  //   });
  // };

  const instance = axios.create({
    baseURL: "http://localhost:8081", // Replace with your server URL
  });

  async function handleGetAllProfessors() {
    let arr;
    try {
      const allProfessors = await instance.post(
        "/professor/getAllProfessors/",
        {
          // email: user?user.email:user,
        }
      );
      arr = allProfessors.data;
      // console.log(arr);
    } catch (err) {
      console.log(err);
    }
    setProfessors(() => {
      return arr;
    });
  }

  const fileOptions = {
    supportedViewers: [
      "pdf",
      "image",
      "audio",
      "video",
      "csv",
      "xls",
      "xlsx",
      "doc",
      "docx",
      "ppt",
      "pptx",
    ],
    // Add any additional options you require, such as watermark, print, etc.
  };

  async function handleProfessorChanged(event,professor) {
    event.preventDefault();
    try {
      // console.log(professor);

      setCurrentProfessor(professor.professorEmail);
      await getFiles(professor.professorEmail);
      // const allDocuments = await instance.post("/professor/getFiles/", {
      //   data: {
      //     email: professor.professorEmail,
      //   },
      // });

      // console.log(allDocuments.data.files);
      // arr = allDocuments.data.files;
      // let url = window.location.origin + arr.url;
      // console.log(arr);
      // USe this url to access the file
      // setDocuments(allDocuments.data.files);
    } catch (err) {
      console.log(err);
    }
    // setDocuments(() => {
    //   // return arr;
    // });
  }

  const getFiles =async(professorEmail) => {
    console.log(professorEmail);
    try {
      const allDocuments = await instance.post("/professor/getFiles/", {
        data: {
          email:professorEmail,
        },
      });
      console.log(allDocuments.data.files);

      // console.log(allDocuments.data.files);

        // let  arr = allDocuments.data.files;
      // let url = window.location.origin + arr.url;
      // console.log(arr);
      // for (let i = 0; i < arr.length; i++) {
      //   arr[i].url = window.location.origin + arr.url;
      // }
      // setDocuments(arr);
    } catch (err) {
      console.log(err);
    }
  };
  const uploadFile = async () => {
    console.log("uploading");
    var file = selectedFile;
    var formData = new FormData();
    formData.append("myFile", file);
    formData.append("email", user.email);
    // ArrayBuffer to blob
    // fileData=new Blob([new Uint8Array(fileData)],{type:file.type});
    // let data={
    //   email:user.email,
    //   fileName:file.name,
    //   fileStream:fileData,
    //   fileType:file.type
    // }
    try {
      const uploadFile = await instance.post(
        "/professor/uploadFile/",
        formData
      );
      console.log(uploadFile);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className=" w-full bg-primary-bg h-screen flex flex-col gap-4">
      <div className="navbar bg-primaryfocus-bg border-b-2 border-x-blue-950 ">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">
            RV College Of Engineering
          </a>
        </div>
        <div className="flex-none gap-2  ">
          <div className="form-control ">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered bg-primary-bg "
            />
          </div>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={user.photoURL} />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-white rounded-box w-52"
            >
              <li>
                <a onClick={() => logout()}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-between self-center  w-4/5 ">
        <div className="w-1/5 mt-4">
          {professors &&
            professors.map((professor) => {
              return (
                <button
                  className="card  py-2 focus:bg-blue-200 border-b-2"
                  onClickCapture={(event)=>handleProfessorChanged(event,professor)}
                >
                  {professor.professorName}
                </button>
              );
            })}
        </div>
        {/* documents section */}
        <div className=" border-2 shadow-lg  flex-grow rounded-xl border-gray-300">
          <div className=" flex justify-end bg-orange-50 rounded-t  border-b-2 ">
            {/* Upload Option */}
            {/* <input
              type="file"
              onChange={handleFileChange}
              id="myFile"
              name="filename"
            /> */}
            <FileUploader
              handleChange={handleFileChange}
              name="filename"
              id="file"
              label="Select or Drop a file"
              className=" w-full my-1  flex-grow"
              style={{
                width: "100%",
                margin: "1px",
              }}
              types={fileTypes}
            />

            <button
              className=" flex justify-center items-center py-2.5 pr-8 pl-8 rounded-e-lg  bg-red-50 hover:bg-orange-100 text-black"
              onClickCapture={uploadFile}
            >
              {/* <span>Upload File</span>  */}
              <span className="material-symbols-outlined rounded-full px-1">
                upload_file
              </span>
              <span>Upload File</span>
            </button>
          </div>
          <div>
            {/* Documents */}
            {!documents &&
              documents.map((document ) => {
                // console.log(document  )
                return (
                  <div className="card text-gray-800   py-4 border-b-2 flex flex-col">
                    <p>{document.fileName}</p>
                    {!document && (
                      <div className=" h-36 flex justify-center">
                        <FileViewer
                          fileType={document.url.split(".").pop().toLowerCase()}
                          filePath={document.url}
                          {...fileOptions}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            <div className="self-center  w-3/5 h-24  ">
              {selectedFile && (
                <div className=" h-36 flex justify-center">
                  <FileViewer
                    fileType={selectedFile.name.split(".").pop().toLowerCase()}
                    filePath={URL.createObjectURL(selectedFile)}
                    {...fileOptions}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <image src="http://localhost:8081/file?fileId=6470e5b1993c559824688fad"></image>
    </div>
  );
}
