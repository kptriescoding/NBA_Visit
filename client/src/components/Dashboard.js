import { async } from "@firebase/util";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { logout } from "../firebase";
import FileViewer from "react-file-viewer";
import { doc } from "firebase/firestore";

export default function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [fileData, setFileData] = useState(null);

  const [professors, setProfessors] = useState([]);
  const [currentProfessor, setCurrentProfessor] = useState("");
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    // console.log(user);
    if (!user) {
      window.location.href = "/";
      if (loading) return;
    }
    handleGetAllProfessors();
  }, [user]);

  const handleSignOut = async () => {
    await logout();
    console.log("signed out");
    console.log(user);
  };

  const handleFileChange = (event) => {
    // event.preventDefault();
    setSelectedFile(event.target.files[0]);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileData(reader.result);
      };
      console.log(fileData);
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = async () => {
    console.log(selectedFile);
    const formData = new FormData();
    formData.append("file", selectedFile, selectedFile.name);

    instance.post("/professor/addFile", {
      data: {
        file: formData,
        professorEmail: user.email,
      },
    });
  };

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

  async function handleProfessorChanged(professor) {
    let arr;
    try {
      // console.log("here" + professor);
      setCurrentProfessor(professor.professorEmail);
      const allDocuments = await instance.post("/professor/getFiles/", {
        data: {
          email: professor.professorEmail,
        },
      });

      console.log(allDocuments.data.files);
      arr = allDocuments.data.files[0];
      let url=window.location.origin+arr.url
      // USe this url to access the file
      console.log(url);



    } catch (err) {
      console.log(err);
    }
    // setDocuments(() => {
    //   // return arr;
    // });
  }
  const uploadFile=async()=>{
    var file = document.getElementById("myFile").files[0];
    var formData = new FormData();
    formData.append("myFile", file);
    formData.append("email",user.email);
      // ArrayBuffer to blob
      // fileData=new Blob([new Uint8Array(fileData)],{type:file.type});
      // let data={
      //   email:user.email,
      //   fileName:file.name,
      //   fileStream:fileData,
      //   fileType:file.type
      // }
      try{
        const uploadFile=await instance.post("/professor/uploadFile/",formData)
        console.log(uploadFile);
      }
      catch(err){
        console.log(err);
      }
    
  }

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
                <a onClick={()=>logout()}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-between self-center  w-4/5 ">
        <div className="w-1/5 mt-4">
          {professors &&
            professors.map((professor, index) => {
              return (
                <div
                  className={`card  py-2 focus:bg-blue-200 border-b-2 ${
                    currentProfessor &&
                    currentProfessor == professor.professorEmail
                  }?bg-blue-200:"" `}
                  onClick={() => handleProfessorChanged(professor)}
                >
                  {professor.professorName}
                </div>
              );
            })}
        </div>
        {/* documents section */}
        <div className=" border-2 shadow-lg  flex-grow rounded-xl">
          <div className=" flex justify-end">
            {/* Upload Option */}
            <input type="file" onChange={handleFileChange} />
            <button
              className=" flex justify-center items-center py-2.5 pr-16  hover:bg-blue-200 text-black"
              onClick={handleFileUpload}
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
            {documents &&
              documents.map((document, index) => {
                return (
                  <div className="card text-gray-800   py-4 border-b-2 flex flex-col">
                    <p>{document.fileName}</p>
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
      <input type="file" id="myFile" name="filename"/>
  <input type="submit" onClickCapture={uploadFile}></input>
    </div>
  );
}
