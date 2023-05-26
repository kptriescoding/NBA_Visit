import { async } from "@firebase/util";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { logout } from "../firebase";
import { doc } from "firebase/firestore";

export default function Dashboard() {
  const [user, loading, error] = useAuthState(auth);

  const [professors, setProfessors] = useState([]);
  const [currentProfessor, setCurrentProfessor] = useState("");
  const [documents, setDocuments] = useState([]);
  useEffect(() => {
    console.log(user);
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
      console.log(arr);
    } catch (err) {
      console.log(err);
    }
    setProfessors(() => {
      return arr;
    });
  }
  async function handleProfessorChanged(event) {
    event.preventDefault();
    let arr;
    try {
      const allDocuments = await instance.post("/professor/getFiles", {
        data: {
          email: user.email
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
    <div className=" w-full bg-white h-screen">
      <div className="navbar bg-blue-100">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">
            RV College Of Engineering
          </a>
          
        </div>
        <div className="flex-none gap-2">
          {/* <div className="form-control">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered"
            />
          </div> */}
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

      <div className=" w-4/5 bg-white">
        <div>
          {professors &&
            professors.map((professor, index) => {
              return (
                <div
                  className="card bg-blue-100 py-2"
                  onClick={handleProfessorChanged}
                >
                  {professor.professorName}
                </div>
              );
            })}
        </div>
        {/* documents section */}
        <div>
          <div>{/* Upload Option */}</div>
          <div>
            {/* Documents */}
            {documents &&
              documents.map((document, index) => {
                return (
                  <div className="card bg-blue-100 py-2">
                    {document.fileName}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <input type="file" id="myFile" name="filename"/>
  <input type="submit" onClickCapture={uploadFile}></input>
    </div>
  );
}
